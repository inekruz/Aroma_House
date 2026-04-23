const { calculateProductionCount } = require('../services/productionCalculator');

async function calculateProductsFromRaw(req, res) {
  try {
    const {
      product_type_id,
      material_type_id,
      raw_amount,
      param1,
      param2
    } = req.body;

    const result = await calculateProductionCount(
      Number(product_type_id),
      Number(material_type_id),
      Number(raw_amount),
      Number(param1),
      Number(param2)
    );

    res.json({ result });
  } catch (error) {
    console.error('calculateProductsFromRaw error:', error);
    res.status(500).json({ message: 'Ошибка при расчёте количества продукции.' });
  }
}

module.exports = {
  calculateProductsFromRaw
};