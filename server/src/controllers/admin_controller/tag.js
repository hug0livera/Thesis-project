const sequelize = require("../../database/database").sequelize;

/**
 * Creation of tags
 *
 * @param id            tag key
 * @param id_category   category key
 * @param tag_name      name of the tag
 * @param color         color of the tag
 * @param behavior
 *
 */
const createTag = async (req, res) => {
  try {
    const { id_category, tag_name, color, behavior } = req.body;

    //check if the tag exists
    const categoryVerification = await sequelize.query(
      "SELECT tag_name FROM tag WHERE id_category = ? AND tag_name = ?",
      {
        replacements: [id_category, tag_name],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(categoryVerification).length !== 0)
      return res.status(401).json("The tag exists. Create another tag");

    //I create the index if it doesn't exist
    const indexVerification = await sequelize.query(
      "SELECT  index FROM tag WHERE EXISTS ( SELECT  id_category FROM tag WHERE id_category = ?)  ",
      {
        replacements: [id_category],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    //I create the index if it doesn't exist
    if (Object.keys(indexVerification).length === 0) {
      let index = 0;
      //create new tag
      const newCreateTag = await sequelize.query(
        `INSERT INTO Tag (id_category, tag_name, color, behavior, index) VALUES (
        '${id_category}',
        '${tag_name}',
        '${color}',
        '${behavior}',
        '${index}')`
      );

      if (newCreateTag) return res.json("Tag created successfully");
    } else {
      const maxIndex = await sequelize.query(
        "SELECT MAX(index) as index FROM tag WHERE id_category = ? ",
        {
          replacements: [id_category],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let index = maxIndex[0].index + 1;
      const newCreateTag = await sequelize.query(
        `INSERT INTO Tag (id_category, tag_name, color, behavior, index) VALUES (
          '${id_category}',
          '${tag_name}',
          '${color}',
          '${behavior}',
          '${index}')`
      );

      if (newCreateTag) return res.json("Tag created successfully");
    }
  } catch (e) {
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * Sorts the categories according to the index
 *
 */
const updateIndex = async (req, res) => {
  try {
    let jsonArray = req.body;
    jsonArray.forEach((element) => {
      sequelize.query(
        `UPDATE tag set index = ${element.index}
          WHERE id_tag = ${element.id_tag} `,
        { type: sequelize.QueryTypes.UPDATE }
      );
    });
    return res.json("index update successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Delete the tag
 *
 * @param id  category key
 *
 */
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    await sequelize.query("DELETE FROM tag WHERE id_tag = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    });

    res.json("Tag deleted succesfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * get tags
 *
 */
const getTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await sequelize.query(
      "SELECT T.id_tag, TC.id_category, T.tag_name, T.color, T.index " +
        "FROM tag_category TC " +
        "JOIN tag T ON (TC.id_Category = T.id_category) " +
        "WHERE TC.id_category = ? ORDER BY T.index",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * get tags (need to edit a tag)
 *
 */
const getListTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await sequelize.query("SELECT * FROM tag WHERE id_category = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * get tag
 *
 */
const getOneTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await sequelize.query("SELECT * FROM tag WHERE id_tag = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * get the list of all tag
 *
 */
const getTags = async (req, res) => {
  try {
    const tags = await sequelize.query("SELECT * from tag", {
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * edit the tag
 * @param id            tag key
 * @param id_category   category key
 * @param tag_name      name of the tag
 * @param color         color of the tag
 *
 */
const editTag = async (req, res) => {
  try {
    const { idTag, idCategory } = req.params;
    const { tag_name, color, behavior } = req.body;
    //check if the tag exists
    const categoryVerification = await sequelize.query(
      "SELECT * FROM tag WHERE id_category = ? and tag_name = ? and id_tag <> ?",
      {
        replacements: [idCategory, tag_name, idTag],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(categoryVerification).length !== 0)
      return res.status(401).json("The tag exists. Create another tag");

    const tagUpdate = await sequelize.query(
      `UPDATE tag set tag_name = '${tag_name}' , color = '${color}', behavior = '${behavior}' WHERE id_tag = '${idTag}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("tag update successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

module.exports = {
  createTag,
  getTags,
  editTag,
  getTag,
  getListTag,
  getOneTag,
  deleteTag,
  updateIndex,
};
