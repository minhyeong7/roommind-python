// src/pages/admin/UserManage.js
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAllUsers, updateUserRole } from "../../api/adminApi";
import "./UserManage.css";

/** 🔒 관리자 권한 회수 금지 이메일 */
const PROTECTED_ADMIN_EMAIL = "qwer1234@naver.com";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sort, setSort] = useState("created_desc");

  const [selectedUser, setSelectedUser] = useState(null);

  /* ================================
      전체 회원 조회
  ================================= */
  useEffect(() => {
    fetchAllUsers(keyword, filterRole, sort)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("회원 조회 실패:", err));
  }, [keyword, filterRole, sort]);

  /* ================================
       권한 변경 (프론트 전용 차단)
  ================================= */
  const handleRoleChange = async (id, currentRole, email) => {
    if (email === PROTECTED_ADMIN_EMAIL) {
      alert("해당 계정은 최고 관리자이므로 권한 변경이 불가능합니다.");
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";

    if (!window.confirm(`해당 회원을 '${newRole}'로 변경하시겠습니까?`)) return;

    try {
      await updateUserRole(id, newRole);

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === id ? { ...user, role: newRole } : user
        )
      );

      alert("권한 변경 성공!");
    } catch (error) {
      console.error("권한 변경 실패:", error);
      alert("실패했습니다.");
    }
  };

  return (
    <AdminLayout>
      <h1>회원 관리 페이지</h1>
      <p>전체 회원을 조회하고 관리합니다.</p>

      {/* 검색 / 필터 / 정렬 */}
      <div className="user-search-filter">
        <input
          className="search-input"
          type="text"
          placeholder="이름 / 이메일 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">전체 권한</option>
          <option value="user">일반회원</option>
          <option value="admin">관리자</option>
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="created_desc">가입일 최신순</option>
          <option value="created_asc">가입일 오래된순</option>
          <option value="id_asc">ID 오름차순</option>
          <option value="id_desc">ID 내림차순</option>
          <option value="name_asc">이름 가나다순</option>
          <option value="name_desc">이름 역순</option>
        </select>
      </div>

      {/* 회원 목록 */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>권한</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const isProtectedAdmin =
              u.role === "admin" && u.email === PROTECTED_ADMIN_EMAIL;

            return (
              <tr
                key={u.userId}
                className={u.role === "admin" ? "admin-row" : ""}
                onClick={() => setSelectedUser(u)}
              >
                <td>{u.userId}</td>
                <td>{u.userName}</td>
                <td>{u.phone || "-"}</td>
                <td>{u.email}</td>
                <td>{u.createdDate}</td>
                <td>
                  {u.role === "admin" ? (
                    <span
                      className={
                        isProtectedAdmin ? "super-admin-label" : "admin-label"
                      }
                    >
                      {isProtectedAdmin ? "슈퍼 관리자" : "관리자"}
                    </span>
                  ) : (
                    "일반회원"
                  )}
                </td>

                <td>
                  {isProtectedAdmin ? (
                    <span className="protected-text">변경 불가</span>
                  ) : (
                    <button
                      className="role-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleChange(u.userId, u.role, u.email);
                      }}
                    >
                      {u.role === "admin"
                        ? "일반회원으로 변경"
                        : "관리자 권한 부여"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 상세 모달 */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedUser(null)}>
              ✕
            </button>

            <h2>회원 상세 정보</h2>

            <p><strong>ID:</strong> {selectedUser.userId}</p>
            <p><strong>이름:</strong> {selectedUser.userName}</p>
            <p><strong>전화번호:</strong> {selectedUser.phone || "-"}</p>
            <p><strong>이메일:</strong> {selectedUser.email}</p>
            <p><strong>주소:</strong> {selectedUser.address || "-"}</p>
            <p>
              <strong>권한:</strong>{" "}
              {selectedUser.email === PROTECTED_ADMIN_EMAIL ? (
                <span className="super-admin-badge">최고 관리자</span>
              ) : selectedUser.role === "admin" ? (
                <span className="admin-badge">관리자</span>
              ) : (
                "일반회원"
              )}
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
