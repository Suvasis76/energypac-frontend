import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Requisition from "./pages/Requisition";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Vendor from "./pages/Vendor";
import VendorAssignment from "./pages/VendorAssignment";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/master/item" element={<Products />} />
              <Route path="/master/vendor" element={<Vendor />} />
              <Route path="/sales" element={<Dashboard />} />
              <Route path="/requisition" element={<Requisition />} />
              <Route path="/vendor-assignment" element={<VendorAssignment />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
