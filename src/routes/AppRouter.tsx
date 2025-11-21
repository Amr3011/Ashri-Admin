import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import AddProduct from "../pages/AddProduct/AddProduct";
import EditProduct from "../pages/EditProduct/EditProduct";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import Layout from "../components/layout/Layout";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
