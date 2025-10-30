import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import storeCookies from "../../shared/helpers/cookies.helper.js";
import Admin from "../../models/Admin.model.js";
import bcrypt from "bcryptjs";


const logIn = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new ApiError(404, "Admin not found")
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    const payLoad = {
        id: admin._id,
        role: admin.role,
        email: admin.email,
    }

    storeCookies(res, payLoad)

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                admin,
                "Category created successfully"
            )
        );



})

const logOut = asyncHandler(async (req, res) => {
    res.clearCookie("login", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Logged out successfully"
            )
        );
})



export { logIn, logOut };