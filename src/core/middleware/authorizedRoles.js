import { ApiError } from "../utils/api-error.js";


const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            throw new ApiError(403, "Forbidden: You do not have access to this resource");
        }
        next();
    };
}
export default authorizedRoles;