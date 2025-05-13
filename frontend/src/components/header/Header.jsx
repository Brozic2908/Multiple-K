import { use, useContext, useState } from "react";
import "./Header.css";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faMagnifyingGlass,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { Dropdown } from "react-bootstrap";

export default function Header() {
  const [visiable, setVisiable] = useState(false);
  const { cartItems } = useContext(CartContext);
  const handleOnchangeMedia = (matches) => {
    if (!matches) {
      setVisiable(matches);
    }
  };

  const handleVisiable = () => {
    setVisiable(!visiable);
  };

  const isSmallerHeader = useMediaQuery(
    { maxWidth: 996 },
    undefined,
    handleOnchangeMedia
  );

  return (
    <header>
      <nav className="shadow-sm nav-header">
        <div className="header_container" style={{ height: 82.4 }}>
          <div className="main-area d-flex justify-content-between">
            <div className="bar align-content-center">
              <button className="p-3" onClick={handleVisiable}>
                {visiable ? (
                  <FontAwesomeIcon icon={faXmark} />
                ) : (
                  <FontAwesomeIcon icon={faBars} />
                )}
              </button>
            </div>
            <div className="logo align-content-center">
              <NavLink to="/">
                <img
                  src="/logo/logo.png"
                  alt="MSI  Logo"
                  width="98.8"
                  height="65"
                />
              </NavLink>
            </div>
            <div className="main-area-menu">
              <div className="nav-item">
                <NavLink to="products">Sản phẩm</NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="introduction">Giới thiệu</NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="community">Cộng đồng</NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="questions">Hỏi/đáp</NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="contact">Liên hệ</NavLink>
              </div>
            </div>

            <div className="menu-area-icon d-flex align-items-center">
              <div className="operation-icon px-3">
                <Dropdown align="end" className="cart-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    className="p-0 border-0 shadow-none bg-transparent d-flex align-items-center text-dark"
                  >
                    <div className="cart-icon-wrapper position-relative">
                      <FontAwesomeIcon icon={faCartShopping} size="lg" />
                      {cartItems.length > 0 && (
                        <span className="cart-badge badge rounded-pill bg-danger position-absolute top-0 start-50">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                    <FontAwesomeIcon icon="caret-down" className="text-muted" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={NavLink} to="/cart">
                      🛒 Đơn hàng hiện tại
                    </Dropdown.Item>
                    <Dropdown.Item as={NavLink} to="/historycart">
                      📦 Các đơn hàng của bạn
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="operation-icon px-3">
                <NavLink to="login">
                  <span className="operation-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </NavLink>
              </div>
              <div className="operation-icon px-3">
                <button>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenu isVisiable={visiable && isSmallerHeader} />
    </header>
  );
}
