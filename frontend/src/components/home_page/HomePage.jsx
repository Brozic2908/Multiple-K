import style from "./HomePage.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Card, Carousel, Nav } from "react-bootstrap";
import { NextArrow, PrevArrow } from "./CustomArrow";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
function SlideImage({ srcBg, srcLap, srcTitle }) {
	return (
		<a className={style.slideImage} href='' target='_blank'>
			<img src={srcBg} alt='bg' />
			<div className={style.backgroundSlide}>
				<img className={style.backgroundSlideLap} src={srcLap} alt='laptop' />

				<img
					className={style.backgroundSlideTitle}
					src={srcTitle}
					alt='title'
				/>
			</div>
		</a>
	);
}

function NewestLap({products}) {
		return (
		<Row xs={2} xl={4} className='g-4'>
			{products.map((product, idx) => (
				<Col key={idx}>
					<NavLink to={`/products/detail/${product.id}`} className='text-decoration-none'>
					<Card as='a' href='#' className={`${style.customCard} card`}>
						<Card.Img
							variant='top'
							src={product.images[0].base64}
						/>
						<Card.Body style={{ minHeight: 100 }}>
							<Card.Title className='text-center'>Card title</Card.Title>
							<Card.Text
								style={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								This is a longer card with supporting text below as a natural
								lead-in to additional content. This content is a little bit
								longer.
							</Card.Text>
						</Card.Body>
					</Card>
					</NavLink>
				</Col>
			))}
		</Row>
	);
}

export default function HomePage() {
	const [products, setProducts] = useState([]);
	const token = localStorage.getItem("token");
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};
	const fetchProducts = async() => {
		try {
			const res = await axios.get("http://localhost/web-hk242/backend/products/1/8"
			  , { headers: { "Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			  }, }
			);
			setProducts(res.data.data || []);
		  } catch (err) {
			console.error("Fetch failed:", err);
		  }
	};
	useEffect(() => {
		fetchProducts();
	}, []);
	
	const list_slide = [
		{
			srcBg: "/images/kv-lg.jpg",
			srcLap: "/images/kv-Crosshair-15-B12U.png",
			srcTitle: "/images/kv-Crosshair-15.png",
		},
		{
			srcBg: "/images/kv-bg-xs.jpg",
			srcLap: "/images/kv-pd.png",
			srcTitle: "/images/kv-name.png",
		},
		{
			srcBg: "/images/kv-top-bg.jpg",
			srcLap: "/images/kv-nb.png",
			srcTitle: "/images/kv-titan-18-hx-name.png",
		},
	];
	return (
		<div className={style.homePage}>
			<div className={style.hpSection1}>
				<Slider {...settings}>
					{list_slide.map((slide, index) => (
						<SlideImage key={index} {...slide} />
					))}
				</Slider>
			</div>
			<div className={style.hpSection2}>
				<div className={`${style.titleSection2} `}>
					<h1 className='text-center fw-bold'>Những Mẫu Laptop Mới Nhất</h1>
				</div>
				<div className={style.contentSection2}>
					{products.length > 0 ? (
							<NewestLap products={products} />
						) : (
							<p>Loading...</p>
						)}
				</div>
			</div>
		</div>
	);
}
