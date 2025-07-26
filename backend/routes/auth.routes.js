import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", (req, res) => res.send({ title: "Register" }));
authRouter.post("/login", (req, res) => res.send({ title: "Login" }));
authRouter.post("/log-out", (req, res) => res.send({ title: "Log out" }));

export default authRouter;
