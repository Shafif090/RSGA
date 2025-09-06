const {
  registerUser,
  verifyEmail,
  loginUser,
} = require("../services/auth.service.js");

// Register a new user
exports.register = async (req, res) => {
  try {
    // Map frontend fields to backend expected structure
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      school,
      grade,
      section,
      shift,
      facebook,
      instagram,
      discord,
      communities, // array of 'ESPORTS', 'OUTDOOR'
      games, // array of game IDs
      hubId, // selected hub ID
    } = req.body;

    const user = await registerUser({
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      school,
      grade,
      section,
      shift,
      facebook,
      instagram,
      discord,
      communities,
      games,
      hubId,
    });
    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification.",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify email
exports.verify = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await verifyEmail(token);

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    // Set JWT as httpOnly cookie (path must be / for all API routes)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          hubId: user.hubId,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout route to clear cookie (for completeness)
exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true, message: "Logged out" });
};
