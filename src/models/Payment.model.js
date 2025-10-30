import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        readerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reader",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: String,
            enum: ["month", "year"],
            default: "month",
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        paymentExpiry: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);