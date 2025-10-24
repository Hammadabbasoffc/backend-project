import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Admin name is required"],
    },
    fatherName: {
        type: String,
        required: [true, "Admin name is required"],
    },
    email: {
        type: String,
        required: [true, "Admin email is required"],
        unique: [true, "Admin email must be unique"],
    },
    password: {
        type: String,
        required: [true, "Admin password is required"],
    },
    role: {
        type: String,
        enum: ["librarian", "super-admin", "manager"],
        default: "librarian",
    },
    address: {
        type: String,
        required: [true, "Admin address is required"],
    },
    phone: {
        type: String,
        required: [true, "Admin phone is required"],
        unique: [true, "Admin phone must be unique"],
    },
    cnic: {
        type: String,
        required: [true, "Admin cnic is required"],
        unique: [true, "Admin cnic must be unique"],
    },
    age: {
        type: Number,
        required: [true, "Admin age is required"],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String
    }
}, {
    timestamps: true
})

adminSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10)
    }
    next()

})

const Admin = mongoose.model("Admin", adminSchema);

export default Admin