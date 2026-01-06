import { useCallback, useEffect, useRef, useState } from "react";
import { getAllProducts } from "../../../../services/admin/apiProduct";
import { message } from "antd";

export const useFetchProducts = ({ search, setSearch, flag }) => {
  const [productLoading, setProductLoading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const searchDebounceRef = useRef(null);

  const fetchProducts = useCallback(async (search = "") => {
    try {
      setProductLoading(true);
      const params = new URLSearchParams({
        search: search || "",
        page: "1",
        limit: "50",
      });
      const { status, data } = await getAllProducts(params.toString());

      if (status) {
        const opts =
          (data || []).map((p) => ({
            label: p.name || p.title || p._id,
            value: String(p._id),
          })) || [];
        setProductOptions(opts);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (err) {
      console.log(err);
      message.error(err.message || "Error fetching products");
    } finally {
      setProductLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!flag) {
      setSearch("");
      clearTimeout(searchDebounceRef.current);
    }
  }, [flag, fetchProducts]);

  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchProducts(search);
    }, 300);

    return () => clearTimeout(searchDebounceRef.current);
  }, [search, fetchProducts]);

  return { productLoading, productOptions };
};
