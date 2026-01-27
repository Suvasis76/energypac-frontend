import { useEffect, useState } from "react";
import {
  fetchRequisitions,
  deleteRequisition,
} from "../services/requisition";
import RequisitionModal from "../components/requisition/RequisitionModal";
import { FaPlus, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AlertToast from "../components/ui/AlertToast";

const Requisition = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [page, setPage] = useState(1);

  // Filter State
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "true" | "false"
  const [dateFilter, setDateFilter] = useState("");

  /* =========================
     MODAL STATE
     ========================= */
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  /* =========================
     CONFIRMATION & TOAST
     ========================= */
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const loadData = async (pageNum = 1) => {
    setLoading(true);
    try {
      // Note: Backend might need updates to support search/status filters if not already there.
      // fetchRequisitions currently takes 'page' arg.
      // fetchRequisitions(page, search, is_assigned, requisition_date)
      const res = await fetchRequisitions(pageNum, searchText, statusFilter, dateFilter);
      // Ensure we handle both structure types if they differ, assuming standardized DRF response logic from Products.jsx
      // Products.jsx: res.data.results, res.data.count, etc.
      // Requisition.jsx original: res.data.results

      const data = res.data;
      if (data.results) {
        setList(data.results);
        setCount(data.count || data.results.length);
        setNext(data.next);
        setPrevious(data.previous);
      } else {
        // Fallback if structure is different
        setList(Array.isArray(data) ? data : []);
        setCount(Array.isArray(data) ? data.length : 0);
      }
      setPage(pageNum);

    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        type: "error",
        message: "Failed to load requisitions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (row) => {
    setEditData(row);
    setViewOnly(false);
    setOpenModal(true);
  };

  const handleView = (row) => {
    setEditData(row);
    setViewOnly(true); // View mode
    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setViewOnly(false);
    setOpenModal(true);
  }

  // const handleDelete = (row) => {
  //   setSelectedItem(row);
  //   setShowConfirm(true);
  // };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteRequisition(selectedItem.id);
      setToast({
        open: true,
        type: "success",
        message: "Requisition deleted successfully",
      });
      loadData(page);
    } catch (err) {
      setToast({
        open: true,
        type: "error",
        message: "Failed to delete requisition",
      });
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedItem(null);
    }
  };

  const handleSuccess = () => {
    loadData(page);
    setToast({
      open: true,
      type: "success",
      message: editData ? "Requisition updated successfully" : "Requisition created successfully",
    });
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Requisitions</h3>
            <span className="text-sm text-slate-500 font-semibold">
              Total: {count}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500"
          >
            <FaPlus className="text-xs" />
            New Requisition
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Search Requisition
              </label>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by req no, items..."
                className="input"
              />
            </div>

            {/* Date Filter */}
            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
                <option value="false">Open</option>
                <option value="true">Assigned</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="w-32">
              <label className="block text-xs font-semibold text-transparent mb-1">
                Action
              </label>
              <button
                onClick={() => loadData(1)}
                className="w-full px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-slate-800 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4 text-[13px]">Req No</th>
                <th className="px-6 py-4 text-[13px]">Date</th>
                <th className="px-6 py-4 text-[13px]">Created By</th>
                <th className="px-6 py-4 text-[13px] text-center">Items</th>
                <th className="px-6 py-4 text-[13px]">Status</th>
                <th className="px-6 py-4 text-[13px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-slate-500">
                    Loading requisitions...
                  </td>
                </tr>
              ) : list.length > 0 ? (
                list.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* 
                          Using FaFileAlt or similar generic icon instead of HiDocumentText 
                          to match standard react-icons/fa usage if desired, 
                          but keeping style consistent with Products.jsx which uses text-blue-600 for codes 
                        */}
                        <span className="font-mono text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => handleView(row)}>
                          {row.requisition_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      {new Date(row.requisition_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {row.created_by_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-700 font-medium text-xs">
                        {row.total_items} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.is_assigned ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Assigned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Open
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          onClick={() => handleEdit(row)}
                        >
                          <FaEdit />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-slate-500">
                    No requisitions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => previous && loadData(page - 1)}
            disabled={!previous}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            onClick={() => next && loadData(page + 1)}
            disabled={!next}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      <RequisitionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
        viewOnly={viewOnly}
        onSuccess={handleSuccess}
      />

      <ConfirmDialog
        open={showConfirm}
        title="Delete Requisition"
        message={`Are you sure you want to delete "${selectedItem?.requisition_number}"?`}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />

      <AlertToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default Requisition;
