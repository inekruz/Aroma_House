const pool = require('../config/db');

async function calculateProductionCount(materialId, productId, rawAmount) {
  const materialIdNumber = Number(materialId);
  const productIdNumber = Number(productId);
  const rawAmountNumber = Number(rawAmount);

  const isValid =
    Number.isInteger(materialIdNumber) &&
    Number.isInteger(productIdNumber) &&
    Number.isFinite(rawAmountNumber) &&
    materialIdNumber > 0 &&
    productIdNumber > 0 &&
    rawAmountNumber > 0;

  if (!isValid) {
    return -1;
  }

  const query = `
    SELECT
      m.id AS material_id,
      m.material_name,
      m.unit,
      mt.loss_percent,
      p.id AS product_id,
      p.product_name,
      mp.quantity AS material_quantity_per_product
    FROM material_products mp
    INNER JOIN materials m ON m.id = mp.material_id
    INNER JOIN material_type mt ON mt.id = m.material_type_id
    INNER JOIN products p ON p.id = mp.product_id
    WHERE mp.material_id = $1
      AND mp.product_id = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [materialIdNumber, productIdNumber]);

  if (result.rows.length === 0) {
    return -1;
  }

  const row = result.rows[0];

  const lossPercent = Number(row.loss_percent);
  const materialQuantityPerProduct = Number(row.material_quantity_per_product);

  if (
    !Number.isFinite(lossPercent) ||
    !Number.isFinite(materialQuantityPerProduct) ||
    lossPercent < 0 ||
    lossPercent >= 100 ||
    materialQuantityPerProduct <= 0
  ) {
    return -1;
  }

  const usableRawAmount = rawAmountNumber * (1 - lossPercent / 100);
  const productCount = Math.floor(usableRawAmount / materialQuantityPerProduct);

  return {
    product_count: productCount,
    usable_raw_amount: Number(usableRawAmount.toFixed(3)),
    material_quantity_per_product: materialQuantityPerProduct,
    loss_percent: lossPercent,
    material_name: row.material_name,
    product_name: row.product_name,
    unit: row.unit
  };
}

module.exports = {
  calculateProductionCount
};