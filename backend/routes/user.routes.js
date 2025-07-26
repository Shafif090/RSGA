import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Public routes
userRouter.post("/", (req, res) => res.send({ title: "create new user" }));

// Protected routes
userRouter.use(authenticate);

userRouter.get("/", (req, res) => res.send({ title: "GET all users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET user details" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE user" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE user" }));

export default userRouter;
