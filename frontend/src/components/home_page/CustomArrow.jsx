import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export function NextArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#333",
				borderRadius: "50%",
				width: "40px",
				height: "40px",
				right: "10px",
				zIndex: 2,
			}}
			onClick={onClick}
		>
			<FaChevronRight color='white' />
		</div>
	);
}

export function PrevArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#333",
				borderRadius: "50%",
				width: "40px",
				height: "40px",
				left: "10px",
				zIndex: 2,
			}}
			onClick={onClick}
		>
			<FaChevronLeft color='white' />
		</div>
	);
}
