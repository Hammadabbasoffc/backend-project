import z from "zod";

const createIssuedBookSchema = z.object({
    bookId: z
        .string({ message: "Book ID must be a string" })
        .min(1, "Book ID is required"),

    readerId: z
        .string({ message: "Reader ID must be a string" })
        .min(1, "Reader ID is required"),

    issuedDate: z
        .string({ message: "Issued date must be a string" })
        .min(1, "Issued date is required"),

    dueDate: z
        .string({ message: "Due date must be a string" })
        .min(1, "Due date is required"),
});

const updateIssuedBookSchema = z.object({
    returnDate: z
        .string({ message: "Return date must be a string" })
        .optional(),

    fine: z
        .number({ message: "Fine must be a number" })
        .min(0, "Fine must be at least 0")
        .optional(),
});

export { createIssuedBookSchema, updateIssuedBookSchema };