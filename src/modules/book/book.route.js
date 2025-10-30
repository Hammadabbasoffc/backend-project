import { Router } from "express";
import { validate } from "../../core/middleware/validate.js";
import { createBookSchema, updateBookSchema } from "../../shared/validators/book.validator.js";
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    getBooksByCategory,
    getAvailableBooks
} from "./book.controller.js";
import isLoggedIn from "../../core/middleware/isLoggedin.js";
import authorizedRoles from "../../core/middleware/authorizedRoles.js";

const bookRouter = Router();

bookRouter.post(
    "/create",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin", "manager"),
    validate(createBookSchema),
    createBook
);

bookRouter.get(
    "/get-all-books",
    isLoggedIn,
    getAllBooks
);

bookRouter.get(
    "/get-available-books",
    isLoggedIn,
    getAvailableBooks
);

bookRouter.get(
    "/get-book-by-id/:id",
    isLoggedIn,
    getBookById
);

bookRouter.get(
    "/get-books-by-category/:categoryId",
    isLoggedIn,
    getBooksByCategory
);

bookRouter.put(
    "/update-book/:id",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin", "manager"),
    validate(updateBookSchema),
    updateBook
);

bookRouter.delete(
    "/delete-book/:id",
    isLoggedIn,
    authorizedRoles("super-admin", "manager"),
    deleteBook
);

export default bookRouter;