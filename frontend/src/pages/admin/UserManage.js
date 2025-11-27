import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAllUsers, updateUserRole } from "../../api/adminApi";
import "./UserManage.css";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");      // 🔍 검색 입력값
  const [filterRole, setFilterRole] = useState(""); // 🔽 권한 필터

  const [selectedUser, setSelectedUser] = useState(null);

  /** 전체 회원 조회 */
  const loadUsers = () => {
    fetchAllUsers(keyword, filterRole)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("회원 조회 실패:", err));
  };

  useEffect(() => {
    loadUsers();
  }, [keyword, filterRole]);

  /** 관리자 권한 변경 */
  const handleRoleChange = async (id, currentRole) => {
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

      {/* 🔍 검색 + 🔽 권한 드롭다운 */}
      <div className="user-search-filter">
        <input
          type="text"
          placeholder="이름 / 이메일 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">전체 권한</option>
          <option value="user">일반회원</option>
          <option value="admin">관리자</option>
        </select>
      </div>

      {/* 사용자 목록 테이블 */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>권한</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId} onClick={() => setSelectedUser(u)}>
              <td>{u.userId}</td>
              <td>{u.userName}</td>
              <td>{u.phone || "-"}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <button
                  className="role-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleChange(u.userId, u.role);
                  }}
                >
                  {u.role === "admin" ? "일반회원으로 변경" : "관리자 권한 부여"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상세 모달 */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>회원 상세 정보</h2>

            <p><strong>ID:</strong> {selectedUser.userId}</p>
            <p><strong>이름:</strong> {selectedUser.userName}</p>
            <p><strong>전화번호:</strong> {selectedUser.phone}</p>
            <p><strong>이메일:</strong> {selectedUser.email}</p>
            <p><strong>주소:</strong> {selectedUser.address}</p>
            <p><strong>권한:</strong> {selectedUser.role}</p>

            <button onClick={() => setSelectedUser(null)}>닫기</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
