import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const nasaApi = {
  getRoverPhotos: (rover, params) => api.get(`/nasa/rovers/${rover}/photos`, { params }),
  getRoverManifest: (rover) => api.get(`/nasa/rovers/${rover}/manifest`),
  getAPOD: (params) => api.get("/nasa/apod", { params }),
  searchLibrary: (params) => api.get("/nasa/search", { params }),
};

export const collectionsApi = {
  list: () => api.get("/collections"),
  get: (id) => api.get(`/collections/${id}`),
  create: (data) => api.post("/collections", data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
  addImage: (id, data) => api.post(`/collections/${id}/images`, data),
  removeImage: (id, imageId) => api.delete(`/collections/${id}/images/${imageId}`),
};

export const imagesApi = {
  enrich: (data) => api.post("/images/enrich", data),
  suggestTags: (data) => api.post("/images/suggest-tags", data),
  get: (id) => api.get(`/images/${id}`),
};

export const tagsApi = {
  list: () => api.get("/tags"),
  addToImage: (imageId, tagName) => api.post(`/tags/image/${imageId}`, { tagName }),
  removeFromImage: (imageId, tagId) => api.delete(`/tags/image/${imageId}/${tagId}`),
};

export default api;
