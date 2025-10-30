import z from "zod";

const createBookSchema = z.object({
    title: z
        .string({ message: "Title must be a string" })
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),

    author: z
        .string({ message: "Author must be a string" })
        .min(1, "Author is required")
        .max(100, "Author name must be less than 100 characters"),

    srNo: z
        .string({ message: "Serial number must be a string" })
        .min(1, "Serial number is required"),

    edition: z
        .string({ message: "Edition must be a string" })
        .min(1, "Edition is required"),

    price: z
        .number({ message: "Price must be a number" })
        .min(0, "Price must be at least 0"),

    quantity: z
        .number({ message: "Quantity must be a number" })
        .min(0, "Quantity must be at least 0"),

    categoryId: z
        .string({ message: "Category ID must be a string" })
        .min(1, "Category ID is required"),
});

const updateBookSchema = createBookSchema.partial();

export { createBookSchema, updateBookSchema };