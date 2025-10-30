import { Router } from "express";
import { allCategories, createCategory, getCategoryById, updateCategory } from "./category.controller.js";
import { validate } from "../../core/middleware/validate.js";
import { createCategorySchema, updateCategorySchema } from "../../shared/validators/category.validator.js";
import isLoggedIn from "../../core/middleware/isLoggedin.js";
import authorizedRoles from "../../core/middleware/authorizedRoles.js";

const categoryRouter = Router();

categoryRouter.post("/create-category", isLoggedIn, authorizedRoles("super-admin"), validate(createCategorySchema), createCategory)
categoryRouter.put("/update-category/:id", isLoggedIn, authorizedRoles("super-admin"), validate(updateCategorySchema), updateCategory)
categoryRouter.get("/get-category/:id", isLoggedIn, authorizedRoles("super-admin"), getCategoryById)
categoryRouter.get("/all-categories", isLoggedIn, authorizedRoles("super-admin"), allCategories)

export default categoryRouter