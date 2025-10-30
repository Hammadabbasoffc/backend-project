import { Router } from "express";
import { logIn, logOut } from "./auth.controller.js";
import { loginSchema } from "../../shared/validators/auth.validator.js";
import { validate } from "../../core/middleware/validate.js";
import isLoggedIn from "../../core/middleware/isLoggedin.js";

const authRouter = Router();

authRouter.post("/login", validate(loginSchema), logIn);
authRouter.post("/logout", isLoggedIn, logOut);

export default authRouter;