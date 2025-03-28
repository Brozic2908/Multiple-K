import { useState } from "react";
import "./Header.css";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faXmark,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";

export default function Header() {
	const [visiable, setVisiable] = useState(false);

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
			<nav className='shadow-sm nav-header'>
				<div className='header_container' style={{ height: 82.4 }}>
					<div className='main-area d-flex justify-content-between'>
						<div className='bar align-content-center'>
							<button className='p-3' onClick={handleVisiable}>
								{visiable ? (
									<FontAwesomeIcon icon={faXmark} />
								) : (
									<FontAwesomeIcon icon={faBars} />
								)}
							</button>
						</div>
						<div className='logo align-content-center'>
							<NavLink to='/'>
								<img
									src='https://storage-asset.msi.com/frontend/imgs/logo.png'
									alt='MSI  Logo'
									width='98.8'
									height='65'
								/>
							</NavLink>
						</div>
						<div className='main-area-menu'>
							<div className='nav-item'>
								<NavLink to='products'>Sản phẩm</NavLink>
							</div>
							<div className='nav-item'>
								<NavLink to='introduction'>Giới thiệu</NavLink>
							</div>
							<div className='nav-item'>
								<NavLink to='community'>Cộng đồng</NavLink>
							</div>
							<div className='nav-item'>
								<NavLink to='questions'>Hỏi/đáp</NavLink>
							</div>
							<div className='nav-item'>
								<NavLink to='contact'>Liên hệ</NavLink>
							</div>
						</div>

						<div className='menu-area-icon d-flex align-items-center'>
							<div className='operation-icon px-3'>
								<button>
									<FontAwesomeIcon icon={faUser} />
								</button>
							</div>
							<div className='operation-icon px-3'>
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
