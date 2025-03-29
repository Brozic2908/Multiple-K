import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { CommunityDetailPage } from "./components/community_page/CommunityDetailPage.jsx";
import CommunityPage from "./components/community_page/CommunityPage.jsx";
import ContactPage from "./components/contact_page/ContactPage.jsx";
import HomePage from "./components/home_page/HomePage.jsx";
import IntroPage from "./components/intro_page/IntroPage.jsx";

import ProductPage from "./components/Product/Product.jsx";
import ProductDetail from "./components/Product/ProductDetail.jsx";

import QuestionPage from "./components/question_page/questionPage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProductList from "./components/Product/ProductList.jsx";
import ProductUpload from "./components/Product/ProductUpload.jsx";
function App() {
	return (
		<BrowserRouter>
			
			<Routes>
				<Route path='/' element={<UserLayout/>}>
					<Route path='/' element={<HomePage />} />
					<Route path='/contact' element={<ContactPage />} />
					<Route path='/products' element={<ProductPage />} />

					<Route path='/products/detail' element={<ProductDetail />} />

					<Route path="/introduction" element={<IntroPage />} />

					<Route path="/community" element={<CommunityPage />} />
					<Route path="/community/:id" element={<CommunityDetailPage />} />

					<Route path="/questions" element={<QuestionPage/>} />
				</Route>
				<Route path='/admin' element={<AdminLayout/>}>
					<Route path='/admin/products/list' element={<ProductList />} />
					<Route path='/admin/products/upload' element={<ProductUpload />} />
				</Route>
			</Routes>
			
		</BrowserRouter>
	);
}

export default App;
