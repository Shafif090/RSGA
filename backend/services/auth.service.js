const prisma = require("../config/prisma.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env.js");

// Hash password
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
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
  if (
    !userData.communities ||
    !Array.isArray(userData.communities) ||
    userData.communities.length === 0
  ) {
    throw new Error("At least one community must be selected");
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
    },
  });

  // Save communities
  for (const community of userData.communities) {
    await prisma.userCommunity.create({
      data: {
        userId: user.id,
        type: community,
      },
    });
  }

  // Save games (accepts IDs or names). If a name is provided and not found, create it.
  if (userData.games && Array.isArray(userData.games)) {
    for (const g of userData.games) {
      let gameRecord = null;
      const isUuid =
        typeof g === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          g
        );

      if (isUuid) {
        gameRecord = await prisma.game.findUnique({ where: { id: g } });
      } else {
        gameRecord = await prisma.game.findUnique({ where: { name: g } });
        if (!gameRecord) {
          // Infer community type from name (fallback to ESPORTS unless it's clearly outdoor)
          const inferredType =
            String(g).toLowerCase() === "futsal" ? "OUTDOOR" : "ESPORTS";
          gameRecord = await prisma.game.create({
            data: { name: g, type: inferredType },
          });
        }
      }

      if (!gameRecord) {
        // Skip invalid references silently; alternatively, throw an error
        continue;
      }

      await prisma.userGame.create({
        data: {
          userId: user.id,
          gameId: gameRecord.id,
        },
      });
    }
  }

  // Save hub assignment
  if (userData.hubId) {
    await prisma.userHub.create({
      data: {
        userId: user.id,
        hubId: userData.hubId,
        status: "ASSIGNED",
      },
    });
  }

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
