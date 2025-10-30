import mongoose from "mongoose";

const issuedBookSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        readerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reader",
            required: true,
        },
        issuedDate: {
            type: Date,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
        },
        fine: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

export const IssuedBook = mongoose.model("IssuedBook", issuedBookSchema);