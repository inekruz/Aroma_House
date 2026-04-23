const pool = require('../config/db');

async function getAllMaterials(req, res) {
  try {
    const query = `
      SELECT
        m.id,
        m.material_name,
        m.material_type_id,
        mt.type_name AS material_type_name,
        m.price,
        m.quantity_stock,
        m.min_quantity,
        m.quantity_package,
        m.unit,
        COALESCE(ROUND(SUM(mp.quantity)::numeric, 2), 0) AS required_quantity
      FROM materials m
      INNER JOIN material_type mt ON mt.id = m.material_type_id
      LEFT JOIN material_products mp ON mp.material_id = m.id
      GROUP BY
        m.id,
        m.material_name,
        m.material_type_id,
        mt.type_name,
        m.price,
        m.quantity_stock,
        m.min_quantity,
        m.quantity_package,
        m.unit
      ORDER BY m.id ASC
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error('getAllMaterials error:', error);
    res.status(500).json({ message: 'Не удалось получить список материалов.' });
  }
}

async function getMaterialById(req, res) {
  try {
    const materialId = Number(req.params.id);

    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({ message: 'Некорректный идентификатор материала.' });
    }

    const query = `
      SELECT
        m.id,
        m.material_name,
        m.material_type_id,
        mt.type_name AS material_type_name,
        m.price,
        m.quantity_stock,
        m.min_quantity,
        m.quantity_package,
        m.unit
      FROM materials m
      INNER JOIN material_type mt ON mt.id = m.material_type_id
      WHERE m.id = $1
    `;

    const result = await pool.query(query, [materialId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Материал не найден.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('getMaterialById error:', error);
    res.status(500).json({ message: 'Не удалось получить материал.' });
  }
}

async function createMaterial(req, res) {
  try {
    const {
      material_name,
      material_type_id,
      price,
      quantity_stock,
      min_quantity,
      quantity_package,
      unit
    } = req.body;

    if (!material_name || String(material_name).trim() === '') {
      return res.status(400).json({ message: 'Введите наименование материала.' });
    }

    if (!Number.isInteger(Number(material_type_id)) || Number(material_type_id) <= 0) {
      return res.status(400).json({ message: 'Выберите корректный тип материала.' });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: 'Цена не может быть отрицательной.' });
    }

    if (Number(min_quantity) < 0) {
      return res.status(400).json({ message: 'Минимальное количество не может быть отрицательным.' });
    }

    if (Number(quantity_stock) < 0 || Number(quantity_package) < 0) {
      return res.status(400).json({ message: 'Количество не может быть отрицательным.' });
    }

    if (!unit || String(unit).trim() === '') {
      return res.status(400).json({ message: 'Введите единицу измерения.' });
    }

    const insertQuery = `
      INSERT INTO materials
      (
        material_name,
        material_type_id,
        price,
        quantity_stock,
        min_quantity,
        quantity_package,
        unit
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      String(material_name).trim(),
      Number(material_type_id),
      Number(price),
      Number(quantity_stock),
      Number(min_quantity),
      Number(quantity_package),
      String(unit).trim()
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      message: 'Материал успешно добавлен.',
      material: result.rows[0]
    });
  } catch (error) {
    console.error('createMaterial error:', error);

    if (error.code === '23505') {
      return res.status(409).json({ message: 'Такой материал уже существует для выбранного типа.' });
    }

    res.status(500).json({ message: 'Не удалось добавить материал.' });
  }
}

async function updateMaterial(req, res) {
  try {
    const materialId = Number(req.params.id);

    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({ message: 'Некорректный идентификатор материала.' });
    }

    const {
      material_name,
      material_type_id,
      price,
      quantity_stock,
      min_quantity,
      quantity_package,
      unit
    } = req.body;

    if (!material_name || String(material_name).trim() === '') {
      return res.status(400).json({ message: 'Введите наименование материала.' });
    }

    if (!Number.isInteger(Number(material_type_id)) || Number(material_type_id) <= 0) {
      return res.status(400).json({ message: 'Выберите корректный тип материала.' });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: 'Цена не может быть отрицательной.' });
    }

    if (Number(min_quantity) < 0) {
      return res.status(400).json({ message: 'Минимальное количество не может быть отрицательным.' });
    }

    if (Number(quantity_stock) < 0 || Number(quantity_package) < 0) {
      return res.status(400).json({ message: 'Количество не может быть отрицательным.' });
    }

    if (!unit || String(unit).trim() === '') {
      return res.status(400).json({ message: 'Введите единицу измерения.' });
    }

    const updateQuery = `
      UPDATE materials
      SET
        material_name = $1,
        material_type_id = $2,
        price = $3,
        quantity_stock = $4,
        min_quantity = $5,
        quantity_package = $6,
        unit = $7
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      String(material_name).trim(),
      Number(material_type_id),
      Number(price),
      Number(quantity_stock),
      Number(min_quantity),
      Number(quantity_package),
      String(unit).trim(),
      materialId
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Материал не найден.' });
    }

    res.json({
      message: 'Материал успешно обновлён.',
      material: result.rows[0]
    });
  } catch (error) {
    console.error('updateMaterial error:', error);

    if (error.code === '23505') {
      return res.status(409).json({ message: 'Такой материал уже существует для выбранного типа.' });
    }

    res.status(500).json({ message: 'Не удалось обновить материал.' });
  }
}

async function getProductsByMaterial(req, res) {
  try {
    const materialId = Number(req.params.id);

    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({ message: 'Некорректный идентификатор материала.' });
    }

    const query = `
      SELECT
        p.id,
        p.article,
        p.product_name,
        pt.type_name AS product_type_name,
        mp.quantity AS required_quantity,
        m.unit
      FROM material_products mp
      INNER JOIN products p ON p.id = mp.product_id
      INNER JOIN product_type pt ON pt.id = p.product_type_id
      INNER JOIN materials m ON m.id = mp.material_id
      WHERE mp.material_id = $1
      ORDER BY p.product_name ASC
    `;

    const result = await pool.query(query, [materialId]);

    res.json(result.rows);
  } catch (error) {
    console.error('getProductsByMaterial error:', error);
    res.status(500).json({ message: 'Не удалось получить список продукции по материалу.' });
  }
}

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  getProductsByMaterial
};