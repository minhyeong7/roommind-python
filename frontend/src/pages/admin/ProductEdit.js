import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import "./ProductEdit.css";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [majorList, setMajorList] = useState([]);
  const [middleList, setMiddleList] = useState([]);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    stock: "",
    majorCategory: "",
    middleCategory: "",
    categoryId: "",
  });

  const [newImages, setNewImages] = useState([]);

  /* =====================================================
     1) 카테고리 목록 → GET /admin/categories
  ===================================================== */
  const fetchCategories = async () => {
    const res = await api.get("/admin/categories");
    const list = res.data;

    setCategories(list);

    const majors = [...new Set(list.map((c) => c.majorCategory))];
    setMajorList(majors);
  };

  /* =====================================================
     2) 상품 정보 → GET /admin/products/{id}
  ===================================================== */
  const fetchProduct = async () => {
    const res = await api.get(`/admin/products/${id}`);
    const data = res.data;

    setProduct(data);

    setForm({
      productName: data.productName,
      description: data.description,
      originalPrice: data.originalPrice,
      salePrice: data.salePrice,
      stock: data.stock,
      majorCategory: data.majorCategory,
      middleCategory: data.middleCategory,
      categoryId: data.categoryId,
    });

    setLoading(false);
  };

  /* =====================================================
     3) majorCategory 선택 → middle 필터링
  ===================================================== */
  useEffect(() => {
    if (!form.majorCategory) {
      setMiddleList([]);
      return;
    }

    const filtered = categories
      .filter((c) => c.majorCategory === form.majorCategory)
      .map((c) => c.middleCategory);

    setMiddleList([...new Set(filtered)]);
  }, [form.majorCategory, categories]);

  /* =====================================================
     4) major + middle => categoryId 자동 설정
  ===================================================== */
  useEffect(() => {
    const match = categories.find(
      (c) =>
        c.majorCategory === form.majorCategory &&
        c.middleCategory === form.middleCategory
    );

    if (match) {
      setForm((prev) => ({ ...prev, categoryId: match.categoryId }));
    }
  }, [form.majorCategory, form.middleCategory, categories]);

  /* =====================================================
     5) 초기 로딩
  ===================================================== */
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  if (loading) return <div>⏳ 불러오는 중...</div>;
  if (!product) return <div>❌ 상품을 찾을 수 없습니다.</div>;

  /* =====================================================
     이미지 URL 생성
  ===================================================== */
  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";

    const fixedDir = img.saveDir.replace(/\\/g, "/");
    const folder = fixedDir.split("uploads/product/")[1];
    if (!folder) return "/no-image.png";

    return `/uploads/product/${folder}/${img.fileName}`;
  };

  /* 입력 처리 */
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  /* =====================================================
     저장하기 (경로 그대로 유지!!)
  ===================================================== */
  const handleSubmit = async () => {
    if (!window.confirm("상품 정보를 수정하시겠습니까?")) return;

    await api.put(`/admin/products/${id}`, form);

    if (newImages.length > 0) {
      const fd = new FormData();
      newImages.forEach((f) => fd.append("files", f));

      await api.post(`/admin/products/${id}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    alert("상품 수정이 완료되었습니다!");
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="product-edit-container">
        <h1 className="edit-title">상품 수정</h1>

        <div className="edit-section">
          {/* 기존 이미지 */}
          <div className="edit-image-box">
            <h3>현재 이미지</h3>
            {product.images?.length > 0 ? (
              <img
                src={getImageUrl(product.images[0])}
                alt=""
                className="edit-image-preview"
              />
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>

          {/* 새 이미지 업로드 */}
          <div className="edit-upload-box">
            <h3>새 이미지 업로드</h3>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
        </div>

        {/* 폼 */}
        <div className="edit-form">
          <label>상품명</label>
          <input name="productName" value={form.productName} onChange={handleInput} />

          <label>원가</label>
          <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleInput} />

          <label>판매가</label>
          <input type="number" name="salePrice" value={form.salePrice} onChange={handleInput} />

          <label>재고</label>
          <input type="number" name="stock" value={form.stock} onChange={handleInput} />

          {/* 대분류 */}
          <label>대분류 카테고리</label>
          <select
            name="majorCategory"
            value={form.majorCategory}
            onChange={(e) =>
              setForm({
                ...form,
                majorCategory: e.target.value,
                middleCategory: "",
              })
            }
          >
            <option value="">선택</option>
            {majorList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* 중분류 */}
          <label>중분류 카테고리</label>
          <select
            name="middleCategory"
            value={form.middleCategory}
            onChange={(e) => setForm({ ...form, middleCategory: e.target.value })}
          >
            <option value="">선택</option>
            {middleList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label>상품 설명</label>
          <textarea name="description" value={form.description} onChange={handleInput} />

          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSubmit}>
              저장하기
            </button>
            <button className="cancel-btn" onClick={() => navigate("/admin/products")}>
              취소
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
