import Article from "../../models/articleModel.js";
import multer from "multer";
import util from "util";
import path from "path";

import { Storage } from "@google-cloud/storage";

// Konfigurasi penyimpanan file

let processFile = multer({
  storage: multer.memoryStorage(),
}).single("image");

let processFileMiddleware = util.promisify(processFile);

const storage = new Storage({
  projectId: "your_project_id",
  serviceAccount: process.env.SERVICE_ACCOUNT,
});

const bucket = storage.bucket("your_bucket_name");

export const createArticle = async (request, response) => {
  try {
    await processFileMiddleware(request, response);

    if (!request.file) {
      return response.status(400).json({ message: "Please upload a file!" });
    }

    const { title, excerpt, content, tag } = request.body;
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
        await Article.create({
          data: {
            title,
            excerpt,
            content,
            published_at: publishedAt,
            image: imageUrl,
            tag,
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
