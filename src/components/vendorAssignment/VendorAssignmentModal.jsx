import { useEffect, useState } from "react";
import {
  createVendorAssignment,
  updateVendorAssignment,
} from "../../services/vendorAssignment";
import VendorSelector from "../common/VendorSelector";
import RequisitionSelector from "../common/RequisitionSelector";
import { HiX } from "react-icons/hi";

const VendorAssignmentModal = ({ open, onClose, editData, onSuccess }) => {
  const [form, setForm] = useState({
    requisition: "",
    vendor: "",
    remarks: "",
    items: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        requisition: editData.requisition,
        vendor: editData.vendor,
        remarks: editData.remarks || "",
        items: editData.items || [],
      });
    } else {
      setForm({
        requisition: "",
        vendor: "",
        remarks: "",
        items: [],
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      requisition: form.requisition,
      vendor: form.vendor,
      remarks: form.remarks,
      items: form.items,
    };

    try {
      if (editData) {
        await updateVendorAssignment(editData.id, payload);
      } else {
        await createVendorAssignment(payload);
      }
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {editData ? "Edit Vendor Assignment" : "Assign Vendor"}
          </h2>
          <button onClick={onClose}>
            <HiX size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <RequisitionSelector
            value={form.requisition}
            onChange={(val, reqObj) =>
              setForm({
                ...form,
                requisition: val,
                items: reqObj?.items || [],
              })
            }
            disabled={!!editData}
          />

          <VendorSelector
            value={form.vendor}
            onChange={(val) => setForm({ ...form, vendor: val })}
          />

          <textarea
            className="input"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          {/* Items Preview */}
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">Product</th>
                  <th className="p-2">Unit</th>
                  <th className="p-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((i, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{i.product_name}</td>
                    <td className="p-2">{i.unit}</td>
                    <td className="p-2">{i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn-primary" disabled={submitting}>
              {editData ? "Update" : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAssignmentModal;
