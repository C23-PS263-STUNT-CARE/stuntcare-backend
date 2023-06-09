import Info from "../../models/infoModel.js";

export const createInfo = async (request, response) => {
  const { image_url, url } = request.body;

  try {
    await Info.create({
      image_url,
      url,
    });

    response.status(201).json({ message: "Info Created" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const deleteInfoById = async (request, response) => {
  const { infoId } = request.params;

  try {
    const info = await Info.findByPk(infoId);

    if (!info) {
      return response.status(200).json({ message: "Info not found" });
    }

    await info.destroy();

    response.status(200).json({ message: "Info deleted successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};
