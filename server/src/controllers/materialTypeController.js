const pool = require('../config/db');

async function getAllMaterialTypes(req, res) {
  try {
    const query = `
      SELECT id, type_name, loss_percent
      FROM material_type
      ORDER BY type_name ASC
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('getAllMaterialTypes error:', error);
    res.status(500).json({ message: 'Не удалось получить типы материалов.' });
  }
}

module.exports = {
  getAllMaterialTypes
};