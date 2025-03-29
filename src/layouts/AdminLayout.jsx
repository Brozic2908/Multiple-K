import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/header/HeaderAdmin";
// Sidebar.jsx
import React,{useState} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaLock,
  FaUser,
  FaThLarge,
  FaFileInvoice,
  FaShoppingCart,
  FaEnvelope,
  FaBell,
  FaCog,
  FaFileAlt,
  FaAngleDown,
  FaAngleRight
} from "react-icons/fa";
import Badge from "react-bootstrap/Badge";
import "./AdminLayout.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };
  return (
    <div className="sidebar px-3 py-4">
      <p className="text-uppercase fw-bold text-muted small mb-3">Main Pages</p>
      <Nav className="flex-column gap-2">
        <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" />
        <SidebarItem icon={<FaLock />} text="Authentication" hasArrow />
        <SidebarItem icon={<FaUser />} text="Users" badge="HOT" badgeVariant="danger" />
        <SidebarSubMenu icon={<FaThLarge />} title="Products" badge="NEW" badgeVariant="pink" isOpen={openMenu === "products"} toggle={() => toggleMenu("products")} links={[
    { to: "/admin/products/list", label: "Product List" },
    { to: "/admin/products/upload", label: "Upload Product" },
  ]}
/>


        <SidebarItem icon={<FaFileInvoice />} text="Invoices" hasArrow />
        <SidebarItem icon={<FaShoppingCart />} text="Orders" badge="5" />
        <SidebarItem icon={<FaEnvelope />} text="Messages" badge="3" />
        <SidebarItem icon={<FaBell />} text="Notifications" badge="9" />
        <SidebarItem icon={<FaCog />} text="Settings" />
        <SidebarItem icon={<FaFileAlt />} text="Blank Page" />
      </Nav>
    </div>
  );
};

const SidebarItem = ({ icon, text, badge, badgeVariant = "primary" }) => {
  return (
    <div className="d-flex justify-content-between align-items-center sidebar-item">
      <div className="d-flex align-items-center gap-2 text-dark">
        <span className="fs-5 d-flex align-items-center">{icon}</span>
        <span>{text}</span>
      </div>
      {badge && (
        <Badge bg={badgeVariant.toLowerCase()} className="badge-custom">
          {badge}
        </Badge>
      )}
    </div>
  );
};

const SidebarSubMenu = ({
  icon,
  title,
  badge,
  badgeVariant = "primary",
  isOpen,
  toggle,
  links = [],
}) => {
  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center sidebar-item"
        onClick={toggle}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center gap-2 text-dark">
          <span className="fs-5 d-flex align-items-center">{icon}</span>
          <span>{title}</span>
          {badge && (
            <Badge bg={badgeVariant.toLowerCase()} className="badge-custom">
              {badge}
            </Badge>
          )}
        </div>
        <span className="ms-2 text-muted">
          {isOpen ? <FaAngleDown /> : <FaAngleRight />}
        </span>
      </div>

      {/* Submenu */}
      {isOpen && (
        <div className="submenu ms-4 mt-2 d-flex flex-column gap-3">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `text-decoration-none submenu-link ${
                  isActive ? "fw-bold text-primary" : "text-dark"
                }`
              }
            >{link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

function AdminLayout() {
  return (
    <>
      <HeaderAdmin />

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <div>
          <Sidebar />
        </div>
        <div  className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
