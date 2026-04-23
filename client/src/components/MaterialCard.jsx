import { useNavigate } from 'react-router-dom';

function formatNumber(value) {
  return Number(value).toFixed(2).replace('.', ',');
}

export default function MaterialCard({ material }) {
  const navigate = useNavigate();

  return (
    <article className="material-card">
      <div className="material-card__top">
        <div>
          <div className="material-card__type">{material.material_type_name}</div>
          <h3 className="material-card__name">{material.material_name}</h3>
        </div>
      </div>

      <div className="material-card__content">
        <p>
          <strong>Минимальное количество:</strong> {formatNumber(material.min_quantity)} {material.unit}
        </p>
        <p>
          <strong>Количество на складе:</strong> {formatNumber(material.quantity_stock)} {material.unit}
        </p>
        <p>
          <strong>Цена:</strong> {formatNumber(material.price)} р / {material.unit}
        </p>
        <p>
          <strong>Требуемое количество:</strong> {formatNumber(material.required_quantity)} {material.unit}
        </p>
      </div>

      <div className="material-card__actions">
        <button onClick={() => navigate(`/materials/${material.id}/edit`)}>
          Редактировать
        </button>
        <button onClick={() => navigate(`/materials/${material.id}/products`)}>
          Продукция
        </button>
      </div>
    </article>
  );
}