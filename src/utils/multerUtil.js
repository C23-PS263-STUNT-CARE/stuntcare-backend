import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "public/images/article"); // Ganti dengan path folder penyimpanan yang sesuai
  },
  filename: function (request, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, uniqueSuffix + ext);
  },
});

// Inisialisasi multer
const upload = multer({ storage: storage });

// Middleware untuk upload single file
export const uploadSingle = (fieldName) => upload.single(fieldName);

export default upload;
