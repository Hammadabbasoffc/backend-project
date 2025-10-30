import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/api-error.js";

dotenv.config();

const isLoggedIn = (req, res, next) => {
    console.log("Cookies:", req.cookies); // ✅ should show your token

    const token = req.cookies?.login; // ✅ correct way

    if (!token) {
        throw new ApiError(400, "Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        console.log("Decoded token:", decoded);
        next();
    } catch (error) {
        throw new ApiError(400, "Unauthorized: Invalid token");
    }
};

export default isLoggedIn;
