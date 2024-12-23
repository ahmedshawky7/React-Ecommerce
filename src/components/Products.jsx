import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]); // تخزين البيانات الأصلية
  const [filter, setFilter] = useState([]); // تخزين البيانات المصفاة
  const [loading, setLoading] = useState(true); // تحديد حالة التحميل
  const [searchTerm, setSearchTerm] = useState(""); // حالة لتتبع البحث

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product)); // إرسال المنتج إلى السلة باستخدام Redux
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products/", {
          signal: controller.signal,
        });
        const products = await response.json();
        setData(products);
        setFilter(products);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch products:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  // تصفية المنتجات بناءً على الفئة
  const filterProduct = useCallback(
    (category) => {
      if (category === "all") {
        setFilter(data);
      } else {
        const filtered = data.filter((item) => item.category === category);
        setFilter(filtered);
      }
    },
    [data]
  );

  // تحديث قائمة المنتجات بناءً على البحث
  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilter(filtered);
  };

  const Loading = () => (
    <div className="row">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </div>
  );

  const ShowProducts = () => (
    <>
      <div className="d-flex justify-content-center py-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark ms-2" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="buttons text-center py-5">
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("all")}>
          All
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>
          Men's Clothing
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>
          Women's Clothing
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>
          Jewelery
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>
          Electronics
        </button>
      </div>

      <div className="row">
        {filter.map((product) => (
          <div key={product.id} className="col-md-4 col-sm-6 col-12 mb-4">
            <div className="card text-center h-100">
              <img
                className="card-img-top p-3"
                src={product.image}
                alt={product.title}
                height={300}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {product.title.substring(0, 12)}...
                </h5>
                <p className="card-text">
                  {product.description.substring(0, 90)}...
                </p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead">$ {product.price}</li>
              </ul>
              <div className="card-body">
                <Link to={`/product/${product.id}`} className="btn btn-dark m-1">
                  Buy Now
                </Link>
                <button
                  className="btn btn-dark m-1"
                  onClick={() => addProduct(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products;
