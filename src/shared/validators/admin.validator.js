import z from "zod";

const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
const phoneRegex = /^(?:\+92|0)?3[0-9]{9}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const createAdminSchema = z.object({
    name: z
        .string({ message: "Name must be a string" })
        .min(3, "Name must be at least 3 characters long"),

    fatherName: z
        .string({ message: "Father name must be a string" })
        .min(3, "Father name must be at least 3 characters long"),

    email: z
        .email("Invalid email address"),

    password: z
        .string({ message: "Password must be a string" })
        .regex(
            passwordRegex,
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        ),

    role: z
        .enum(["librarian", "super-admin", "manager"])
        .default("librarian"),

    address: z
        .string({ message: "Address must be a string" })
        .min(5, "Address must be at least 5 characters long"),

    phone: z
        .string({ message: "Phone number must be a string" })
        .regex(phoneRegex, "Invalid Pakistani phone number format"),

    cnic: z
        .string({ message: "CNIC must be a string" })
        .regex(cnicRegex, "Invalid Pakistani CNIC format (e.g., 12345-1234567-1)"),

    age: z
        .number({ message: "Age must be a number" })
        .min(18, "Age must be at least 18")
        .max(80, "Age must be less than 80"),

    isBlocked: z.boolean().optional(),

    image: z.string().optional(),
});

const updateAdminSchema = createAdminSchema.partial();

export { createAdminSchema, updateAdminSchema };
