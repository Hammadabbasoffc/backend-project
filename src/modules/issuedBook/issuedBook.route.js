import { Router } from "express";
import { validate } from "../../core/middleware/validate.js";
import { createIssuedBookSchema, updateIssuedBookSchema } from "../../shared/validators/issuedBook.validator.js";
import {
    issueBook,
    getAllIssuedBooks,
    getIssuedBookById,
    returnBook,
    updateIssuedBook,
    deleteIssuedBook,
    getIssuedBooksByReader,
    getCurrentIssuedBooks
} from "./issuedBook.controller.js";
import isLoggedIn from "../../core/middleware/isLoggedin.js";
import authorizedRoles from "../../core/middleware/authorizedRoles.js";

const issuedBookRouter = Router();

issuedBookRouter.post(
    "/issue",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin", "manager"),
    validate(createIssuedBookSchema),
    issueBook
);

issuedBookRouter.get(
    "/get-all-issued-books",
    isLoggedIn,
    getAllIssuedBooks
);

issuedBookRouter.get(
    "/get-current-issued-books",
    isLoggedIn,
    getCurrentIssuedBooks
);

issuedBookRouter.get(
    "/get-issued-book/:id",
    isLoggedIn,
    getIssuedBookById
);

issuedBookRouter.get(
    "/get-issued-books-by-reader/:readerId",
    isLoggedIn,
    getIssuedBooksByReader
);

issuedBookRouter.patch(
    "/return-book/:id/return",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin", "manager"),
    validate(updateIssuedBookSchema),
    returnBook
);

issuedBookRouter.put(
    "/update-issued-book/:id",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin", "manager"),
    validate(updateIssuedBookSchema),
    updateIssuedBook
);

issuedBookRouter.delete(
    "/delete-issued-book/:id",
    isLoggedIn,
    authorizedRoles("super-admin", "manager"),
    deleteIssuedBook
);

export default issuedBookRouter;