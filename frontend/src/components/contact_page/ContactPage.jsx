import "./ContactPage.css";

function ContactItem({ img, title, describe }) {
	return (
		<li className='contact-item-container'>
			<div className='contact-item-img'>
				<img src='' alt='' />
			</div>
		</li>
	);
}

export default function ContactPage() {
	return (
		<div className='contact-page'>
			<div className='contact-title'>
				<h2 className='mb-2 text-center fw-bold'>Liên Hệ Hỗ Trợ</h2>
				<p className='mb-2 text-center'>
					Cảm ơn bạn đã chọn MK. Xin vui lòng liên hệ với chúng tôi qua các kênh
					dưới đây, chúng tôi rất vui khi được giúp đỡ.
				</p>
			</div>

			<div className='contact-content'>
				<ul className='d-flex flex-wrap'>
					<li className='contact-item col-4'>
						<div className='item-container text-center'>
							<div className='item-img p-2'>
								<img src='/contact-images/hotline.png' alt='' />
							</div>
							<div className='item-theme p-4'>
								<p className='item-theme-title fw-bold fs-5'>Đường dây nóng</p>
								<div className='item-theme-content'>
									<p>
										Hotline 1: <span className='fw-bold'>1900189231</span>
									</p>
									<p>
										Hotline 2: <span className='fw-bold'>1900189123</span>
									</p>
								</div>
							</div>
						</div>
					</li>
					<li className='contact-item col-4'>
						<a className='item-container text-center'>
							<div className='item-img p-2'>
								<img src='/contact-images/question.png' alt='' />
							</div>
							<div className='item-theme p-4'>
								<p className='item-theme-title fw-bold fs-5'>
									Câu hỏi trực tuyến
								</p>
								<div className='item-theme-content'>
									<p>Đặt một câu hỏi</p>
								</div>
							</div>
						</a>
					</li>
					<li className='contact-item col-4'>
						<div className='item-container text-center'>
							<div className='item-img p-2'>
								<img src='/contact-images/hotline.png' alt='' />
							</div>
							<div className='item-theme p-4'>
								<p className='item-theme-title fw-bold fs-5'>Email</p>
								<div className='item-theme-content'>
									<p>
										Email 1: <span className='fw-bold'>abc@gmail.com</span>
									</p>
									<p>
										Email 2: <span className='fw-bold'>xyz@gmail.com</span>
									</p>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
}
