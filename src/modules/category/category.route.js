import { Router } from "express";
import { allCategories, createCategory, getCategoryById, updateCategory } from "./category.controller.js";
import { validate } from "../../core/middleware/validate.js";
import { createCategorySchema, updateCategorySchema } from "../../shared/validators/category.validator.js";

const categoryRouter = Router();

categoryRouter.post("/create-category", validate(createCategorySchema), createCategory)
categoryRouter.put("/update-category/:id", validate(updateCategorySchema), updateCategory)
categoryRouter.get("/get-category/:id", getCategoryById)
categoryRouter.get("/all-categories", allCategories)

export default categoryRouter