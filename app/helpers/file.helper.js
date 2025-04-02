
const multer = require('multer');
const path = require('path');

// File Upload Helper
const fileUploadHelper = (destinationFolder) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    });
};

module.exports = fileUploadHelper;