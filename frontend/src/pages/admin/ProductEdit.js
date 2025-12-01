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

  const [categories, setCategories] = useState([]); // 전체 카테고리
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

  // -------------------------
  // 1) 전체 카테고리 불러오기
  // -------------------------
  const fetchCategories = async () => {
    const res = await api.get("/api/categories");
    const list = res.data;

    setCategories(list);

    // 대분류 목록 추출 (중복 제거)
    const majors = [...new Set(list.map((c) => c.majorCategory))];
    setMajorList(majors);
  };

  // -------------------------
  // 2) 특정 상품 정보 불러오기
  // -------------------------
  const fetchProduct = async () => {
    const res = await api.get(`/products/${id}`);
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
      categoryId: data.categoryId, // ★ categoryId 포함
    });

    setLoading(false);
  };

  // -------------------------
  // 3) 대분류 바뀌면 중분류 리스트 필터링
  // -------------------------
  useEffect(() => {
    if (form.majorCategory === "") return;

    const filtered = categories
      .filter((c) => c.majorCategory === form.majorCategory)
      .map((c) => c.middleCategory);

    setMiddleList([...new Set(filtered)]);
  }, [form.majorCategory, categories]);


  // -------------------------
  // 4) 중분류 바뀌면 categoryId 자동 설정
  // -------------------------
  useEffect(() => {
    if (!form.majorCategory || !form.middleCategory) return;

    const match = categories.find(
      (c) =>
        c.majorCategory === form.majorCategory &&
        c.middleCategory === form.middleCategory
    );

    if (match) {
      setForm((prev) => ({ ...prev, categoryId: match.categoryId }));
    }
  }, [form.majorCategory, form.middleCategory, categories]);


  // 최초 1회 호출
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  if (loading) return <div>⏳ 불러오는 중...</div>;
  if (!product) return <div>❌ 상품을 찾을 수 없습니다.</div>;

  // -------------------------
  // 이미지 URL 변환
  // -------------------------
  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";

    const fixedDir = img.saveDir.replace(/\\/g, "/");
    const folder = fixedDir.split("uploads/product/")[1];

    if (!folder) return "/no-image.png";
    return `/uploads/product/${folder}/${img.fileName}`;
  };

  // 입력 처리
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 파일 선택
  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // -------------------------
  // 저장하기
  // -------------------------
  const handleSubmit = async () => {
    if (!window.confirm("상품 정보를 수정하시겠습니까?")) return;

    // 1) 상품 정보 수정
    await api.put(`/admin/products/${id}`, form);

    // 2) 이미지 업로드
    if (newImages.length > 0) {
      const fd = new FormData();
      newImages.forEach((file) => fd.append("files", file));

      await api.post(`/products/${id}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    alert("상품 수정이 완료되었습니다!");
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="product-edit-container">
        <h1>상품 수정</h1>

        {/* 이미지 섹션 */}
        <div className="edit-section">
          <div className="edit-image-box">
            <h3>현재 등록된 이미지</h3>

            {product.images?.length > 0 ? (
              <img
                src={getImageUrl(product.images[0])}
                alt="상품 이미지"
                className="edit-image-preview"
              />
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>

          <div className="edit-upload-box">
            <h3>새 이미지 업로드</h3>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
        </div>

        {/* 수정 폼 */}
        <div className="edit-form">
          <label>상품명</label>
          <input name="productName" value={form.productName} onChange={handleInput} />

          <label>원가</label>
          <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleInput} />

          <label>판매가</label>
          <input name="salePrice" type="number" value={form.salePrice} onChange={handleInput} />

          <label>재고</label>
          <input name="stock" type="number" value={form.stock} onChange={handleInput} />

          {/* ============================= */}
          {/*        대분류 선택 + 입력      */}
          {/* ============================= */}
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
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="직접 입력"
            value={form.majorCategory}
            onChange={(e) =>
              setForm({
                ...form,
                majorCategory: e.target.value,
              })
            }
          />

          {/* ============================= */}
          {/*        중분류 선택 + 입력      */}
          {/* ============================= */}
          <label>중분류 카테고리</label>
          <select
            name="middleCategory"
            value={form.middleCategory}
            onChange={(e) =>
              setForm({
                ...form,
                middleCategory: e.target.value,
              })
            }
          >
            <option value="">선택</option>
            {middleList.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="직접 입력"
            value={form.middleCategory}
            onChange={(e) =>
              setForm({
                ...form,
                middleCategory: e.target.value,
              })
            }
          />

          {/* 상품 설명 */}
          <label>상품 설명</label>
          <textarea name="description" value={form.description} onChange={handleInput} />

          {/* 저장 / 취소 */}
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSubmit}>저장하기</button>
            <button className="cancel-btn" onClick={() => navigate("/admin/products")}>취소</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
