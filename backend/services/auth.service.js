import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
  return bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register user
export const registerUser = async (userData) => {
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }],
    },
  });

  if (existingUser) {
    throw new Error("User with this email or phone number already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create verification token
  const verificationToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
      verificationToken,
      school: userData.school,
      grade: userData.grade,
      section: userData.section,
      shift: userData.shift,
      facebook: userData.facebook,
      instagram: userData.instagram,
      discord: userData.discord,
    },
  });

  // TODO: Implement email sending here
  console.log(`Verification token for ${user.email}: ${verificationToken}`);

  return user;
};

// Verify email
export const verifyEmail = async (token) => {
  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new Error("Invalid verification token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
    },
  });

  return user;
};

// Login user
export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.verified) {
    throw new Error("Please verify your email first");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  return { user, token };
};
