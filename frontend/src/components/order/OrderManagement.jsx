import { use, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CustomDatePicker from "../../utils/CustomDatePicker";
import useFetchData from "../../utils/useFetchData";
import {
	FaEdit,
	FaEye,
	FaUser,
	FaArrowLeft,
	FaEnvelope,
	FaPhone,
	FaMapMarkedAlt,
	FaHashtag,
	FaCalendarDay,
	FaMoneyBill,
	FaTasks,
} from "react-icons/fa";
import { ModalOrder } from "../modal/Modal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import api from "../../services/api";

export function OrderDetail() {
	const { id } = useParams();
	const {
		isLoading: loadingOrderItem,
		error: errorOrderItem,
		data: orderItem,
	} = useFetchData(`/orders/items/${id}`);
	const {
		isLoading: loadingOrder,
		error: errorOrder,
		data: order,
	} = useFetchData(`/orders/${id}`);

	const [totalPrice, setTotalPrice] = useState(0);

	useEffect(() => {
		if (orderItem) {
			const newTotalPrice = orderItem.reduce((prev, cur) => {
				return prev + cur.quantity * cur.price_at_order;
			}, 0);
			setTotalPrice(newTotalPrice);
		}
	}, [orderItem]);

	return (
		<div className='container pb-4'>
			{/* title */}
			<div className='row mb-4'>
				<div className='col-12 border-bottom'>
					<h1 className='text-center mb-3'>Order Detail</h1>
				</div>
			</div>

			{loadingOrder ? (
				<p>Loading...</p>
			) : errorOrder ? (
				<p>Error while fecth data</p>
			) : (
				order && (
					<>
						<div className='row justify-content-center mt-4'>
							<div className='col-8 border rounded-1'>
								<div className='row border-bottom'>
									<div className='col-12 bg-light-secondary py-2'>
										<p className='mb-0 fs-5 fw-semibold'>Order Infomation</p>
									</div>
								</div>
								<div className='row'>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaHashtag className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.id}</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaTasks className='fs-5 me-2' />{" "}
											<span className='fw-semibold'>
												{" "}
												{order.status.toUpperCase()}
											</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaCalendarDay className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.order_at}</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaMoneyBill className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {totalPrice}</span>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* user info */}
						<div className='row justify-content-center mt-4'>
							<div className='col-8 border rounded-1'>
								<div className='row border-bottom'>
									<div className='col-12 bg-light-secondary py-2'>
										<p className='mb-0 fs-5 fw-semibold'>Customer Infomation</p>
									</div>
								</div>
								<div className='row'>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaUser className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.first_name + " " + order.last_name}</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaEnvelope className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.email}</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaPhone className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.phone_number}</span>
										</p>
									</div>
									<div className='col-12 col-md-6 p-4'>
										<p className='text-start mb-0 ms-5'>
											<FaMapMarkedAlt className='fs-5 me-2' />{" "}
											<span className='fw-semibold'> {order.region}</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</>
				)
			)}
			{/* order info */}

			{/* order item */}
			<div className='row justify-content-center mt-4'>
				<div className='col-8 border rounded-1'>
					<div className='row border-bottom'>
						<div className='col-12 bg-light-secondary py-2'>
							<p className='mb-0 fs-5 fw-semibold'>Order Item</p>
						</div>
					</div>
					<div className='row'>
						<div className='col-12 p-4'>
							<div className='table-responsive'>
								{loadingOrderItem ? (
									<p>Loading...</p>
								) : errorOrderItem ? (
									<p>Error while fetching data</p>
								) : (
									orderItem && (
										<table className='table table-bordered table-hover'>
											<thead className='table-primary'>
												<tr>
													<th>#</th>
													<th>Product Name</th>
													<th>Quantity</th>
													<th>Price Per Unit</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												{orderItem.map((item, idx) => (
													<tr key={item.id}>
														<td>{idx + 1}</td>
														<td>{item.name}</td>
														<td>{item.quantity}</td>
														<td>{item.price_at_order}</td>
														<td>{item.quantity * item.price_at_order}</td>
													</tr>
												))}
											</tbody>
										</table>
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='row mt-3'>
				<div className='col-12'>
					<Link className='text-end d-block' to='/admin/orders'>
						<FaArrowLeft className='me-2' />
						Back to order management page
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function OrderManagement() {
	const statusColors = {
		ordered: "info",
		shipping: "warning",
		delivered: "success",
	};
	const { isLoading, error, data } = useFetchData("/orders");

	const [orders, setOrders] = useState([]);
	const [filterOrder, setFilterOrder] = useState([]);
	const [filterStatus, setFilterStatus] = useState("");
	const [search, setSearch] = useState("");
	const [filterStartDate, setFilterStartDate] = useState(null);
	const [filterEndDate, setFilterEndDate] = useState(null);
	//sort
	const [sortOrder, setSortOrder] = useState("desc"); // "asc" || "desc"
	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const limitItem = 3;
	//modal
	const [isShowModal, setIsShowModal] = useState(false);
	const [orderSelected, setOrderSelected] = useState(null);
	//navigate
	const navigate = useNavigate();

	//get first data
	useEffect(() => {
		if (data) {
			setOrders(data);
			setFilterOrder(data);
			setCurrentPage(1);
		}
	}, [data]);

	//filter data
	useEffect(() => {
		if (orders) {
			const newFilterOrder = orders.filter((order) => {
				const searchMatch = order.email
					.toLowerCase()
					.includes(search.toLowerCase());
				const statusMatch = filterStatus ? order.status === filterStatus : true;
				const startDateMatch = filterStartDate
					? new Date(order.order_at).getTime() >=
					  new Date(filterStartDate).getTime()
					: true;
				const endDateMatch = filterEndDate
					? new Date(order.order_at).getTime() <=
					  new Date(filterEndDate).getTime()
					: true;

				return searchMatch && statusMatch && startDateMatch && endDateMatch;
			});

			newFilterOrder.sort((a, b) => {
				const dateA = new Date(a.order_at).getTime();
				const dateB = new Date(b.order_at).getTime();
				return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
			});

			setFilterOrder(newFilterOrder);
			setCurrentPage(1);
		}
	}, [orders, filterEndDate, filterStartDate, search, filterStatus, sortOrder]);

	const totalPages = Math.ceil(filterOrder.length / limitItem);
	const startIndex = (currentPage - 1) * limitItem;
	const paginateForm = filterOrder.slice(startIndex, startIndex + limitItem);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const toggleSortOrder = () => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
	};

	const handleClearFilter = () => {
		setFilterEndDate(null);
		setFilterStartDate(null);
		setFilterStatus("");
		setSearch("");
	};

	const handleViewDetail = (id) => {
		const url = `/admin/orders/${id}`;
		navigate(url);
	};

	const showEditModal = (object) => {
		setOrderSelected(object);
		setIsShowModal(true);
	};

	const handleChangeStatus = async (object) => {
		console.log(object);
		try {
			const response = await api.put("/orders", {
				id: object.id,
				status: object.status,
			});
			alert("Update successfully!!");
		} catch (error) {
			console.error(error);
			alert("Update fail!!");
		} finally {
			setOrders((prev) =>
				prev.map((order) =>
					order.id === object.id ? { ...order, status: object.status } : order
				)
			);
		}
	};

	return (
		<div className='container'>
			<div className='title mb-5'>
				<h1 className='text-center fw-bold'>Order Management</h1>
			</div>
			{/* filter */}
			<div className='row justify-content-center mb-3'>
				<div className='col-6 col-md-5'>
					<div className='input-group'>
						<input
							className='form-control'
							placeholder='Search by customer name...'
							type='text'
							onChange={(e) => setSearch(e.target.value)}
						/>
						<span className='input-group-text'>
							<svg
								stroke='currentColor'
								fill='currentColor'
								strokeWidth='0'
								viewBox='0 0 512 512'
								height='1em'
								width='1em'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'></path>
							</svg>
						</span>
					</div>
				</div>
				<div className='col-6 col-md-2'>
					<div className='input-group mb-3'>
						<select
							className='form-select'
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							defaultValue=''
						>
							<option value=''>Choose a status...</option>
							<option value='ordered'>Ordered</option>
							<option value='shipping'>Shipping</option>
							<option value='delivered'>Delivered</option>
						</select>
					</div>
				</div>
				<div className='col-5 col-md-2'>
					<CustomDatePicker
						selectedDate={filterStartDate}
						onChange={setFilterStartDate}
						placeholder='Choose start date'
					/>
				</div>
				<div className='col-5 col-md-2'>
					<CustomDatePicker
						selectedDate={filterEndDate}
						onChange={setFilterEndDate}
						placeholder='Choose end date'
					/>
				</div>
				<div className='col-2 col-md-1'>
					<div className='input-group mb-3'>
						<button
							className='btn btn-outline-danger'
							onClick={handleClearFilter}
						>
							Clear
						</button>
					</div>
				</div>
			</div>

			{/* table */}
			<div className='row'>
				<div className='col-12'>
					<div className='table-responsive'>
						{isLoading ? (
							<p>Loading...</p>
						) : error ? (
							<p>Error while fetching data</p>
						) : (
							paginateForm && (
								<table className='table table-bordered table-hover'>
									<thead className='table-primary'>
										<tr>
											<th>#</th>
											<th>Order Id</th>
											<th>Email Of Customer</th>
											<th>Order Status</th>
											<th>Total Price</th>
											<th onClick={toggleSortOrder}>Order At</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{paginateForm.map((order, idx) => (
											<tr key={order.id}>
												<td>{idx + startIndex + 1}</td>
												<td>{order.id}</td>
												<td>{order.email}</td>
												<td>
													<p
														className={`btn btn-sm btn-${
															statusColors[order.status]
														}`}
													>
														{order.status.toUpperCase()}
													</p>
												</td>
												<td>{order.totalPrice}</td>
												<td>{order.order_at.toLocaleString()}</td>
												<td>
													<div className='d-flex gap-2'>
														<OverlayTrigger
															placement='top'
															overlay={<Tooltip>view detail</Tooltip>}
														>
															<button
																type='button'
																className='btn btn-light btn-sm'
																onClick={() => handleViewDetail(order.id)}
															>
																<FaEye className='text-primary' />
															</button>
														</OverlayTrigger>
														<OverlayTrigger
															placement='top'
															overlay={<Tooltip>update status</Tooltip>}
														>
															<button
																type='button'
																className='btn btn-light btn-sm'
																onClick={() => showEditModal(order)}
															>
																<FaEdit className='text-warning' />
															</button>
														</OverlayTrigger>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)
						)}
					</div>
				</div>
			</div>
			{/* {pagination} */}
			<div className='row mt-3'>
				<div className='col-12 d-flex justify-content-center'>
					<ul className='pagination pagination-primary'>
						<li className='page-item'>
							<button
								className='page-link'
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
							>
								Prev
							</button>
						</li>
						{Array.from({ length: totalPages }, (_, idx) => (
							<li
								key={idx + 1}
								className={`page-item ${
									currentPage === idx + 1 ? "active" : ""
								}`}
							>
								<button
									className='page-link'
									onClick={() => handlePageChange(idx + 1)}
								>
									{idx + 1}
								</button>
							</li>
						))}
						<li className='page-item'>
							<button
								className='page-link'
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								Next
							</button>
						</li>
					</ul>
				</div>
			</div>

			{isShowModal && (
				<ModalOrder
					initValue={orderSelected}
					onClose={() => setIsShowModal(false)}
					onUpdate={handleChangeStatus}
				/>
			)}
		</div>
	);
}
