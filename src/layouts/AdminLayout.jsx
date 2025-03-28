import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/header/HeaderAdmin";
// Sidebar.jsx
import React from "react";
import { Nav } from "react-bootstrap";
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
  FaFileAlt
} from "react-icons/fa";
import Badge from "react-bootstrap/Badge";
import "./AdminLayout.css";

const Sidebar = () => {
  return (
    <div className="sidebar px-3 py-4">
      <p className="text-uppercase fw-bold text-muted small mb-3">Main Pages</p>
      <Nav className="flex-column gap-2">
        <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" />
        <SidebarItem icon={<FaLock />} text="Authentication" hasArrow />
        <SidebarItem icon={<FaUser />} text="Users" badge="HOT" badgeVariant="danger" />
        <SidebarItem icon={<FaThLarge />} text="Products" badge="NEW" badgeVariant="pink" />
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

const SidebarItem = ({ icon, text, badge, badgeVariant = "primary", hasArrow }) => {
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
      {hasArrow && <span className="ms-2 text-muted">&gt;</span>}
    </div>
  );
};
function AdminLayout() {
	return (
		<>
			<HeaderAdmin />
            <Sidebar/>
			<Outlet />
		</>
	);
}

export default AdminLayout;
