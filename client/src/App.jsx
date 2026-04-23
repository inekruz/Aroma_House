import { Routes, Route, Navigate } from 'react-router-dom';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import MaterialProductsPage from './pages/MaterialProductsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/materials" replace />} />
      <Route path="/materials" element={<MaterialsPage />} />
      <Route path="/materials/new" element={<MaterialFormPage mode="create" />} />
      <Route path="/materials/:id/edit" element={<MaterialFormPage mode="edit" />} />
      <Route path="/materials/:id/products" element={<MaterialProductsPage />} />
    </Routes>
  );
}