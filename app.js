import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./src/core/middleware/errorHandler.js";
import adminRouter from "./src/modules/admin/admin.route.js";
import categoryRouter from "./src/modules/category/category.route.js";
import authRouter from "./src/modules/auth/auth.route.js";
import cookieParser from "cookie-parser";
import readerRouter from "./src/modules/reader/reader.route.js";
import issuedBookRouter from "./src/modules/issuedBook/issuedBook.route.js";
import bookRouter from "./src/modules/book/book.route.js";


const app = express()

dotenv.config()

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/auth', authRouter)
app.use('/api/readers', readerRouter);
app.use('/api/books', bookRouter);
app.use('/api/issued-books', issuedBookRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Server is running smoothly - Module Structure',
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler)

export default app