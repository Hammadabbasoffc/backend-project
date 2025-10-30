import z from "zod";

const loginSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string({ message: "Password must be a string" })
        .min(8, "Password must be at least 8 characters long"),
});
export { loginSchema };