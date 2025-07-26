import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await getDashboardData(userId);

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
