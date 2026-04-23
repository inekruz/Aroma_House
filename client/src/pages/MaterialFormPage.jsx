import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import MaterialForm from '../components/MaterialForm';
import {
  fetchMaterialById,
  fetchMaterialTypes,
  createMaterial,
  updateMaterial
} from '../api/materialsApi';

const initialFormState = {
  material_name: '',
  material_type_id: '',
  price: '',
  quantity_stock: '',
  min_quantity: '',
  quantity_package: '',
  unit: ''
};

export default function MaterialFormPage({ mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState(initialFormState);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = mode === 'create' ? 'Добавление материала' : 'Редактирование материала';

    async function loadPageData() {
      try {
        setPageLoading(true);

        const types = await fetchMaterialTypes();
        setMaterialTypes(types);

        if (mode === 'edit') {
          const material = await fetchMaterialById(params.id);

          setFormData({
            material_name: material.material_name || '',
            material_type_id: String(material.material_type_id || ''),
            price: material.price || '',
            quantity_stock: material.quantity_stock || '',
            min_quantity: material.min_quantity || '',
            quantity_package: material.quantity_package || '',
            unit: material.unit || ''
          });
        }

        setMessage('');
      } catch (err) {
        setMessage(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    loadPageData();
  }, [mode, params.id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      setMessage('');

      const payload = {
        material_name: formData.material_name,
        material_type_id: Number(formData.material_type_id),
        price: Number(formData.price),
        quantity_stock: Number(formData.quantity_stock),
        min_quantity: Number(formData.min_quantity),
        quantity_package: Number(formData.quantity_package),
        unit: formData.unit
      };

      if (mode === 'create') {
        await createMaterial(payload);
        alert('Материал успешно добавлен.');
      } else {
        await updateMaterial(params.id, payload);
        alert('Материал успешно обновлён.');
      }

      navigate('/materials');
    } catch (err) {
      setMessage(err.message);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="layout">
      <Header />

      <main className="container">
        <div className="toolbar">
          <PageTitle
            title={mode === 'create' ? 'Добавление материала' : 'Редактирование материала'}
            subtitle="Заполнение данных материала"
          />
          <button className="secondary-button" onClick={() => navigate('/materials')}>
            Назад
          </button>
        </div>

        {pageLoading ? <div className="message info">Загрузка формы...</div> : null}
        {message ? <div className="message error">{message}</div> : null}

        {!pageLoading ? (
          <MaterialForm
            formData={formData}
            materialTypes={materialTypes}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitText={mode === 'create' ? 'Сохранить материал' : 'Сохранить изменения'}
            isLoading={loading}
          />
        ) : null}
      </main>
    </div>
  );
}