const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fail } = require('../utils/ApiResponse');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/profile-pictures');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: userid-timestamp-originalname
        const filename = new Date().toISOString().replace(/:/g,"-") + file.originalname;
        cb(null, filename);
    }
});

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware for single file upload
const uploadProfilePicture = upload.single('profilePicture');

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return fail(res, "File too large. Maximum size is 5MB")
        }
    } else if (err) {
        return fail(res, err.message)
    }
    next();
};

module.exports = {
    uploadProfilePicture,
    handleUploadError
};