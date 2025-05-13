import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/header/HeaderAdmin";
// Sidebar.jsx
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaAngleRight,
  FaBell,
  FaCog,
  FaEnvelope,
  FaFileAlt,
  FaLock,
  FaShoppingCart,
  FaTachometerAlt,
  FaThLarge,
  FaUser,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };
  return (
    <div className="sidebar px-3 py-4">
      <p className="text-uppercase fw-bold text-muted small mb-3">Main Pages</p>
      <div className="d-flex flex-column gap-2">
        <SidebarItem
          icon={<FaUser />}
          text="Users"
          badge="HOT"
          badgeVariant="danger"
          to="/admin"
        />

        <SidebarSubMenu
          icon={<FaThLarge />}
          title="Products"
          badge="NEW"
          badgeVariant="pink"
          isOpen={openMenu === "products"}
          toggle={() => toggleMenu("products")}
          links={[
            { to: "/admin/products/list", label: "Product List" },
            { to: "/admin/products/upload", label: "Upload Product" },
          ]}
        />

        <SidebarItem
          icon={<i className="fa-solid fa-building-user"></i>}
          text="Introduction"
          to={"/admin/introduction"}
        />
        <SidebarItem
          icon={<i className="fa-solid fa-comments"></i>}
          text="Q&A"
          to={"/admin/questions"}
        />
        <SidebarItem
          icon={<FaShoppingCart />}
          text="Orders"
          badge="5"
          to={"/admin/orders"}
        />
        <SidebarItem
          icon={<FaEnvelope />}
          text="Contacts"
          to="/admin/contacts"
        />
        <SidebarItem
          icon={<FaFileAlt />}
          text="Community"
          to="/admin/community"
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, badge, badgeVariant = "primary", to }) => {
  const content = (
    <div className="d-flex justify-content-between align-items-center sidebar-item">
      <div className="d-flex align-items-center gap-2 text-dark">
        <span className="fs-5 d-flex align-items-center">{icon}</span>
        <span>{text}</span>
      </div>
      {badge && (
        <span className={`badge bg-${badgeVariant.toLowerCase()} badge-custom`}>
          {badge}
        </span>
      )}
    </div>
  );

  return to ? (
    <NavLink to={to} className="text-decoration-none text-dark">
      {content}
    </NavLink>
  ) : (
    content
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
            <span
              className={`badge bg-${badgeVariant.toLowerCase()} badge-custom`}
            >
              {badge}
            </span>
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
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

// function AdminLayout() {
//   return (
//     <>
//       <HeaderAdmin />

//       <div className="d-flex" style={{ minHeight: "100vh" }}>
//         <div>
//           <Sidebar />
//         </div>
//         <div className="flex-grow-1 p-4 bg-light">
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// export default AdminLayout;
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992); // 992px = breakpoint lg của Bootstrap

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    // Gọi 1 lần ngay khi load
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <HeaderAdmin isMobile={isMobile} toggleSidebar={toggleSidebar} />
      <div
        className="container-fluid admin-layout d-flex"
        style={{ minHeight: "100vh" }}
      >
        {/* Sidebar */}
        <div className={`sidebarWrapper ${sidebarOpen ? "open1" : ""}`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="main-content1 flex-grow-1 bg-light mt-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
