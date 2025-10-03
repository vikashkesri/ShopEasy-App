import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { server } from "../config"; 
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${server}/category/get-category`);
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${server}/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  // Get all products 
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/product/product-list/${page}`);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${server}/product/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/product/product-list/${page}`);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  // Reset filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    getAllProducts();
  };

  // Effects
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    else getAllProducts();
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // ✅ Add to cart with quantity = 1
  const addToCart = (product) => {
    const exist = cart.find((c) => c._id === product._id);
    let updatedCart = [];

    if (exist) {
      updatedCart = cart.map((c) =>
        c._id === product._id ? { ...c, quantity: (c.quantity || 1) + 1 } : c
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);

    if (auth?.user?._id) {
      localStorage.setItem(`cart_${auth.user._id}`, JSON.stringify(updatedCart));
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    toast.success("Item Added to cart");
  };

  return (
    <Layout title="All Products - Best Offers">
      <img src="/images/banner.png" className="banner-img" alt="banner" />

      <div className="home-page-container">
        <div className="filters">
          <h4>Filter By Category</h4>
          <div className="filters-scroll">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                checked={checked.includes(c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="mt-4">Filter By Price</h4>
          <div className="filters-scroll">
            <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
              {Prices?.map((p, index) => (
                <div key={index}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <button className="btn btn-danger mt-3" onClick={resetFilters}>
            RESET FILTERS
          </button>
        </div>
        <div className="products-section">
          <h1>All Products</h1>
          <div className="products-grid">
            {products?.map((p) => (
              <div className="card" key={p._id}>
                <img
                  src={`${server}/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text">{p.description.substring(0, 60)}...</p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-dark" onClick={() => addToCart(p)}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products && products.length < total && (
            <div className="text-center mt-3">
              <button className="btn loadmore" onClick={() => setPage(page + 1)}>
                {loading ? "Loading ..." : <>Load More <AiOutlineReload /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
