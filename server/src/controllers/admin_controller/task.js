const sequelize = require("../../database/database").sequelize;

/**
 *
 * the administrator creates tasks
 *
 * @param task_name  task name
 * @param chance_value chance value
 * @param random_threshold random threshold
 * @param task_description task description
 *
 */
const crateTask = async (req, res) => {
  try {
    const {
      task_name,
      chance_value,
      random_threshold,
      task_description,
      link_to_guidelines,
    } = req.body;
    const taskVerification = await sequelize.query(
      "SELECT task_name FROM task WHERE task_name = ? ",
      { replacements: [task_name], type: sequelize.QueryTypes.SELECT }
    );
    if (Object.keys(taskVerification).length !== 0)
      return res.status(401).json("The task name exists");

    if (chance_value == null && chance_value == null) {
      await sequelize.query(
        `INSERT INTO Task (task_name, task_description, state, link_to_guidelines ) VALUES (
      '${task_name}',
      '${task_description}',
      '${"inConstruction"}',
      '${link_to_guidelines}')`
      );
    } else if (random_threshold == null) {
      await sequelize.query(
        `INSERT INTO Task (task_name, chance_value, task_description, state, link_to_guidelines ) VALUES (
        '${task_name}',
        '${chance_value}',
        '${task_description}',
        '${"inConstruction"}',
        '${link_to_guidelines}')`
      );
    } else if (chance_value == null) {
      await sequelize.query(
        `INSERT INTO Task (task_name, random_threshold, task_description, state, link_to_guidelines ) VALUES (
        '${task_name}',
        '${random_threshold}',
        '${task_description}',
        '${"inConstruction"}',
        '${link_to_guidelines}')`
      );
    } else {
      await sequelize.query(
        `INSERT INTO Task (task_name, chance_value, random_threshold, task_description, state, link_to_guidelines ) VALUES (
      '${task_name}',
      '${chance_value}',
      '${random_threshold}',
      '${task_description}',
      '${"inConstruction"}',
      '${link_to_guidelines}')`
      );
    }
    return res.json("Task created with success");
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
 *  Assign a task to a user
 *
 *  @param id_task task key
 *  @param id_user user key
 *
 */
const assignTaskUser = async (req, res) => {
  try {
    const { id_task, id_user } = req.body;
    await sequelize.query("INSERT INTO Users_task (id_task, id_user) VALUES (?,?)", {
      replacements: [id_task, id_user],
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(200).json("User assigned to the task");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * get the users assigned to a task
 *
 * @param id task key
 *
 */
const usersAssignedToATask = async (req, res) => {
  try {
    const { id } = req.params;
    const usersAssignedToATask = await sequelize.query(
      "	SELECT ut.id_user, u.name, u.email, ut.active FROM users_task ut JOIN users u ON (u.id_user = ut.id_user) WHERE id_task = ? AND u.user_deleted = ? ",
      {
        replacements: [id, false],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(usersAssignedToATask);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Get category
 *
 * @param id task key
 *
 */
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const getCategories = await sequelize.query(
      "	SELECT TC.id_category, TC.tag_category_name " +
        "FROM task T " +
        "JOIN tag_category TC ON (TC.id_task = T.id_task) " +
        "WHERE T.id_task = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(getCategories);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Get category and tags
 *
 * @param id task key
 *
 */
const getCategoryTags = async (req, res) => {
  try {
    const { id } = req.params;

    const getCategories = await sequelize.query(
      "	SELECT T.task_name, T.task_description,TC.id_category, TC.tag_category_name, TA.tag_name, TA.color " +
        "FROM task T " +
        "LEFT JOIN tag_category TC ON (T.id_task = TC.id_task) " +
        "LEFT JOIN tag TA ON (TC.id_category = TA.id_category) " +
        "WHERE T.id_task = ? ORDER BY TC.tag_category_name",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(getCategories);
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
 * Get the list of all Tasks in construction
 *
 */
const getTasksConstruction = async (req, res) => {
  try {
    const listTasks = await sequelize.query(
      "SELECT id_task, task_name, chance_value,random_threshold, task_description, state " +
        "FROM Task Where state = 'inConstruction' ",
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(listTasks);
  } catch (e) {
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * Get the list of all Tasks active
 *
 */
const getTasksActive = async (req, res) => {
  try {
    const listTasks = await sequelize.query(
      "SELECT id_task, task_name, chance_value,random_threshold, task_description, state " +
        "FROM Task WHERE state = 'active' ",
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(listTasks);
  } catch (e) {
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 * Get a task
 *
 * @param id_task
 *
 */
const getOneTask = async (req, res) => {
  try {
    const id_task = req.params.id;
    const task = await sequelize.query(
      "SELECT id_task, task_name, chance_value, random_threshold, task_description, link_to_guidelines " +
        "from task WHERE id_task =?",
      {
        replacements: [id_task],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(task);
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
 * Get the list of all Tasks
 *
 */
const getTasks = async (req, res) => {
  try {
    const listTasks = await sequelize.query(
      "SELECT id_task, task_name, chance_value,random_threshold, task_description, state " +
        "FROM Task ORDER BY id_task ASC ",
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(listTasks);
  } catch (e) {
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Get name task
 *
 * @param id task key
 *
 */
const getNameTask = async (req, res) => {
  try {
    const { id } = req.params;
    const getName = await sequelize.query("	SELECT task_name FROM task  WHERE id_task = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });
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
 * Task deletion
 *
 * @param id  task key
 *
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query("DELETE FROM  Task WHERE id_task = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    });
    await sequelize.query("DELETE FROM users_task WHERE id_task = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    });
    res.json("Task deleted succesfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Delete task assignment
 *
 * @param idTask  task key
 * @param idUser user key
 *
 */
const deleteTaskAssignment = async (req, res) => {
  try {
    const { idTask, idUser } = req.params;
    const taskVerification = await sequelize.query(
      " SELECT *  FROM post p  JOIN annotation a on (p.id_post = a.id_post)  WHERE p.id_task = ? AND a.id_user = ?",
      { replacements: [idTask, idUser], type: sequelize.QueryTypes.SELECT }
    );
    if (Object.keys(taskVerification).length !== 0)
      return res.status(401).json("the task has been annotated");

    await sequelize.query("DELETE FROM  users_task WHERE id_task = ? and id_user =? ", {
      replacements: [idTask, idUser],
      type: sequelize.QueryTypes.DELETE,
    });

    res.json("Assignment deleted succesfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Finalized task
 * change the status of the task from inConstrucition to active
 *
 * @param id  task key
 *
 */
const finishTask = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the task has at least one category
    const categoryVerification = await sequelize.query(
      " SELECT task_name FROM task T " +
        "WHERE EXISTS ( " +
        "	SELECT id_category " +
        "	FROM tag_category TC " +
        "	WHERE id_task = ? AND TC.id_task = T.id_task) ",
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (Object.keys(categoryVerification).length === 0)
      return res.status(401).json("The task must have at least one category");

    // Check if all categories have at least one tag
    const tagVerification = await sequelize.query(
      "SELECT id_category " +
        "FROM tag_category TC " +
        "WHERE id_task = ? " +
        "AND NOT  EXISTS ( " +
        "SELECT TA.id_category " +
        "FROM tag TA " +
        "WHERE TA.id_category = TC.id_category) ",
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );
    if (Object.keys(tagVerification).length !== 0)
      return res.status(401).json("All categories must have at least one tag");

    await sequelize.query(
      `UPDATE Task set state = 'active'
       WHERE id_task = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("task completed successfully");
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
 * Edit the task
 *
 * @param id task key
 * @param task_name  task name
 * @param chance_value chance value
 * @param random_threshold random threshold
 * @param task_description task description
 */
const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      task_name,
      chance_value,
      random_threshold,
      task_description,
      link_to_guidelines,
    } = req.body;

    // I check if the task exists
    const taskVerification = await sequelize.query(
      "SELECT task_name FROM task WHERE task_name = ? AND id_task <> ? ",
      { replacements: [task_name, id], type: sequelize.QueryTypes.SELECT }
    );
    if (Object.keys(taskVerification).length !== 0)
      return res.status(401).json("The task name exists");

    await sequelize.query(
      `UPDATE Task set task_name = '${task_name}',
        chance_value = '${chance_value}',
        random_threshold = '${random_threshold}',
        task_description = '${task_description}',
        link_to_guidelines = '${link_to_guidelines}'
      WHERE id_task = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );

    return res.json("task update successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *  First task statistics table.
 *
 *
 */
const taskStatistics = async (req, res) => {
  try {
    const userStatistics = await sequelize.query(
      "	SELECT t.id_task, t.task_name,  count (p.id_post) AS count_post, SUM (total_annotation) AS number_annotation, TT.total_assigned_users " +
        "FROM task t " +
        "LEFT JOIN post p ON (t.id_task = p.id_task) " +
        "LEFT JOIN	( " +
        "SELECT ut.id_task,  count (ut.id_user) AS total_assigned_users " +
        "FROM users_task ut " +
        "GROUP BY ut.id_task " +
        ") AS TT ON (tt.id_task = t.id_task) " +
        " WHERE t.state <> ? " +
        "GROUP BY t.id_task, t.task_name, tt.total_assigned_users ORDER BY t.task_name",
      {
        replacements: ["inConstruction"],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (userStatistics) return res.status(200).json(userStatistics);
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
 * Second task statistics table
 * Statistics of tasks with assigned users
 *
 * @param id  task key
 *
 */
const taskStatisticsAssignedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userStatistics = await sequelize.query(
      "		SELECT ut.id_user, u.name, u.email, tt.number_annotation,  tt.day , COUNT (p2.id_post) as post_intotal " +
        "FROM users_task ut " +
        "join task t2 on (t2.id_task = ut.id_task) " +
        "join post p2 on (p2.id_task = t2.id_task) " +
        "LEFT JOIN " +
        "(SELECT t.id_task, u.id_user, MAX (index_annotation) AS number_annotation, MIN (now()::date  - a.date_annotation ::date) AS day " +
        " FROM users u " +
        "JOIN  annotation a on (a.id_user = u.id_user) " +
        "JOIN  post p on (p.id_post = a.id_post) " +
        "JOIN task t on (t.id_task = p.id_task)" +
        "WHERE t.id_task = ? " +
        "GROUP BY  t.id_task, u.id_user " +
        " )	AS tt on (tt.id_user = ut.id_user) " +
        " LEFT JOIN  users  u on (u.id_user = ut.id_user) " +
        " WHERE ut.id_task = ? " +
        " GROUP BY  ut.id_user, u.name,u.email, tt.number_annotation,  tt.day ORDER BY  u.name",
      {
        replacements: [id, id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (taskStatisticsAssignedUser) return res.status(200).json(userStatistics);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * Disable task assignment
 *
 *  @param idTask  task key
 *  @param id_user user key
 *  @param active  task state
 *
 */
const disableTaskAssignment = async (req, res) => {
  try {
    const { idTask } = req.params;
    const { id_user, active } = req.body;

    if (active) {
      await sequelize.query(
        `UPDATE users_task set active = '${false}'
        WHERE id_task = '${idTask}' AND id_user = '${id_user}'  `,
        { type: sequelize.QueryTypes.UPDATE }
      );
      return res.json("task disabled successfully");
    } else {
      await sequelize.query(
        `UPDATE users_task set active = '${true}'
          WHERE id_task = '${idTask}' AND id_user = '${id_user}'  `,
        { type: sequelize.QueryTypes.UPDATE }
      );
      return res.json("task disabled successfully");
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
 * Change State inactive
 *
 *  @param id task key
 *
 */
const changeStateInactive = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query(
      `UPDATE Task set state = 'inactive'
        WHERE id_task = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("Task state changed successfully");
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
 * Change State Active
 *
 *  @param id task key
 *
 */
const changeStateActive = async (req, res) => {
  try {
    const { id } = req.params;

    const stateUpdate = await sequelize.query(
      `UPDATE Task set state = 'active'
        WHERE id_task = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("Task state changed successfully");
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
 *  Get all uploaded post
 *
 *  @param id task key
 *
 */
const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const getPost = await sequelize.query(
      "	SELECT T.id_task, T.task_name, P.id_post, P.uri, P.text, P.category, P.image_name, P.image_path " +
        "FROM task T LEFT JOIN post P   ON (T.id_task = P.id_task ) " +
        "WHERE T.id_task = ? ORDER BY P.id_post",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(getPost);
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
 * Telegram: Gets the statistics of the tasks
 *
 */
const getStatisticsByTelegram = async (req, res) => {
  try {
    const userStatistics = await sequelize.query(
      "	SELECT t.id_task, t.task_name,  count (p.id_post) AS count_post, SUM (total_annotation) AS number_annotation, TT.total_assigned_users " +
        "FROM task t " +
        "LEFT JOIN post p ON (t.id_task = p.id_task) " +
        "LEFT JOIN	( " +
        "SELECT ut.id_task,  count (ut.id_user) AS total_assigned_users " +
        "FROM users_task ut " +
        "GROUP BY ut.id_task " +
        ") AS TT ON (tt.id_task = t.id_task) " +
        " WHERE t.state <> ? " +
        "GROUP BY t.id_task, t.task_name, tt.total_assigned_users ORDER BY t.id_task",
      {
        replacements: ["inConstruction"],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return userStatistics;
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
 * Telegram: gets the percentage of completion, calculated as the number of posts that passed the threshold.
 *
 */
const getStatisticsPercentageTelegram = async (req, res) => {
  try {
    const userStatistics = await sequelize.query(
      "		SELECT   t.task_name, p.id_task, SUM (total_annotation) AS total_annotation, COUNT (id_post) total_post, t.random_threshold " +
        "FROM post p " +
        "JOIN task t on (t.id_task = p.id_task) " +
        " WHERE t.state = 'active' " +
        " GROUP BY    t.task_name, p.id_task, t.random_threshold " +
        "HAVING (SUM (total_annotation))  >  t.random_threshold ORDER BY p.id_task",
      {
        replacements: ["inConstruction"],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return userStatistics;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

module.exports = {
  getCategory,
  getCategoryTags,
  getNameTask,
  getTasksConstruction,
  getTasksActive,
  getOneTask,
  getTasks,
  crateTask,
  deleteTask,
  assignTaskUser,
  finishTask,
  editTask,
  taskStatistics,
  changeStateInactive,
  changeStateActive,
  taskStatisticsAssignedUser,
  getPost,
  getStatisticsByTelegram,
  usersAssignedToATask,
  deleteTaskAssignment,
  disableTaskAssignment,
  getStatisticsPercentageTelegram,
};
