import { useEffect, useState } from "react";
import { createVendor, updateVendor } from "../../services/vendorService";

const initialState = {
    vendor_code: "",
    vendor_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
    pan_number: "",
};

export default function VendorModal({
    open,
    onClose,
    mode,
    vendor,
    onSuccess,
}) {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && vendor) {
            setForm({
                vendor_code: vendor.vendor_code || "",
                vendor_name: vendor.vendor_name || "",
                contact_person: vendor.contact_person || "",
                phone: vendor.phone || "",
                email: vendor.email || "",
                address: vendor.address || "",
                gst_number: vendor.gst_number || "",
                pan_number: vendor.pan_number || "",
            });
        } else {
            setForm(initialState);
        }
    }, [mode, vendor, open]);

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (mode === "edit") {
    await updateVendor(vendor.id, form);
} else {
    await createVendor(form);
}


            onSuccess(mode);
            onClose();
        } catch (err) {
            console.log(err);
            alert("Failed to save vendor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                    {mode === "edit" ? "Edit Vendor" : "Add Vendor"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Vendor Code</label>
                            <input className="input" name="vendor_code" value={form.vendor_code} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="label">Vendor Name</label>
                            <input className="input" name="vendor_name" value={form.vendor_name} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="label">Contact Person</label>
                            <input className="input" name="contact_person" value={form.contact_person} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">Phone</label>
                            <input className="input" name="phone" value={form.phone} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input className="input" name="email" value={form.email} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">GST Number</label>
                            <input className="input" name="gst_number" value={form.gst_number} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="label">PAN Number</label>
                            <input className="input" name="pan_number" value={form.pan_number} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="label">Address</label>
                        <textarea className="input" name="address" value={form.address} onChange={handleChange} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Vendor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
