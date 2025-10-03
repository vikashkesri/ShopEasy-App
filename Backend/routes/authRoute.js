import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  createOrderController,
  getOrdersController,
  updateOrderController,
} from "../controllers/authController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({ success: true, ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ success: true, ok: true });
});

router.put("/update-profile", requireSignIn, updateProfileController);

router.post("/orders", requireSignIn, createOrderController);
router.get("/all-orders", requireSignIn, isAdmin, getOrdersController);
router.put("/order-status/:orderId", requireSignIn, isAdmin, updateOrderController);

export default router;
