import axiosSecure from "../api/axiosSecure";

export const getVendorAssignments = (page = 1) =>
  axiosSecure.get(`/api/vendor-assignments?page=${page}`);

export const createVendorAssignment = (data) =>
  axiosSecure.post("/api/vendor-assignments", data);

export const updateVendorAssignment = (id, data) =>
  axiosSecure.put(`/api/vendor-assignments/${id}`, data);
