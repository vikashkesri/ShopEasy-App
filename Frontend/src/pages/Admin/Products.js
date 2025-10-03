import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Get token if user is logged in
  const getToken = () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      return authData?.token || "";
    } catch {
      return "";
    }
  };

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const { data } = await axios.get(`${API_BASE_URL}/api/v1/product/get-product`, config);

      console.log("Products fetched:", data);

      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data?.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong while fetching products"
      );
    }
  };

  // Delete product
  const handleDelete = async (pid) => {
    try {
      const token = getToken();

      if (!window.confirm("Are you sure you want to delete this product?")) return;

      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/product/delete-product/${pid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        toast.success("Product deleted successfully");
        getAllProducts();
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong while deleting product"
      );
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Dashboard - All Products">
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products List</h1>

          {products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${API_BASE_URL}/api/v1/product/product-photo/${p._id}?${new Date().getTime()}`}
                    className="card-img-top"
                    alt={p.name}
                    onError={(e) => (e.target.src = "/default-product.png")}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description?.substring(0, 50)}...</p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
