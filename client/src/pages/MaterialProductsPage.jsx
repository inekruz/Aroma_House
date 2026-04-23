import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import { fetchProductsByMaterial } from '../api/materialsApi';

function formatNumber(value) {
  return Number(value).toFixed(3).replace('.', ',');
}

export default function MaterialProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="layout">
      <Header />

      <main className="container">
        <div className="toolbar">
          <PageTitle
            title="Продукция, использующая материал"
            subtitle="Список продукции и необходимое количество материала"
          />
          <button className="secondary-button" onClick={() => navigate('/materials')}>
            Назад
          </button>
        </div>

        {loading ? <div className="message info">Загрузка продукции...</div> : null}
        {error ? <div className="message error">{error}</div> : null}

        {!loading && !error ? (
          <div className="products-table-wrapper">
            {products.length === 0 ? (
              <div className="message info">Для этого материала продукция не найдена.</div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Тип продукции</th>
                    <th>Наименование продукции</th>
                    <th>Необходимое количество</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.article}</td>
                      <td>{product.product_type_name}</td>
                      <td>{product.product_name}</td>
                      <td>
                        {formatNumber(product.required_quantity)} {product.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}