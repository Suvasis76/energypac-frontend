import { useEffect, useState } from "react";
import { getVendorAssignments } from "../services/vendorAssignment";
import VendorAssignmentModal from "../components/vendorAssignment/VendorAssignmentModal";

const VendorAssignment = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    const res = await getVendorAssignments();
    setData(res.data.results || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Vendor Assignments</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        >
          + Assign Vendor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Requisition</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Assigned By</th>
              <th className="p-3">Items</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.requisition_number}</td>
                <td className="p-3">{row.vendor_details?.vendor_name}</td>
                <td className="p-3">{row.assigned_by_name}</td>
                <td className="p-3">{row.total_items}</td>
                <td className="p-3">{row.assignment_date}</td>
                <td className="p-3">
                  <button
                    className="btn-warning"
                    onClick={() => {
                      setEditData(row);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VendorAssignmentModal
        open={open}
        editData={editData}
        onClose={() => setOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default VendorAssignment;
