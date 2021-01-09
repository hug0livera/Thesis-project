const sequelize = require("../../database/database").sequelize;

/**
 * creation of the tag category
 *
 * @param id_task             task key
 * @param tag_category_name   category name
 * @param index               category index
 * @param mandatory           mandatory or optional
 * @param multi_choice        multiple or single choice
 */
const crateTagCategory = async (req, res) => {
  try {
    const { id_task, tag_category_name, mandatory, multi_choice } = req.body;

    //check if the category exists
    const categoryVerification = await sequelize.query(
      "SELECT id_task, tag_category_name " +
        "FROM tag_category " +
        "WHERE id_task =? and tag_category_name = ?",
      {
        replacements: [id_task, tag_category_name],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(categoryVerification).length !== 0)
      return res.status(401).json("The category exists. Create another category");

    const indexVerification = await sequelize.query(
      "SELECT  index FROM tag_category WHERE EXISTS ( SELECT  id_task FROM tag_category WHERE id_task = ?)  ",
      {
        replacements: [id_task],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    //I create the index if it doesn't exist
    if (Object.keys(indexVerification).length === 0) {
      let index = 0;
      const newTagCategory = await sequelize.query(
        `INSERT INTO tag_category (id_task, tag_category_name, index, mandatory, multi_choice) VALUES ( 
            '${id_task}',
            '${tag_category_name}',
            '${index}',
            '${mandatory}',
            '${multi_choice}')`
      );
      if (newTagCategory) return res.json("Category successfully createdy");
    } else {
      const maxIndex = await sequelize.query(
        "SELECT MAX(index) as index FROM tag_category WHERE id_task = ? ",
        {
          replacements: [id_task],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let index = maxIndex[0].index + 1;
      const newTagCategory = await sequelize.query(
        `INSERT INTO tag_category (id_task, tag_category_name, index, mandatory, multi_choice) VALUES ( 
            '${id_task}',
            '${tag_category_name}',
            '${index}',
            '${mandatory}',
            '${multi_choice}')`
      );
      return res.json("Category successfully createdy");
    }
  } catch (e) {
    console.log(e);
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
        `UPDATE tag_category set index = ${element.index}
          WHERE id_category = ${element.id_category} `,
        { type: sequelize.QueryTypes.UPDATE }
      );
    });

    return res.json("index  update successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Delete the category
 *
 * @param id  category key
 *
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query("DELETE FROM  tag_category WHERE id_category = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    });

    await sequelize.query("DELETE FROM tag WHERE id_category = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    });

    res.json("Category deleted succesfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Get the list of all categories
 *
 * @param id  category key
 *
 */
const getCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await sequelize.query(
      "	SELECT * FROM  tag_category TC WHERE   TC.id_task = ? ORDER BY index",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(categories);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * Gets only one category
 *
 * @param id  category key
 *
 */
const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await sequelize.query(
      "	SELECT * FROM  tag_category TC WHERE   TC.id_category = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(categories);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * get name category
 *
 * @param id  category key
 *
 */
const getNameCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const getName = await sequelize.query(
      "	SELECT tag_category_name FROM tag_category WHERE id_category = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(getName);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *  Edit the category
 *
 * @param id                 category key
 * @param id_task             task key
 * @param tag_category_name   category name
 * @param index               category index
 * @param mandatory           mandatory or optional
 * @param multi_choice        multiple or single choice
 */
const editTagCategory = async (req, res) => {
  try {
    const { id, idTask } = req.params;
    const { tag_category_name, index, mandatory, multi_choice } = req.body;

    //check if the category exists
    const categoryVerification = await sequelize.query(
      "SELECT  tag_category_name " +
        "FROM tag_category " +
        "WHERE id_task = ? and tag_category_name = ? and id_category <> ?",
      {
        replacements: [idTask, tag_category_name, id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(categoryVerification).length !== 0)
      return res.status(401).json("The category exists. Create another category");

    const categoryUpdate = await sequelize.query(
      `UPDATE tag_category set tag_category_name = '${tag_category_name}',
      index = '${index}',
      mandatory = '${mandatory}',
      multi_choice = '${multi_choice}'
      WHERE id_category = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );

    return res.json("category update successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

module.exports = {
  crateTagCategory,
  getCategories,
  getOneCategory,
  editTagCategory,
  getNameCategory,
  updateIndex,
  deleteCategory,
};
