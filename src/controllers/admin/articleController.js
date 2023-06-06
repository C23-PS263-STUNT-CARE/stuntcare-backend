import { PrismaClient } from "@prisma/client";
import multer from "multer";
import util from "util";
import path from "path";

import { Storage } from "@google-cloud/storage";

const prisma = new PrismaClient();

// Konfigurasi penyimpanan file

let processFile = multer({
  storage: multer.memoryStorage(),
}).single("file");

let processFileMiddleware = util.promisify(processFile);

const storage = new Storage({
  projectId: "your_project_id",
  serviceAccount: "your_service_account.json",
});

const bucket = storage.bucket("your_bucket_name");

export const createArticle = async (request, response) => {
  try {
    await processFileMiddleware(request, response);

    if (!request.file) {
      return response.status(400).json({ message: "Please upload a file!" });
    }

    const { title, excerpt, content } = request.body;
    const imageFile = request.file;

    const publishedAt = new Date();

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

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    fileStream.on("finish", async () => {
      try {
        await prisma.articles.create({
          data: {
            title,
            excerpt,
            content,
            published_at: publishedAt,
            image: imageUrl,
          },
        });

        const file = bucket.file(filename);
        await file.makePublic();

        response.status(201).json({ message: "Article Created" });
      } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal server error" });
      }
    });

    response.status(201).json({ message: "Article Created" });

    fileStream.end(imageFile.buffer);
  } catch (error) {
    console.log(error);
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
