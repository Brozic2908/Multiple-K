import axios from "axios";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage.");
        return;
      }

      const res = await axios.get(
        "http://localhost/web-hk242/backend/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mappedUsers = res.data.users.map((u) => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name || ""}`.trim(),
        email: u.email,
        phone: u.phone,
        birthday: u.birthdate,
        country: u.region,
        role: u.role === "admin" ? "Admin" : "User",
        avatar:
          u.avatar_url || "https://via.placeholder.com/150x150?text=No+Image",
        bio: `Registered since ${new Date(u.created_at).getFullYear()}`,
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? user.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost/web-hk242/backend/admin/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Lỗi khi xóa tài khoản.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">User Management</h3>

      <Row className="mb-3 g-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">Filter by role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No users found.
              </td>
            </tr>
          )}
          {filteredUsers.map((user, idx) => (
            <tr key={user.id}>
              <td>{idx + 1}</td>
              <td>
                <Image
                  src={user.avatar}
                  roundedCircle
                  width={50}
                  height={50}
                  alt="avatar"
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Badge bg={user.role === "Admin" ? "danger" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleViewDetail(user)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={() => handleDeleteUser(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <div className="text-center mb-3">
                <Image
                  src={selectedUser.avatar}
                  roundedCircle
                  width={100}
                  height={100}
                  alt="avatar"
                />
              </div>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Birthday:</strong> {selectedUser.birthday}
              </p>
              <p>
                <strong>Country:</strong> {selectedUser.country}
              </p>
              <p>
                <strong>Biography:</strong> {selectedUser.bio}
              </p>
              <Form.Group className="mt-3">
                <Form.Label>
                  <strong>Role:</strong>
                </Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const newRole =
                  selectedUser.role === "Admin" ? "admin" : "user";

                await axios.put(
                  `http://localhost/web-hk242/backend/admin/users/${selectedUser.id}`,
                  { role: newRole },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                setUsers((prev) =>
                  prev.map((user) =>
                    user.id === selectedUser.id
                      ? { ...user, role: selectedUser.role }
                      : user
                  )
                );

                setShowModal(false);
              } catch (error) {
                console.error("Failed to update role", error);
                alert("Lỗi khi cập nhật vai trò.");
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
