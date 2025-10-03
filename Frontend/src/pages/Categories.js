import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../config";

const Categories = () => {
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams(); 

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${server}/category/get-category`);
      if (data?.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
      toast.error("Error loading categories");
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      let response;
      if (!slug) {
        response = await axios.get(`${server}/product/get-product`);
        setSelectedCategory(null);
      } else {
        response = await axios.get(`${server}/product/product-category/${slug}`);
        setSelectedCategory(slug);
      }
      if (response.data?.success) setProducts(response.data.products);
      else setProducts([]);
    } catch (err) {
      console.error(err);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
    getProducts();
  }, [slug]); 

  const handleAddToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);
    let updatedCart = [];
    if (exist) {
      updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Layout title="Categories & Products">
      <div className="container mt-5 pt-5">
        <h1 className="mb-4">Categories</h1>
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn ${selectedCategory === null ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => navigate("/categories")}
          >
            All Categories
          </button>
          {categories.length > 0 ? (
            categories.map((c) => (
              <button
                key={c._id}
                className={`btn ${selectedCategory === c.slug ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => navigate(`/categories/${c.slug}`)}
              >
                {c.name}
              </button>
            ))
          ) : (
            <h4>No Categories Found</h4>
          )}
        </div>

        <h1 className="mb-4">Products</h1>
        {loading && <h4>Loading Products...</h4>}
        {!loading && products.length === 0 && <h4>No Products Found</h4>}

        <div className="row">
          {!loading &&
            products.map((p) => (
              <div className="col-md-3 mb-4" key={p._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`${server}/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text flex-grow-1">{p.description.substring(0, 60)}...</p>
                    <h6>
                      Price:{" "}
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h6>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-info"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
