import axiosSecure from "../api/axiosSecure";

export const getVendors = async ({
    url,
    search = "",
    isActive = "",
} = {}) => {
    let endpoint = "/api/vendors";

    if (isActive === true) endpoint = "/api/vendors/active";
    else if (isActive === false) endpoint = "/api/vendors/inactive";

    const params = {};
    if (search) params.search = search;

    const res = await axiosSecure.get(url || endpoint, { params });

    // normalize response
    if (Array.isArray(res.data)) {
        return {
            results: res.data,
            count: res.data.length,
            next: null,
            previous: null,
        };
    }

    return res.data;
};


export const createVendor = (data) => {
  return axiosSecure.post("/api/vendors", data);
};

export const updateVendor = (id, data) => {
  return axiosSecure.put(`/api/vendors/${id}`, data);
};

export const deleteVendor = (id) => {
  return axiosSecure.delete(`/api/vendors/${id}`);
};
