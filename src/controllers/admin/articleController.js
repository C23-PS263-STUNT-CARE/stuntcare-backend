import Article from "../../models/articleModel.js";

export const createArticle = async (request, response) => {
  const { title, content, label, image_url, published_at, author } =
    request.body;

  try {
    await Article.create({
      title,
      content,
      label,
      image_url,
      published_at,
      author,
    });

    response.status(201).json({ message: "Article Created" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArticleById = async (request, response) => {
  const { articleId } = request.params;

  try {
    const article = await Article.findByPk(articleId);

    if (!article) {
      return response.status(200).json({ message: "article not found" });
    }

    await article.destroy();

    response.status(200).json({ message: "article deleted successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};
