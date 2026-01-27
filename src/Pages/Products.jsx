import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ProductModal from "../components/products/ProductModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AlertToast from "../components/ui/AlertToast";
import { getProducts,deleteProduct} from "../services/productService";




export default function Products() {
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [unitFilter, setUnitFilter] = useState("");


    const [error, setError] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [toast, setToast] = useState({
        open: false,
        type: "success",
        message: "",
    });


    const fetchProducts = async (url) => {
    try {
        setLoading(true);

        const res = await getProducts({
            url,
            search: searchText,
            unit: unitFilter,
        });

        setProducts(res.data.results);
        setCount(res.data.count);
        setNext(res.data.next);
        setPrevious(res.data.previous);
    } catch (err) {
        console.log(err);
        setError("Failed to load products");
    } finally {
        setLoading(false);
    }
};



    useEffect(() => {
        fetchProducts();
    }, []);

    /* =========================
       ACTION HANDLERS (UI ONLY)
       ========================= */
    const handleAddProduct = () => {
        setEditProduct(null);
        setOpenModal(true);
    };


    const handleEdit = (item) => {
        setEditProduct(item);
        setOpenModal(true);
    };

    const handleDelete = (item) => {
        setSelectedProduct(item);
        setShowConfirm(true);
    };

    const handleProductSuccess = (mode) => {
        setToast({
            open: true,
            type: "success",
            message:
                mode === "edit"
                    ? "Product updated successfully"
                    : "Product added successfully",
        });

        fetchProducts();
    };


    const confirmDelete = async () => {
    try {
        setDeleting(true);

        await deleteProduct(selectedProduct.id);

        setToast({
            open: true,
            type: "success",
            message: "Product deleted successfully",
        });

        fetchProducts();
    } catch (err) {
        console.log(err);
        setToast({
            open: true,
            type: "error",
            message: "Failed to delete product",
        });
    } finally {
        setDeleting(false);
        setShowConfirm(false);
        setSelectedProduct(null);
    }
};



    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Products</h3>
                        <span className="text-sm text-slate-500 font-semibold">
                            Total: {count}
                        </span>
                    </div>


                    {/* ADD PRODUCT BUTTON */}

                    <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500"
                    >
                        <FaPlus className="text-xs" />
                        Add Product
                    </button>


                </div>

                {/* SEARCH & FILTER */}
<div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
    <div className="flex flex-wrap gap-4">

        {/* Search by Product Name */}
        <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
                Search Product
            </label>
            <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by product name"
                className="input"
            />
        </div>

        {/* Filter by Unit */}
        <div className="w-40">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
                Unit
            </label>
            <input
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="input"
                placeholder="e.g. pcs, kg"
            />
                
        </div>

        {/* Search Button */}
        <div className=" w-32 flex items-end">
            <button
                onClick={() => fetchProducts()}
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
                                <th className="px-6 py-4 text-[13px]">Item Code</th>
                                <th className="px-6 py-4 text-[13px]">Item Name</th>
                                <th className="px-6 py-4 text-[13px]">Description</th>
                                <th className="px-6 py-4 text-[13px]">HSN</th>
                                <th className="px-6 py-4 text-[13px]">Unit</th>
                                <th className="px-6 py-4 text-[13px] text-right">Stock</th>
                                <th className="px-6 py-4 text-[13px] text-right">Reorder</th>
                                <th className="px-6 py-4 text-[13px] text-right">Rate</th>
                                <th className="px-6 py-4 text-[13px] text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading && (
                                <tr>
                                    <td colSpan="9" className="px-6 py-6 text-center text-slate-500">
                                        Loading products...
                                    </td>
                                </tr>
                            )}

                            {!loading && products.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-6 py-6 text-center text-slate-500">
                                        No products found
                                    </td>
                                </tr>
                            )}

                            {products.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="px-6 py-4 font-mono text-blue-600 font-semibold">
                                        {item.item_code}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        {item.item_name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                        {item.description || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {item.hsn_code}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {item.unit}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                                        {item.current_stock}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">
                                        {item.reorder_level}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                                        ₹{item.rate}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
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
                        onClick={() => previous && fetchProducts(previous)}
                        disabled={!previous}
                        className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
                    >
                        ← Previous
                    </button>

                    <button
                        onClick={() => next && fetchProducts(next)}
                        disabled={!next}
                        className="text-sm font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            </div>
            <ProductModal
                key={editProduct ? editProduct.id : "add"}
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleProductSuccess}
                mode={editProduct ? "edit" : "add"}
                product={editProduct}
            />


            <ConfirmDialog
                open={showConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${selectedProduct?.item_name}"?`}
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
}

