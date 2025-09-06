const prisma = require("../config/prisma.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env.js");

// Hash password
exports.hashPassword = async (password) => {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(password, salt);
};

// Verify password
exports.verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register user
exports.registerUser = async (userData) => {
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }],
    },
  });
  if (existingUser) {
    throw new Error("User with this email or phone number already exists");
  }

  // Validate required fields
  if (
    !userData.fullName ||
    !userData.email ||
    !userData.phoneNumber ||
    !userData.password
  ) {
    throw new Error("Missing required fields");
  }
  if (userData.password !== userData.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  if (!Array.isArray(userData.communities)) {
    userData.communities = [];
  }

  // Hash password
  const hashedPassword = await exports.hashPassword(userData.password);

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
      hubId: userData.hubId || null,
      communities: userData.communities,
      games: Array.isArray(userData.games) ? userData.games : [],
    },
  });
  // Persisted hubId, communities[], games[] on User per new schema

  // TODO: Implement email sending here
  console.log(`Verification token for ${user.email}: ${verificationToken}`);

  return user;
};

// Verify email
exports.verifyEmail = async (token) => {
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
exports.loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.verified) {
    throw new Error("Please verify your email first");
  }

  const isPasswordValid = await exports.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = exports.generateToken(user);
  return { user, token };
};
