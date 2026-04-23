import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import MaterialCard from '../components/MaterialCard';
import { fetchMaterials } from '../api/materialsApi';

export default function MaterialsPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Список материалов';

    async function loadMaterials() {
      try {
        setLoading(true);
        const data = await fetchMaterials();
        setMaterials(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMaterials();
  }, []);

  return (
    <div className="layout">
      <Header />

      <main className="container">
        <div className="toolbar">
          <PageTitle
            title="Список материалов"
            subtitle="Карточки материалов"
          />
          <button className="accent-button" onClick={() => navigate('/materials/new')}>
            Добавить материал
          </button>
        </div>

        {loading ? <div className="message info">Загрузка материалов...</div> : null}
        {error ? <div className="message error">{error}</div> : null}

        {!loading && !error ? (
          <section className="materials-grid">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}