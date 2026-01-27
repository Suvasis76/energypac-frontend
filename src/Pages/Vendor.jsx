import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import VendorModal from "../components/vendors/VendorModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AlertToast from "../components/ui/AlertToast";
import { getVendors, deleteVendor } from "../services/vendorService";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editVendor, setEditVendor] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    // "" | "active" | "inactive"


    const [toast, setToast] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const fetchVendors = async (url) => {
        try {
            setLoading(true);

            const res = await getVendors({
                url,
                search: searchText,
                isActive:
                    statusFilter === "active"
                        ? true
                        : statusFilter === "inactive"
                            ? false
                            : "",
            });

            // Result is already normalized in service
            setVendors(res.results);
            setCount(res.count);
            setNext(res.next);
            setPrevious(res.previous);
        } catch (err) {
            console.log(err);
            setToast({
                open: true,
                type: "error",
                message: "Failed to load vendors",
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVendors();
    }, []);

    /* =========================
       ACTION HANDLERS
       ========================= */

    const handleAddVendor = () => {
        setEditVendor(null);
        setOpenModal(true);
    };

    const handleEdit = (vendor) => {
        setEditVendor(vendor);
        setOpenModal(true);
    };

    const handleDelete = (vendor) => {
        setSelectedVendor(vendor);
        setShowConfirm(true);
    };

    const handleSearch = () => {
        fetchVendors();
    };


    const handleVendorSuccess = (mode) => {
        setToast({
            open: true,
            type: "success",
            message:
                mode === "edit"
                    ? "Vendor updated successfully"
                    : "Vendor added successfully",
        });

        fetchVendors();
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await deleteVendor(selectedVendor.id);

            setToast({
                open: true,
                type: "success",
                message: "Vendor deleted successfully",
            });

            fetchVendors();
        } catch (err) {
            console.log(err);
            setToast({
                open: true,
                type: "error",
                message: "Failed to delete vendor",
            });
        } finally {
            setDeleting(false);
            setShowConfirm(false);
            setSelectedVendor(null);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Vendors</h3>
                        <span className="text-sm text-slate-500 font-semibold">
                            Total: {count}
                        </span>
                    </div>

                    <button
                        onClick={handleAddVendor}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500"
                    >
                        <FaPlus className="text-xs" />
                        Add Vendor
                    </button>
                </div>

                {/* SEARCH & FILTER */}
                {/* SEARCH & FILTER */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex flex-wrap gap-4 items-end">

                        {/* Search Vendor */}
                        <div className="flex-1 min-w-[220px]">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Search Vendor
                            </label>
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by name, code, phone"
                                className="input"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="w-40">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="w-32">
                            <label className="block text-xs font-semibold text-transparent mb-1">
                                Action
                            </label>
                            <button
                                onClick={handleSearch}
                                className="w-full px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>


                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/50 text-slate-800 uppercase text-[10px] font-bold tracking-widest">
                                <th className="px-6 py-4 text-[13px]">Code</th>
                                <th className="px-6 py-4 text-[13px]">Vendor Name</th>
                                <th className="px-6 py-4 text-[13px]">Contact Person</th>
                                <th className="px-6 py-4 text-[13px]">Phone</th>
                                <th className="px-6 py-4 text-[13px]">Email</th>
                                <th className="px-6 py-4 text-[13px]">GST</th>
                                <th className="px-6 py-4 text-[13px] text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-6 text-center text-slate-500">
                                        Loading vendors...
                                    </td>
                                </tr>
                            )}

                            {!loading && vendors.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-6 text-center text-slate-500">
                                        No vendors found
                                    </td>
                                </tr>
                            )}

                            {vendors.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-mono text-blue-600 font-semibold">
                                        {v.vendor_code}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        {v.vendor_name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {v.contact_person || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {v.phone || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {v.email || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {v.gst_number || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(v)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={() => previous && fetchVendors(previous)}
                        disabled={!previous}
                        className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
                    >
                        ← Previous
                    </button>

                    <button
                        onClick={() => next && fetchVendors(next)}
                        disabled={!next}
                        className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <VendorModal
                key={editVendor ? editVendor.id : "add"}
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={editVendor ? "edit" : "add"}
                vendor={editVendor}
                onSuccess={handleVendorSuccess}
            />

            {/* CONFIRM DELETE */}
            <ConfirmDialog
                open={showConfirm}
                title="Delete Vendor"
                message={`Are you sure you want to delete "${selectedVendor?.vendor_name}"?`}
                confirmText="Delete"
                loading={deleting}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
            />

            {/* TOAST */}
            <AlertToast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    );
}
