// layouts/UserLayout.jsx
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function UserLayout() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token || !isTokenValid(token)) {
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default UserLayout;
