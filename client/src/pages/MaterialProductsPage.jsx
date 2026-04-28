import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import {
  fetchProductsByMaterial,
  calculateProductsFromRaw
} from '../api/materialsApi';

function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits).replace('.', ',');
}

export default function MaterialProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [rawAmount, setRawAmount] = useState('');
  const [calculationResults, setCalculationResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [calculatingId, setCalculatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Продукция по материалу';

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProductsByMaterial(id);
        setProducts(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [id]);

  async function handleCalculate(productId) {
    try {
      if (!rawAmount || Number(rawAmount) <= 0) {
        alert('Введите количество сырья больше 0.');
        return;
      }

      setCalculatingId(productId);

      const result = await calculateProductsFromRaw({
        material_id: Number(id),
        product_id: Number(productId),
        raw_amount: Number(rawAmount)
      });

      setCalculationResults((prev) => ({
        ...prev,
        [productId]: result
      }));
    } catch (err) {
      alert(`Ошибка расчёта: ${err.message}`);
    } finally {
      setCalculatingId(null);
    }
  }

  return (
    <>
      <Header />

      <main className="page">
        <PageTitle title="Продукция по материалу" />

        <button type="button" onClick={() => navigate('/materials')}>
          Назад
        </button>

        <section className="form-card">
          <label>
            Количество сырья
            <input
              type="number"
              min="0"
              step="0.001"
              value={rawAmount}
              onChange={(event) => setRawAmount(event.target.value)}
              placeholder="Например: 100"
            />
          </label>
        </section>

        {loading ? <p>Загрузка продукции...</p> : null}

        {error ? <p className="error">{error}</p> : null}

        {!loading && !error ? (
          <section className="table-wrap">
            {products.length === 0 ? (
              <p>Для этого материала продукция не найдена.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Тип продукции</th>
                    <th>Наименование продукции</th>
                    <th>Расход на изделие</th>
                    <th>Расчёт</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const result = calculationResults[product.id];

                    return (
                      <tr key={product.id}>
                        <td>{product.article}</td>
                        <td>{product.product_type_name}</td>
                        <td>{product.product_name}</td>
                        <td>
                          {formatNumber(product.required_quantity)} {product.unit}
                        </td>
                        <td>
                          <div className="calc-cell">
                            <button
                              className="calc-button"
                              onClick={() => handleCalculate(product.id)}
                              disabled={calculatingId === product.id}
                            >
                              {calculatingId === product.id ? 'Расчёт...' : 'Рассчитать'}
                            </button>

                            {result && (
                              <div className="result-box">
                                <div>
                                  Можно изготовить: <strong>{result.product_count}</strong> шт.
                                </div>
                                <div>
                                  Полезное сырьё: {formatNumber(result.usable_raw_amount)} {result.unit}
                                </div>
                                <div>
                                  Потери: {formatNumber(result.loss_percent, 2)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        ) : null}
      </main>
    </>
  );
}