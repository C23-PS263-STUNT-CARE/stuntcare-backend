import { PrismaClient } from "@prisma/client";
import multer from "multer";
// import path from "path";

import { Storage } from "@google-cloud/storage";

const prisma = new PrismaClient();

// Konfigurasi penyimpanan file

const storage = new Storage({
  projectId: "Project-id-google-cloud",
  serviceAccount: "service-account.json",
});

const bucket = storage.bucket("bucket-name");

/* const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "src/images/articles");
  },
  filename: function (request, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    callback(null, uniqueSuffix + ext);
  },
}); */

// Inisialisasi multer
const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export const createArticle = async (request, response) => {
  try {
    upload.single("image")(request, response, async function (error) {
      if (error instanceof multer.MulterError) {
        return response.status(400).json({ message: "Failed to upload image" });
      } else if (error) {
        return response.status(500).json({ message: "Internal server error" });
      }

      const { title, excerpt, content } = request.body;
      const imageFile = request.file;

      const publishedAt = new Date();

      // Generate a unique filename for the uploaded image
      const filename =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(imageFile.originalname);

      // Create a write stream to upload the file to Google Cloud Storage
      const fileStream = bucket.file(filename).createWriteStream();

      fileStream.on("error", () => {
        response.status(500).json({ message: "Failed to upload image" });
      });

      fileStream.on("finish", async () => {
        await prisma.articles.create({
          data: {
            title,
            excerpt,
            content,
            published_at: publishedAt,
            image: filename,
          },
        });
      });

      response.status(201).json({ message: "Article Created" });

      fileStream.end(imageFile.buffer);
    });
  } catch (error) {
    console.log(error); // Cetak pesan kesalahan ke konsol
    response.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArticle = async (request, response) => {
  try {
    const { id } = request.params;

    const articleId = parseInt(id);

    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return response.status(404).json({ message: "Article not found" });
    }

    await prisma.articles.delete({ where: { id: articleId } });

    response.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};
