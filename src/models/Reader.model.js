import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        fatherName: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        CNIC: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        document: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Reader = mongoose.model("Reader", readerSchema);