import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import Admin from "../../models/Admin.model.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";


const createAdmin = asyncHandler(async (req, res) => {
    // Logic to create an admin user
    const { name, fatherName, email, password, role, address, phone, cnic, age } = req.body;
    const image = req.file;

    if (!name || !fatherName || !email || !password || !address || !phone || !cnic || !age) {
        throw new ApiError(400, "All fields are required");
    }
    if (!image) {
        throw new ApiError(400, "Admin image is required");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this email already exists");
    }



    let uploadResult = null;
    let imageUrl = null;
    if (image) {
        uploadResult = await S3UploadHelper.uploadFile(image, "user-profiles");
    }

    if (uploadResult) {
        imageUrl = await S3UploadHelper.getSignedUrl(uploadResult.key);
    }

    console.log(uploadResult);
    console.log(imageUrl);


    const newAdmin = await Admin.create({
        name,
        fatherName,
        email,
        password,
        role,
        address,
        phone,
        cnic,
        age,
        image: uploadResult.key,

    });

    if (!newAdmin) {
        throw new ApiError(500, "Failed to create admin");
    }

    const response = {
        _id: newAdmin._id,
        name: newAdmin.name,
        fatherName: newAdmin.fatherName,
        email: newAdmin.email,
        role: newAdmin.role,
        address: newAdmin.address,
        phone: newAdmin.phone,
        cnic: newAdmin.cnic,
        age: newAdmin.age,
        image: imageUrl,
    };

    console.log(response);


    return res.status(201).json(
        new ApiResponse(
            201,
            response,
            "Admin created successfully"
        )
    )


});

export {
    createAdmin
};