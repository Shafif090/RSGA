import {
  registerUser,
  verifyEmail,
  loginUser,
} from "../services/auth.service.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
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
export const verify = async (req, res) => {
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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
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
