import "./MobileMenu.css";
import { Link } from "react-router-dom";

export default function MobileMenu({ isVisiable, offVisual }) {
  return (
    <ul className={`mobile-menu ${isVisiable ? "show" : ""}`}>
      <li className="mobile-menu_item">
        <div className="mobile-item_container" onClick={offVisual}>
          <Link to="products">Sản phẩm</Link>
        </div>
      </li>

      <li className="mobile-menu_item">
        <div className="mobile-item_container" onClick={offVisual}>
          <Link to="introduction">Giới thiệu</Link>
        </div>
      </li>

      <li className="mobile-menu_item">
        <div className="mobile-item_container" onClick={offVisual}>
          <Link to="community">Cộng đồng</Link>
        </div>
      </li>

      <li className="mobile-menu_item">
        <div className="mobile-item_container" onClick={offVisual}>
          <Link to="question">Hỏi/đáp</Link>
        </div>
      </li>

      <li className="mobile-menu_item">
        <div className="mobile-item_container" onClick={offVisual}>
          <Link to="contact">Liên hệ</Link>
        </div>
      </li>
    </ul>
  );
}
