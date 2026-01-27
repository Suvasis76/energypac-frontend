import axiosSecure from "../api/axiosSecure";

/* =========================
   PRODUCT APIs
   ========================= */

// LIST (with pagination URL support)
export const getProducts = ({
    url = "/api/products",
    search = "",
    unit = "",
} = {}) => {
    const params = {};

    if (search) params.search = search;
    if (unit) params.unit = unit;

    return axiosSecure.get(url, { params });
};

// CREATE
export const createProduct = (data) => {
    return axiosSecure.post("/api/products", data);
};

// UPDATE (UUID)
export const updateProduct = (id, data) => {
    return axiosSecure.put(`/api/products/${id}`, data);
};

// DELETE
export const deleteProduct = (id) => {
    return axiosSecure.delete(`/api/products/${id}`);
};
