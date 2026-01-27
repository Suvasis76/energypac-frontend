import { useEffect, useState } from "react";
import {
  createRequisition,
  updateRequisition,
  getRequisition, // New
  getRequisitionAssignments, // New
  getRequisitionItems, // New
} from "../../services/requisition";
import ProductSelector from "../common/ProductSelector";
import { HiPlus, HiTrash, HiX, HiInformationCircle } from "react-icons/hi";

const emptyItem = {
  product: "",
  quantity: "",
  remarks: "",
  unit: "",
};


const RequisitionModal = ({ open, onClose, editData, onSuccess, viewOnly = false }) => {
  const [form, setForm] = useState({
    requisition_date: new Date().toISOString().split("T")[0],
    remarks: "",
    items: [{ ...emptyItem }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // If we are in view mode or edit mode with an ID, we might want to fetch fresh data
      // For now, let's specifically target the requirement: "for requisition view use this api..."
      if ((viewOnly || editData) && editData?.id) {
        try {
          // Fetch all in parallel
          const [reqRes, assignRes, itemsRes] = await Promise.allSettled([
            getRequisition(editData.id),
            getRequisitionAssignments(editData.id),
            getRequisitionItems(editData.id)
          ]);

          // Prefer data from basic editData, but if API call succeeds, overlay it
          // actually, the user specifically asked to use these APIs for VIEW.

          let reqDate = editData.requisition_date;
          let remarks = editData.remarks || "";
          let items = editData.items ? [...editData.items] : [];

          // Override with fresh data if available
          if (reqRes.status === 'fulfilled') {
            const d = reqRes.value.data;
            reqDate = d.requisition_date;
            remarks = d.remarks || "";
            // Update assignment status from main req
            if (d.is_assigned !== undefined) setIsAssigned(d.is_assigned);
          }

          // Check assignment API as well
          if (assignRes.status === 'fulfilled') {
            const aData = assignRes.value.data;
            if (aData.is_assigned !== undefined) setIsAssigned(aData.is_assigned);
            // We could potentially use items from here if needed, but items API is preferred
          }

          // Use items from the items API if successful
          if (itemsRes.status === 'fulfilled') {
            // The API returns { items: [...] } based on user example
            const iData = itemsRes.value.data;
            if (iData.items && Array.isArray(iData.items)) {
              items = iData.items.map(i => ({
                product: i.product, // ID
                product_name: i.product_name, // If needed for display
                quantity: i.quantity,
                remarks: i.remarks || "",
                unit: i.unit || i.product_details?.unit || "",
                // Keep checking for product_details if nested
                product_code: i.product_code || i.product_details?.item_code || ""
              }));
            }
          }

          setForm({
            requisition_date: reqDate,
            remarks: remarks,
            items: items.length ? items : [{ ...emptyItem }],
          });

        } catch (error) {
          console.error("Failed to fetch details", error);
          // Fallback to editData if API fails is already handled by initial state or below logic?
          // Actually, let's just use what we have in editData if this fails, or show error?
          // Current implementation: Just set what we have from props first, then update if API returns.
        }
      } else if (editData) {
        // Standard edit setup if not fetching (tho we probably should always fetch if we have ID)
        // For safety, let's keep the prop-based setup as immediate fallback
      }
    };

    if (editData) {
      // Set initial state from props immediately to avoid flicker
      setForm({
        requisition_date: editData.requisition_date,
        remarks: editData.remarks || "",
        items:
          editData.items?.map((i) => ({
            product: i.product,
            quantity: i.quantity,
            remarks: i.remarks || "",
            unit: i.unit || i.product_details?.unit || "",
          })) || [{ ...emptyItem }],
      });
      setIsAssigned(editData.is_assigned || false);

      // Then fetch fresh details
      fetchData();
    } else {
      setForm({
        requisition_date: new Date().toISOString().split("T")[0],
        remarks: "",
        items: [{ ...emptyItem }],
      });
      setIsAssigned(false);
    }
  }, [editData, open]);


  if (!open) return null;

  const updateItem = (index, updates) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      ),
    }));
  };


  const addItem = () => {
    setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  };

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: items.length ? items : [{ ...emptyItem }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (form.items.some(item => !item.product || !item.quantity)) {
      setError("Please select a product and specify quantity for all items.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        requisition_date: form.requisition_date,
        remarks: form.remarks,
        items: form.items.map(item => ({
          product_id: item.product, // Try product_id
          product: item.product,    // Keep product just in case
          quantity: Number(item.quantity),
          remarks: item.remarks || ""
        })),
      };

      if (editData) {
        await updateRequisition(editData.id, payload);
      } else {
        await createRequisition(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      // Show more detailed error if available
      const detail = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(`Error: ${detail}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0  bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
    // Backdrop click should NOT close modal per user request
    >
      <div
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editData ? "Edit Requisition" : "New Requisition"}
            </h2>
            <p className="text-sm text-slate-500">
              {viewOnly
                ? `Viewing details of ${editData?.requisition_number}`
                : editData
                  ? `Editing ${editData.requisition_number}`
                  : "Fill in the details to create a new request"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAssigned && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">
                Assigned
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-200"
            >
              <HiX size={20} />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <HiInformationCircle className="text-xl shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* MASTER DATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Requisition Date</label>
              <input
                type="date"
                className="input"
                value={form.requisition_date}
                onChange={(e) =>
                  setForm({ ...form, requisition_date: e.target.value })
                }
                readOnly={viewOnly}
                disabled={viewOnly}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Remarks</label>
              <input
                className="input"
                placeholder="Internal notes or comments..."
                value={form.remarks}
                onChange={(e) =>
                  setForm({ ...form, remarks: e.target.value })
                }
                readOnly={viewOnly}
                disabled={viewOnly}
              />
            </div>
          </div>

          {/* ITEMS LIST */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Item Details</h3>
              {!viewOnly && (
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors border border-blue-100"
                >
                  <HiPlus /> Add Item
                </button>
              )}
            </div>

            <div className="space-y-3">
              {form.items.map((item, i) => (
                <div
                  key={i}
                  style={{ zIndex: form.items.length - i }}
                  className="group bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-start relative transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm overflow-visible"
                >
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Product</label>
                    <div className={viewOnly ? "pointer-events-none opacity-90" : ""}>
                      <ProductSelector
                        value={item.product}
                        defaultItem={item.product_name ? { item_name: item.product_name, item_code: item.product_code, id: item.product } : null}
                        onChange={(val, productObj) => {
                          if (productObj) {
                            updateItem(i, {
                              product: val,
                              unit: productObj.unit || "PCS",
                              product_name: productObj.item_name,
                              product_code: productObj.item_code
                            });
                          } else {
                            updateItem(i, { product: val });
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Unit Column - Dedicated */}
                  <div className="w-24 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Unit</label>
                    <div className="h-[42px] px-3 flex items-center bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
                      {item.unit || "UNIT"}
                    </div>
                  </div>

                  <div className="w-24 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Qty</label>
                    <input
                      type="number"
                      min="1"
                      className="input"
                      placeholder="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, { quantity: e.target.value })}
                      required
                      readOnly={viewOnly}
                      disabled={viewOnly}
                    />
                  </div>

                  <div className="w-full md:w-48 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Remark</label>
                    <input
                      className="input"
                      placeholder="Notes..."
                      value={item.remarks}
                      onChange={(e) =>
                        updateItem(i, { remarks: e.target.value })
                      }
                      readOnly={viewOnly}
                      disabled={viewOnly}
                    />
                  </div>

                  {!viewOnly && (
                    <div className="self-end md:self-center pb-1 md:pb-0 mt-4 md:mt-2">
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                        title="Remove Item"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={submitting}
          >
            {viewOnly ? "Close" : "Cancel"}
          </button>
          {!viewOnly && (
            <button
              onClick={handleSubmit}
              className="btn-primary min-w-[120px]"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>{editData ? "Update Changes" : "Create Requisition"}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequisitionModal;
