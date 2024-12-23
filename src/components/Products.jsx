import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  // تعريف الحالات اللازمة
  const [data, setData] = useState([]); // تخزين البيانات الأصلية
  const [filter, setFilter] = useState([]); // تخزين البيانات المصفاة
  const [loading, setLoading] = useState(true); // تحديد حالة التحميل

  const dispatch = useDispatch();

  // دالة لإضافة المنتج إلى السلة
  const addProduct = (product) => {
    dispatch(addCart(product)); // إرسال المنتج إلى السلة باستخدام Redux
  };

  // استخدام useEffect لجلب البيانات عند تحميل المكون
  useEffect(() => {
    const controller = new AbortController(); // لإنهاء الطلب عند إلغاء المكون
    const fetchProducts = async () => {
      try {
        setLoading(true); // بدء التحميل
        const response = await fetch("https://fakestoreapi.com/products/", {
          signal: controller.signal, // دعم الإلغاء
        });
        const products = await response.json(); // تحويل الاستجابة إلى JSON
        setData(products); // تخزين البيانات الأصلية
        setFilter(products); // تعيين البيانات كقائمة مصفاة افتراضية
      } catch (error) {
        // التعامل مع الأخطاء
        if (error.name !== "AbortError") {
          console.error("Failed to fetch products:", error);
        }
      } finally {
        setLoading(false); // إنهاء التحميل
      }
    };

    fetchProducts();

    return () => {
      controller.abort(); // إلغاء الطلب عند تفكيك المكون
    };
  }, []);

  // دالة لتصفية المنتجات حسب الفئة
  const filterProduct = useCallback(
    (category) => {
      if (category === "all") {
        setFilter(data); // عرض جميع المنتجات
      } else {
        const filtered = data.filter((item) => item.category === category); // تصفية المنتجات حسب الفئة
        setFilter(filtered);
      }
    },
    [data]
  );

  // مكون لعرض واجهة التحميل باستخدام مكتبة Skeleton
  const Loading = () => (
    <div className="row">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-12 mb-4">
          <Skeleton height={592} /> {/* عنصر تحميل يمثل بطاقة منتج */}
        </div>
      ))}
    </div>
  );

  // مكون لعرض المنتجات
  const ShowProducts = () => (
    <>
      {/* أزرار تصفية الفئات */}
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

      {/* عرض قائمة المنتجات */}
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
                  {product.title.substring(0, 12)}... {/* عنوان مختصر */}
                </h5>
                <p className="card-text">
                  {product.description.substring(0, 90)}... {/* وصف مختصر */}
                </p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead">$ {product.price}</li> {/* سعر المنتج */}
              </ul>
              <div className="card-body">
                <Link to={`/product/${product.id}`} className="btn btn-dark m-1">
                  Buy Now {/* رابط لصفحة المنتج */}
                </Link>
                <button
                  className="btn btn-dark m-1"
                  onClick={() => addProduct(product)}
                >
                  Add to Cart {/* زر لإضافة المنتج إلى السلة */}
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
      {loading ? <Loading /> : <ShowProducts />} {/* عرض واجهة التحميل أو المنتجات */}
    </div>
  );
};

export default Products;
