const API_URL = 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка запроса.');
  }

  return data;
}

export async function fetchMaterials() {
  const response = await fetch(`${API_URL}/materials`);
  return handleResponse(response);
}

export async function fetchMaterialById(id) {
  const response = await fetch(`${API_URL}/materials/${id}`);
  return handleResponse(response);
}

export async function fetchMaterialTypes() {
  const response = await fetch(`${API_URL}/material-types`);
  return handleResponse(response);
}

export async function createMaterial(payload) {
  const response = await fetch(`${API_URL}/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export async function updateMaterial(id, payload) {
  const response = await fetch(`${API_URL}/materials/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}

export async function fetchProductsByMaterial(id) {
  const response = await fetch(`${API_URL}/materials/${id}/products`);
  return handleResponse(response);
}

export async function calculateProductsFromRaw(payload) {
  const response = await fetch(`${API_URL}/calculations/production-count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
}