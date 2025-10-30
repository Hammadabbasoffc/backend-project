import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["assigned", "available"],
            default: "available",
        },
        srNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        edition: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookCategory",
            required: true,
        },
    },
    { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);