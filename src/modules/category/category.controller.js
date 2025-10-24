import Category from "../../models/Category.model.js"
import { asyncHandler } from "../../core/utils/async-handler.js"
import { ApiError } from "../../core/utils/api-error.js"
import { ApiResponse } from "../../core/utils/api-response.js"


const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    if (!name) {
        throw new ApiError(400, "Category name is required")
    }
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists")
    }

    const category = await Category.create({ name })
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                category,
                "Category created successfully"
            )
        );
})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!name) {
        throw new ApiError(400, "Category name is required")
    }

    if (!id) {
        throw new ApiError(400, "Category id is required")
    }


    const category = await Category.findOneAndUpdate({ _id: id }, { name }, { new: true })




    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                category,
                "Category created successfully"
            )
        );
})

const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Category id is required")
    }
    const category = await Category.findOne({ _id: id })
    if (!category) {
        throw new ApiError(400, "Category not found")
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                category,
                "Category retrived successfully"
            )
        );
})

const allCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                categories,
                "Categories retrived successfully"
            )
        );
})
export { createCategory, updateCategory, getCategoryById, allCategories }