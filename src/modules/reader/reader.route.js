import { Router } from "express";
import { validate } from "../../core/middleware/validate.js";
import { createReaderSchema, updateReaderSchema } from "../../shared/validators/reader.validator.js";
import {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    toggleBlockStatus,
    deleteReader
} from "./reader.controller.js";
import { readerUpload } from "../../core/middleware/multer.js";
import isLoggedIn from "../../core/middleware/isLoggedin.js";
import authorizedRoles from "../../core/middleware/authorizedRoles.js";

const readerRouter = Router();

// Create reader
readerRouter.post(
    "/create",
    isLoggedIn,
    authorizedRoles("librarian"),
    readerUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]),
    validate(createReaderSchema),
    createReader
);

// Get all readers
readerRouter.get(
    "get-all-readers",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin"),
    getAllReaders
);

// Get reader by ID
readerRouter.get(
    "/get-by-id/:id",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin"),
    getReaderById
);

// Update reader
readerRouter.put(
    "/update-reader/:id",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin"),
    readerUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]),
    validate(updateReaderSchema),
    updateReader
);

// Toggle block status
readerRouter.patch(
    "/toggle-block-status/:id/block",
    isLoggedIn,
    authorizedRoles("librarian", "super-admin"),
    toggleBlockStatus
);

// Delete reader
readerRouter.delete(
    "/delete-reader/:id",
    isLoggedIn,
    authorizedRoles("super-admin"),
    deleteReader
);

export default readerRouter;