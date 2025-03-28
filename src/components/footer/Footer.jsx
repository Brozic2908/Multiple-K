import { useState } from "react";
import "./Footer.css";
import { useMediaQuery } from "react-responsive";

function FooterItem({ text, link, isSmaller }) {
	return (
		<li
			className={`py-3 ${
				isSmaller ? "footerSubMenuExpand" : "footerSubMenu-item"
			}`}
		>
			<a href='' className='' target='_self'>
				{text}
			</a>
		</li>
	);
}

export default function Footer() {
	const [visiable, setVisiable] = useState(Array(5).fill(false));
	const isSmallerFooter = useMediaQuery({ maxWidth: 996 });

	const handleOnChange = (pivot) => {
		const nextVisiable = visiable.slice();
		for (let i = 0; i < nextVisiable.length; i++) {
			nextVisiable[i] = i === pivot ? !nextVisiable[i] : false;
		}
		setVisiable(nextVisiable);
	};

	return (
		<footer>
			<nav className='footer-container'>
				<ul
					className={`footerMenu d-flex ${
						isSmallerFooter ? "flex-column" : "justify-content-between py-4"
					}`}
				>
					<li className='footerMenu-item'>
						{isSmallerFooter ? (
							<button
								className={`footerItem-button ${
									visiable[0] ? "footerItem-button--active" : ""
								}`}
								onClick={() => handleOnChange(0)}
							>
								CỘNG ĐỒNG
							</button>
						) : (
							<div className='footerItem-title'>CỘNG ĐỒNG</div>
						)}
						<ul
							className={`footerSubMenu ${
								visiable[0] || !isSmallerFooter ? "" : "none"
							}`}
						>
							<FooterItem text={"Tin tức từ MSI"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Blog"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Video"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Mạng xã hội"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Diễn đàn"} isSmaller={isSmallerFooter} />
						</ul>
					</li>
					<li className='footerMenu-item'>
						{isSmallerFooter ? (
							<button
								className={`footerItem-button ${
									visiable[1] ? "footerItem-button--active" : ""
								}`}
								onClick={() => handleOnChange(1)}
							>
								HỖ TRỢ
							</button>
						) : (
							<div className='footerItem-title'>HỖ TRỢ</div>
						)}
						<ul
							className={`footerSubMenu ${
								visiable[1] || !isSmallerFooter ? "" : "none"
							}`}
						>
							<FooterItem text={"Tải xuống"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Hỗ trợ từ xa"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Bảo hành"} isSmaller={isSmallerFooter} />
							<FooterItem
								text={"Địa chỉ trung tâm bảo hành"}
								isSmaller={isSmallerFooter}
							/>
						</ul>
					</li>
					<li className='footerMenu-item'>
						{isSmallerFooter ? (
							<button
								className={`footerItem-button ${
									visiable[2] ? "footerItem-button--active" : ""
								}`}
								onClick={() => handleOnChange(2)}
							>
								TIN TỨC
							</button>
						) : (
							<div className='footerItem-title'>TIN TỨC</div>
						)}
						<ul
							className={`footerSubMenu ${
								visiable[2] || !isSmallerFooter ? "" : "none"
							}`}
						>
							<FooterItem text={"Báo chí"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Giải thưởng"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Videos"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Tin tức"} isSmaller={isSmallerFooter} />
						</ul>
					</li>
					<li className='footerMenu-item'>
						{isSmallerFooter ? (
							<button
								className={`footerItem-button ${
									visiable[3] ? "footerItem-button--active" : ""
								}`}
								onClick={() => handleOnChange(3)}
							>
								TRUYỀN THÔNG
							</button>
						) : (
							<div className='footerItem-title'>TRUYỀN THÔNG</div>
						)}
						<ul
							className={`footerSubMenu ${
								visiable[3] || !isSmallerFooter ? "" : "none"
							}`}
						>
							<FooterItem text={"Tải xuống"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Hỗ trợ từ xa"} isSmaller={isSmallerFooter} />
							<FooterItem text={"Bảo hành"} isSmaller={isSmallerFooter} />
							<FooterItem
								text={"Thông tin cho nhà đầu tư"}
								isSmaller={isSmallerFooter}
							/>
						</ul>
					</li>
					<li className='footerMenu-item'>
						{isSmallerFooter ? (
							<button
								className={`footerItem-button ${
									visiable[4] ? "footerItem-button--active" : ""
								}`}
								onClick={() => handleOnChange(4)}
							>
								VỀ DOANH NGHIỆP
							</button>
						) : (
							<div className='footerItem-title'>VỀ DOANH NGHIỆP</div>
						)}
						<ul
							className={`footerSubMenu ${
								visiable[4] || !isSmallerFooter ? "" : "none"
							}`}
						>
							<FooterItem
								text={"Cẩm nang Sản phẩm"}
								isSmaller={isSmallerFooter}
							/>
							<FooterItem text={"Hình nền"} isSmaller={isSmallerFooter} />
							<FooterItem
								text={"Ứng dụng của MSI"}
								isSmaller={isSmallerFooter}
							/>
							<FooterItem
								text={"Tính công suất PSU"}
								isSmaller={isSmallerFooter}
							/>
						</ul>
					</li>
				</ul>
			</nav>
		</footer>
	);
}
