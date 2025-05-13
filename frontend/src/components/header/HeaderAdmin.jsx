import {
  faBell,
  faCartShopping,
  faEnvelope,
  faGlobe,
  faMagnifyingGlass,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./HeaderAdmin.css";

const HeaderAdmin = ({ isMobile, toggleSidebar }) => {
  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // In thông báo để debug
    console.log("User logged out successfully");

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light nav-bar-admin shadow-sm py-2 sticky-top">
      <div className="container-fluid px-3">
        <div className="d-flex row left-element-bar w-100 align-items-center gap-4">
          {/* Logo */}
          <div className="okela mb-0">
            <div className="d-flex">
              {isMobile && (
                <button
                  className="btn btn-outline-primary me-3"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-list"></i> {/* Hoặc icon FaBars */}
                </button>
              )}
              <div className="col-md-2 d-flex align-items-center gap-2 ">
                <img
                  src="https://storage-asset.msi.com/frontend/imgs/logo.png"
                  alt="MSI Logo"
                  width="98.8"
                  height="65"
                />
              </div>
            </div>
            {/* User Dropdown */}
            <div className="dropdown d-md-none">
              <button
                className="btn p-0 border-0 bg-transparent d-flex align-items-center dropdown-toggle me-1"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className={`avatar bg-warning me-3`}>
                  <span className="avatar-content">AS</span>
                  <span className={`bg-success avatar-status`}></span>
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold text-dark">Miron Mahmud</div>
                  <div className="text-muted">@mironcoder</div>
                </div>
              </button>

              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link className="dropdown-item" href="#">
                  Profile
                </Link>
                <Link className="dropdown-item" href="#">
                  Setting
                </Link>
                <Link className="dropdown-item" href="#" onClick={handleLogout}>
                  Log out
                </Link>
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="col-12 col-md-5 col-xl-4">
            <form className="container-fluid">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-sm bg-light"
                  placeholder="quick finding..."
                />
              </div>
            </form>
          </div>

          {/* Icons + User */}
          <div className="col-xl-6 col-12 d-flex align-items-center justify-content-center gap-3 gap-md-5">
            <div className="position-relative icon-circle">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-secondary"
              />
              <span className="badge bg-primary rounded-pill position-absolute top-0 start-100 translate-middle">
                12
              </span>
            </div>
            <div className="position-relative icon-circle">
              <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
              <span className="badge bg-primary rounded-pill position-absolute top-0 start-100 translate-middle">
                23
              </span>
            </div>
            <div className="position-relative icon-circle">
              <FontAwesomeIcon icon={faBell} className="text-secondary" />
              <span className="badge bg-primary rounded-pill position-absolute top-0 start-100 translate-middle">
                34
              </span>
            </div>

            {/* User Dropdown */}
            <div className="dropdown d-none d-md-block">
              <button
                className="btn p-0 border-0 bg-transparent d-flex align-items-center dropdown-toggle me-1"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className={`avatar bg-warning me-3`}>
                  <span className="avatar-content">AS</span>
                  <span className={`bg-success avatar-status`}></span>
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold text-dark">Miron Mahmud</div>
                  <div className="text-muted">@mironcoder</div>
                </div>
              </button>

              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link className="dropdown-item" to="/admin/profile">
                  Profile
                </Link>
                <Link className="dropdown-item" href="#">
                  Setting
                </Link>
                <Link className="dropdown-item" href="#" onClick={handleLogout}>
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
