import z from "zod";

const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
const phoneRegex = /^(?:\+92|0)?3[0-9]{9}$/;

const createReaderSchema = z.object({
    name: z
        .string({ message: "Name must be a string" })
        .min(3, "Name must be at least 3 characters long"),

    fatherName: z
        .string({ message: "Father name must be a string" })
        .min(3, "Father name must be at least 3 characters long"),

    phoneNumber: z
        .string({ message: "Phone number must be a string" })
        .regex(phoneRegex, "Invalid Pakistani phone number format"),

    CNIC: z
        .string({ message: "CNIC must be a string" })
        .regex(cnicRegex, "Invalid Pakistani CNIC format (e.g., 12345-1234567-1)"),

    cardNumber: z
        .string({ message: "Card number must be a string" })
        .min(1, "Card number is required"),

    address: z
        .string({ message: "Address must be a string" })
        .min(5, "Address must be at least 5 characters long"),

    email: z
        .email("Invalid email address"),

    age: z
        .number({ message: "Age must be a number" })
        .min(0, "Age must be at least 0"),
});

const updateReaderSchema = createReaderSchema.partial();

export { createReaderSchema, updateReaderSchema };