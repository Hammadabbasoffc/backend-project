import { Router } from "express";
import { validate } from "../../core/middleware/validate.js";
import { createAdminSchema } from "../../shared/validators/admin.validator.js";
import { createAdmin } from "./admin.controller.js";
import { upload } from "../../core/middleware/multer.js";

const adminRouter = Router();

adminRouter.post("/create-admin", upload.single("image"), validate(createAdminSchema), createAdmin)

export default adminRouter