import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import { IssuedBook } from "../../models/IssuedBook.model.js";
import { Book } from "../../models/Book.model.js";
import { Reader } from "../../models/Reader.model.js";

const issueBook = asyncHandler(async (req, res) => {
    const {
        bookId,
        readerId,
        issuedDate,
        dueDate
    } = req.body;

    // Check required fields
    if (!bookId || !readerId || !issuedDate || !dueDate) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }
    if (!book.isAvailable || book.quantity <= 0) {
        throw new ApiError(400, "Book is not available for issuing");
    }

    // Check if reader exists and is not blocked
    const reader = await Reader.findById(readerId);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }
    if (reader.isBlocked) {
        throw new ApiError(400, "Reader is blocked and cannot issue books");
    }

    // Check if book is already issued to the same reader and not returned
    const existingIssuedBook = await IssuedBook.findOne({
        bookId,
        readerId,
        returnDate: { $exists: false }
    });
    if (existingIssuedBook) {
        throw new ApiError(400, "This book is already issued to the same reader");
    }

    // Create issued book record
    const newIssuedBook = await IssuedBook.create({
        bookId,
        readerId,
        issuedDate: new Date(issuedDate),
        dueDate: new Date(dueDate)
    });

    // Update book quantity and availability
    const updatedQuantity = book.quantity - 1;
    await Book.findByIdAndUpdate(bookId, {
        quantity: updatedQuantity,
        isAvailable: updatedQuantity > 0,
        status: updatedQuantity > 0 ? "available" : "assigned"
    });

    // Populate the response
    await newIssuedBook.populate('bookId', 'title author srNo');
    await newIssuedBook.populate('readerId', 'name email cardNumber');

    return res.status(201).json(
        new ApiResponse(
            201,
            newIssuedBook,
            "Book issued successfully"
        )
    );
});

const getAllIssuedBooks = asyncHandler(async (req, res) => {
    const issuedBooks = await IssuedBook.find({})
        .populate('bookId', 'title author srNo edition')
        .populate('readerId', 'name email cardNumber phoneNumber')
        .select('-__v')
        .sort({ issuedDate: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            issuedBooks,
            "Issued books retrieved successfully"
        )
    );
});

const getIssuedBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const issuedBook = await IssuedBook.findById(id)
        .populate('bookId', 'title author srNo edition price')
        .populate('readerId', 'name email cardNumber phoneNumber address');

    if (!issuedBook) {
        throw new ApiError(404, "Issued book record not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            issuedBook,
            "Issued book record retrieved successfully"
        )
    );
});

const returnBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fine = 0 } = req.body;

    const issuedBook = await IssuedBook.findById(id);
    if (!issuedBook) {
        throw new ApiError(404, "Issued book record not found");
    }

    if (issuedBook.returnDate) {
        throw new ApiError(400, "Book has already been returned");
    }

    // Update return date and fine
    const returnDate = new Date();
    const updatedIssuedBook = await IssuedBook.findByIdAndUpdate(
        id,
        {
            returnDate,
            fine: parseFloat(fine)
        },
        { new: true, runValidators: true }
    ).populate('bookId readerId');

    // Update book quantity and availability
    const book = await Book.findById(issuedBook.bookId);
    const updatedQuantity = book.quantity + 1;
    await Book.findByIdAndUpdate(issuedBook.bookId, {
        quantity: updatedQuantity,
        isAvailable: true,
        status: "available"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedIssuedBook,
            "Book returned successfully"
        )
    );
});

const updateIssuedBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    const issuedBook = await IssuedBook.findById(id);
    if (!issuedBook) {
        throw new ApiError(404, "Issued book record not found");
    }

    // Convert date strings to Date objects if provided
    if (updateData.issuedDate) updateData.issuedDate = new Date(updateData.issuedDate);
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    if (updateData.returnDate) updateData.returnDate = new Date(updateData.returnDate);

    const updatedIssuedBook = await IssuedBook.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('bookId readerId');

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedIssuedBook,
            "Issued book record updated successfully"
        )
    );
});

const deleteIssuedBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const issuedBook = await IssuedBook.findByIdAndDelete(id);
    if (!issuedBook) {
        throw new ApiError(404, "Issued book record not found");
    }

    // If the book wasn't returned, update book quantity
    if (!issuedBook.returnDate) {
        const book = await Book.findById(issuedBook.bookId);
        const updatedQuantity = book.quantity + 1;
        await Book.findByIdAndUpdate(issuedBook.bookId, {
            quantity: updatedQuantity,
            isAvailable: updatedQuantity > 0,
            status: updatedQuantity > 0 ? "available" : "assigned"
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Issued book record deleted successfully"
        )
    );
});

// Get issued books by reader
const getIssuedBooksByReader = asyncHandler(async (req, res) => {
    const { readerId } = req.params;

    const reader = await Reader.findById(readerId);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }

    const issuedBooks = await IssuedBook.find({ readerId })
        .populate('bookId', 'title author srNo edition')
        .select('-__v')
        .sort({ issuedDate: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            issuedBooks,
            "Reader's issued books retrieved successfully"
        )
    );
});

// Get currently issued books (not returned)
const getCurrentIssuedBooks = asyncHandler(async (req, res) => {
    const issuedBooks = await IssuedBook.find({ returnDate: { $exists: false } })
        .populate('bookId', 'title author srNo edition')
        .populate('readerId', 'name email cardNumber phoneNumber')
        .select('-__v')
        .sort({ dueDate: 1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            issuedBooks,
            "Currently issued books retrieved successfully"
        )
    );
});

export {
    issueBook,
    getAllIssuedBooks,
    getIssuedBookById,
    returnBook,
    updateIssuedBook,
    deleteIssuedBook,
    getIssuedBooksByReader,
    getCurrentIssuedBooks
};