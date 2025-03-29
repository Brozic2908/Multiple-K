import "./HomePage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SlideImage({ srcBg, srcLap, srcTitle }) {
	return (
		<a className='slide-image' href='' target='_blank'>
			<img src={srcBg} alt='bg' />
			<div className='background-slide'>
				<img className='background-slide-lap' src={srcLap} alt='laptop' />

				<img className='background-slide-title' src={srcTitle} alt='title' />
			</div>
		</a>
	);
}

export default function HomePage() {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
	};

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
		<div className='home-page'>
			<Slider {...settings}>
				{list_slide.map((slide, index) => (
					<SlideImage key={index} {...slide} />
				))}
			</Slider>
		</div>
	);
}
