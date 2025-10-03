import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../config"; 
const useCategory = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${server}/category/get-category`);
      if (data?.success && Array.isArray(data.category)) {
        setCategories(data.category);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message || error);
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
};

export default useCategory;
