import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


const storeCookies = (res, payload) => {


    const isProduction = process.env.NODE_ENV === 'production'
    console.log(process.env.JWT_SECRET);

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
    console.log(token);

    console.log("I am here to check  cookies");

    res.cookie("login", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    })
}

export default storeCookies