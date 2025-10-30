import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: [true, "Category name must be unique"],
        trim: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model("BookCategory", categorySchema);

export default Category