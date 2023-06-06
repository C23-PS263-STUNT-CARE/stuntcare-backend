import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "src/images/articles");
  },
  filename: function (request, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, uniqueSuffix + ext);
  },
});

// Inisialisasi multer
const upload = multer({ storage: storage });

export const createInfo = async (request, response) => {
  try {
    upload.single("image")(request, response, async function (error) {
      if (error instanceof multer.MulterError) {
        return response.status(400).json({ message: "Failed to upload image" });
      } else if (error) {
        return response.status(500).json({ message: "Internal server error" });
      }

      const image = request.file ? request.file.filename : null;

      await prisma.info.create({
        data: {
          image_url: image,
        },
      });

      response.status(201).json({ message: "Info Created" });
    });
  } catch (error) {
    console.log(error); // Cetak pesan kesalahan ke konsol
    response.status(500).json({ message: "Internal server error" });
  }
};
