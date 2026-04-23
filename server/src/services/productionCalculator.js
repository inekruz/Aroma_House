const pool = require('../config/db');

async function calculateProductionCount(
  productTypeId,
  materialTypeId,
  rawAmount,
  param1,
  param2
) {
  const isIntegerInput =
    Number.isInteger(productTypeId) &&
    Number.isInteger(materialTypeId) &&
    Number.isInteger(rawAmount);

  const isValidNumericInput =
    Number.isFinite(param1) &&
    Number.isFinite(param2) &&
    param1 > 0 &&
    param2 > 0 &&
    rawAmount > 0;

  if (!isIntegerInput || !isValidNumericInput) {
    return -1;
  }

  const productTypeQuery = `
    SELECT id, product_type_factor
    FROM product_type
    WHERE id = $1
  `;

  const materialTypeQuery = `
    SELECT id, loss_percent
    FROM material_type
    WHERE id = $1
  `;

  const [productTypeResult, materialTypeResult] = await Promise.all([
    pool.query(productTypeQuery, [productTypeId]),
    pool.query(materialTypeQuery, [materialTypeId])
  ]);

  if (productTypeResult.rows.length === 0 || materialTypeResult.rows.length === 0) {
    return -1;
  }

  const productTypeFactor = Number(productTypeResult.rows[0].product_type_factor);
  const lossPercent = Number(materialTypeResult.rows[0].loss_percent);

  if (productTypeFactor <= 0 || lossPercent < 0) {
    return -1;
  }

  const quantityForOneProduct = param1 * param2 * productTypeFactor;

  if (quantityForOneProduct <= 0) {
    return -1;
  }

  const usableRawAmount = rawAmount * (1 - lossPercent / 100);

  if (usableRawAmount <= 0) {
    return 0;
  }

  return Math.floor(usableRawAmount / quantityForOneProduct);
}

module.exports = {
  calculateProductionCount
};