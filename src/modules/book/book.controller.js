import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import { Book } from "../../models/Book.model.js";
import Category from "../../models/BookCategory.model.js";

const createBook = asyncHandler(async (req, res) => {
    const {
        title,
        author,
        srNo,
        edition,
        price,
        quantity,
        categoryId
    } = req.body;

    // Check required fields
    if (!title || !author || !srNo || !edition || !price || !quantity || !categoryId) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Check if book with same serial number exists
    const existingBook = await Book.findOne({ srNo });
    if (existingBook) {
        throw new ApiError(409, "Book with this serial number already exists");
    }

    const newBook = await Book.create({
        title,
        author,
        srNo,
        edition,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId,
        isAvailable: parseInt(quantity) > 0
    });

    // Populate category name in response
    await newBook.populate('categoryId', 'name');

    return res.status(201).json(
        new ApiResponse(
            201,
            newBook,
            "Book created successfully"
        )
    );
});

const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({})
        .populate('categoryId', 'name')
        .select('-__v')
        .sort({ createdAt: -1 });
    if (books.length === 0) {
        throw new ApiError(404, "No books found");
    }




    return res.status(200).json(
        new ApiResponse(
            200,
            books,
            "Books retrieved successfully"
        )
    );
});

const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id).populate('categoryId', 'name');
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            book,
            "Book retrieved successfully"
        )
    );
});

const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // Check if category exists when updating categoryId
    if (updateData.categoryId) {
        const category = await Category.findById(updateData.categoryId);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
    }

    // Check if serial number is being updated and already exists
    if (updateData.srNo && updateData.srNo !== book.srNo) {
        const existingBook = await Book.findOne({ srNo: updateData.srNo });
        if (existingBook) {
            throw new ApiError(409, "Book with this serial number already exists");
        }
    }

    // Update availability based on quantity
    if (updateData.quantity !== undefined) {
        updateData.isAvailable = parseInt(updateData.quantity) > 0;
        updateData.status = parseInt(updateData.quantity) > 0 ? "available" : "assigned";
    }

    const updatedBook = await Book.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedBook,
            "Book updated successfully"
        )
    );
});

const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Book deleted successfully"
        )
    );
});

// Get books by category
const getBooksByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const books = await Book.find({ categoryId })
        .populate('categoryId', 'name')
        .select('-__v')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            books,
            "Books retrieved successfully"
        )
    );
});

// Get available books
const getAvailableBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ isAvailable: true })
        .populate('categoryId', 'name')
        .select('-__v')
        .sort({ title: 1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            books,
            "Available books retrieved successfully"
        )
    );
});

export {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    getBooksByCategory,
    getAvailableBooks
};