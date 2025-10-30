import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import { Reader } from "../../models/Reader.model.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";

const createReader = asyncHandler(async (req, res) => {
    const {
        name,
        fatherName,
        phoneNumber,
        CNIC,
        cardNumber,
        address,
        email,
        age
    } = req.body;

    const imageFile = req.files?.image?.[0];
    const documentFile = req.files?.document?.[0];

    // Check required fields
    if (!name || !fatherName || !phoneNumber || !CNIC || !cardNumber || !address || !email || !age) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if files are uploaded
    if (!imageFile) {
        throw new ApiError(400, "Reader image is required");
    }
    if (!documentFile) {
        throw new ApiError(400, "Document (PDF) is required");
    }

    // Check for existing reader with unique fields
    const existingReader = await Reader.findOne({
        $or: [
            { email },
            { CNIC },
            { cardNumber }
        ]
    });

    if (existingReader) {
        throw new ApiError(409, "Reader with this email, CNIC, or card number already exists");
    }

    // Upload image and document to S3
    let imageUploadResult = null;
    let documentUploadResult = null;
    let imageUrl = null;
    let documentUrl = null;

    try {
        // Upload image
        imageUploadResult = await S3UploadHelper.uploadFile(imageFile, "reader-profiles");
        if (imageUploadResult) {
            imageUrl = await S3UploadHelper.getSignedUrl(imageUploadResult.key);
        }

        // Upload document (PDF)
        documentUploadResult = await S3UploadHelper.uploadFile(documentFile, "reader-documents");
        if (documentUploadResult) {
            documentUrl = await S3UploadHelper.getSignedUrl(documentUploadResult.key);
        }
    } catch (error) {
        throw new ApiError(500, "File upload failed: " + error.message);
    }

    // Create reader in database
    const newReader = await Reader.create({
        name,
        fatherName,
        phoneNumber,
        CNIC,
        cardNumber,
        address,
        email,
        age: parseInt(age),
        image: imageUploadResult.key,
        document: documentUploadResult.key,
    });

    if (!newReader) {
        throw new ApiError(500, "Failed to create reader");
    }

    // Prepare response
    const response = {
        _id: newReader._id,
        name: newReader.name,
        fatherName: newReader.fatherName,
        phoneNumber: newReader.phoneNumber,
        CNIC: newReader.CNIC,
        cardNumber: newReader.cardNumber,
        address: newReader.address,
        email: newReader.email,
        age: newReader.age,
        image: imageUrl,
        document: documentUrl,
        isBlocked: newReader.isBlocked,
        createdAt: newReader.createdAt,
        updatedAt: newReader.updatedAt,
    };

    return res.status(201).json(
        new ApiResponse(
            201,
            response,
            "Reader created successfully"
        )
    );
});

// Get all readers
const getAllReaders = asyncHandler(async (req, res) => {
    const readers = await Reader.find({})
        .select('-__v')
        .sort({ createdAt: -1 });

    // Get signed URLs for images and documents
    const readersWithUrls = await Promise.all(
        readers.map(async (reader) => {
            const imageUrl = await S3UploadHelper.getSignedUrl(reader.image);
            const documentUrl = await S3UploadHelper.getSignedUrl(reader.document);

            return {
                ...reader.toObject(),
                image: imageUrl,
                document: documentUrl
            };
        })
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            readersWithUrls,
            "Readers retrieved successfully"
        )
    );
});

// Get reader by ID
const getReaderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reader = await Reader.findById(id);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }

    const imageUrl = await S3UploadHelper.getSignedUrl(reader.image);
    const documentUrl = await S3UploadHelper.getSignedUrl(reader.document);

    const response = {
        ...reader.toObject(),
        image: imageUrl,
        document: documentUrl
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            "Reader retrieved successfully"
        )
    );
});

// Update reader
const updateReader = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    const reader = await Reader.findById(id);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }

    // Handle file uploads if provided
    if (req.files?.image?.[0]) {
        const imageUploadResult = await S3UploadHelper.uploadFile(req.files.image[0], "reader-profiles");
        updateData.image = imageUploadResult.key;
    }

    if (req.files?.document?.[0]) {
        const documentUploadResult = await S3UploadHelper.uploadFile(req.files.document[0], "reader-documents");
        updateData.document = documentUploadResult.key;
    }

    const updatedReader = await Reader.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    const imageUrl = await S3UploadHelper.getSignedUrl(updatedReader.image);
    const documentUrl = await S3UploadHelper.getSignedUrl(updatedReader.document);

    const response = {
        ...updatedReader.toObject(),
        image: imageUrl,
        document: documentUrl
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            "Reader updated successfully"
        )
    );
});

// Toggle block status
const toggleBlockStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reader = await Reader.findById(id);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }

    reader.isBlocked = !reader.isBlocked;
    await reader.save();

    const imageUrl = await S3UploadHelper.getSignedUrl(reader.image);
    const documentUrl = await S3UploadHelper.getSignedUrl(reader.document);

    const response = {
        ...reader.toObject(),
        image: imageUrl,
        document: documentUrl
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            `Reader ${reader.isBlocked ? 'blocked' : 'unblocked'} successfully`
        )
    );
});

// Delete reader
const deleteReader = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reader = await Reader.findByIdAndDelete(id);
    if (!reader) {
        throw new ApiError(404, "Reader not found");
    }

    // Note: You might want to delete the files from S3 as well
    await S3UploadHelper.deleteFile(reader.image);
    await S3UploadHelper.deleteFile(reader.document);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Reader deleted successfully"
        )
    );
});

export {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    toggleBlockStatus,
    deleteReader
};