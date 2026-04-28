const { calculateProductionCount } = require('../services/productionCalculator');

async function calculateProductsFromRaw(req, res) {
  try {
    const { material_id, product_id, raw_amount } = req.body;

    const result = await calculateProductionCount(
      material_id,
      product_id,
      raw_amount
    );

    if (result === -1) {
      return res.status(400).json({
        message: 'Некорректные данные для расчёта.'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('calculateProductsFromRaw error:', error);
    res.status(500).json({
      message: 'Ошибка при расчёте количества продукции.'
    });
  }
}

module.exports = {
  calculateProductsFromRaw
};