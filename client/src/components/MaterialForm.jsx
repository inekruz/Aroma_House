import { useState } from 'react';

export default function MaterialForm({
  formData,
  materialTypes,
  onChange,
  onSubmit,
  submitText,
  isLoading
}) {
  const [localError, setLocalError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.material_name.trim()) {
      setLocalError('Введите наименование материала.');
      return;
    }

    if (!formData.material_type_id) {
      setLocalError('Выберите тип материала.');
      return;
    }

    if (Number(formData.price) < 0) {
      setLocalError('Цена не может быть отрицательной.');
      return;
    }

    if (Number(formData.min_quantity) < 0) {
      setLocalError('Минимальное количество не может быть отрицательным.');
      return;
    }

    if (Number(formData.quantity_stock) < 0 || Number(formData.quantity_package) < 0) {
      setLocalError('Количество не может быть отрицательным.');
      return;
    }

    if (!formData.unit.trim()) {
      setLocalError('Введите единицу измерения.');
      return;
    }

    setLocalError('');
    onSubmit();
  }

  return (
    <form className="material-form" onSubmit={handleSubmit}>
      {localError ? <div className="message error">{localError}</div> : null}

      <label>
        Тип материала
        <select
          name="material_type_id"
          value={formData.material_type_id}
          onChange={onChange}
        >
          <option value="">Выберите тип</option>
          {materialTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type_name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Наименование
        <input
          type="text"
          name="material_name"
          value={formData.material_name}
          onChange={onChange}
          placeholder="Введите наименование"
        />
      </label>

      <label>
        Цена единицы материала
        <input
          type="number"
          step="0.01"
          min="0"
          name="price"
          value={formData.price}
          onChange={onChange}
          placeholder="0.00"
        />
      </label>

      <label>
        Единица измерения
        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={onChange}
          placeholder="кг / л / шт"
        />
      </label>

      <label>
        Количество в упаковке
        <input
          type="number"
          step="0.01"
          min="0"
          name="quantity_package"
          value={formData.quantity_package}
          onChange={onChange}
          placeholder="0.00"
        />
      </label>

      <label>
        Количество на складе
        <input
          type="number"
          step="0.01"
          min="0"
          name="quantity_stock"
          value={formData.quantity_stock}
          onChange={onChange}
          placeholder="0.00"
        />
      </label>

      <label>
        Минимальное количество
        <input
          type="number"
          step="0.01"
          min="0"
          name="min_quantity"
          value={formData.min_quantity}
          onChange={onChange}
          placeholder="0.00"
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : submitText}
        </button>
      </div>
    </form>
  );
}