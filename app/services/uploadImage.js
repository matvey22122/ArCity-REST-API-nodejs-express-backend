import multer from "multer";
import uuidv4 from "uuid/v4";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({storage: storage, fileFilter: fileFilter});

export default upload;