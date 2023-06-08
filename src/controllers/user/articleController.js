import Article from "../../models/articleModel.js";
import { format } from "date-fns";
import { id } from "date-fns/locale/index.js";

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

export const getArticles = async (request, response) => {
  try {
    const articles = await Article.findAll();

    if (articles.length === 0) {
      return response
        .status(404)
        .json(createErrorResponse("No articles found"));
    }

    const formattedArticles = articles.map((article) => {
      const formattedDate = format(
        new Date(article.published_at),
        "dd MMMM yyyy",
        { locale: id }
      );

      return { ...article.toJSON(), published_at: formattedDate };
    });

    response
      .status(200)
      .json(
        createSuccessResponse("Fetched data success", { formattedArticles })
      );
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const getArticleById = async (request, response) => {
  try {
    const { articleId } = request.params;

    const article = await Article.findByPk(articleId);

    if (!article) {
      return response
        .status(404)
        .json(createErrorResponse("Article not found"));
    }

    const formattedDate = format(
      new Date(article.published_at),
      "dd MMMM yyyy",
      { locale: id }
    );

    const formattedArticle = {
      ...article.toJSON(),
      published_at: formattedDate,
    };

    response
      .status(200)
      .json(createSuccessResponse("Fetched article success", formattedArticle));
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const getLatestArticles = async (request, response) => {
  try {
    const articles = await Article.findAll({
      order: [["published_at", "DESC"]],
      limit: 5, // Mengambil 5 artikel terbaru
    });

    if (articles.length === 0) {
      return response
        .status(404)
        .json(createErrorResponse("No articles found"));
    }

    const formattedArticles = articles.map((article) => {
      const formattedDate = format(
        new Date(article.published_at),
        "dd MMMM yyyy",
        { locale: id }
      );

      return { ...article.toJSON(), published_at: formattedDate };
    });

    response.status(200).json(
      createSuccessResponse("Fetched latest articles success", {
        formattedArticles,
      })
    );
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};
