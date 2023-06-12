import Article from "../../models/articleModel.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/responseUtil.js";

export const getArticles = async (request, response) => {
  try {
    const { latest } = request.query;
    let articles;

    if (latest) {
      articles = await Article.findAll({
        attributes: [
          "id",
          "title",
          "content",
          "image_url",
          "label",
          "published_at",
          "author",
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(latest),
        where: {
          id: {
            [Op.ne]: 1,
          },
        },
      });
    } else {
      articles = await Article.findAll({
        attributes: [
          "id",
          "title",
          "content",
          "image_url",
          "label",
          "published_at",
          "author",
        ],
        where: {
          id: {
            [Op.ne]: 1,
          },
        },
      });
    }

    response
      .status(200)
      .json(createSuccessResponse("Fetch data successfully", articles));
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const getArticleById = async (request, response) => {
  const { articleId } = request.params;

  try {
    const article = await Article.findByPk(articleId, {
      attributes: [
        "id",
        "title",
        "content",
        "image_url",
        "label",
        "published_at",
        "author",
      ],
    });

    if (!article) {
      return response
        .status(200)
        .json(createErrorResponse("Article Not Found"));
    }

    response
      .status(200)
      .json(
        createSuccessResponse("Fetch data article by id successfully", article)
      );
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const getPinnedArticle = async (request, response) => {
  try {
    const pinnedArticle = await Article.findOne({
      attributes: [
        "id",
        "title",
        "content",
        "image_url",
        "label",
        "published_at",
        "author",
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!pinnedArticle) {
      return response
        .status(200)
        .json(createErrorResponse("Pinned Article Not Found"));
    }

    response
      .status(200)
      .json(
        createSuccessResponse(
          "Fetch pinned article successfully",
          pinnedArticle
        )
      );
  } catch (error) {
    console.log(error);
    response.status(500).json(createErrorResponse("Internal server error"));
  }
};
