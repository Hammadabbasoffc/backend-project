import z from "zod";

const createCategorySchema = z.object({
    name: z.string("Name must be a string").min(3, "Name must be at least 3 characters long")
})

const updateCategorySchema = z.object({
    name: z.string("Name must be a string").min(3, "Name must be at least 3 characters long").optional()
})

export { createCategorySchema, updateCategorySchema }