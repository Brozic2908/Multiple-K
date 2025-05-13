import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import useFetchData from "../../utils/useFetchData";
import { useState, useEffect } from "react";
import { api } from "../../services";
import { format } from "date-fns";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import CustomDatePicker from "../../utils/CustomDatePicker";
import { Modal, ModalContactForm, ConfirmModal } from "../modal/Modal";

function ContactEmail() {
	const { isLoading, error, data } = useFetchData("/contact-email");
	const [emails, setEmails] = useState(null);
	const [isShowModal, setIsShowModal] = useState(false);
	const [selectedOject, setSelectedObject] = useState();

	useEffect(() => {
		if (data) {
			setEmails(data);
		}
	}, [data]);

	const handleModal = (datum) => {
		setIsShowModal(true);
		setSelectedObject(datum);
	};

	const handleUpdate = async (object) => {
		setEmails((prev) =>
			prev.map((email) =>
				email.id === object.id ? { ...email, email: object.email } : email
			)
		);
		try {
			const response = await api.put("/contact-email", object);
			console.log(response.data);
			alert("Update Success");
		} catch (error) {
			alert("Update Fail");
		}
	};

	return (
		<>
			<div>
				<h2 className='fw-medium fs-3'>Email Address Management</h2>
			</div>

			<div className='table-responsive'>
				{isLoading ? (
					<p>loading... </p>
				) : error ? (
					<p>An error occurred while fetching data</p>
				) : (
					emails && (
						<table className='table table-striped table-bordered table-hover'>
							<thead className='table-primary'>
								<tr>
									<th>#</th>
									<th>Email Address</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{emails.map((datum, idx) => (
									<tr key={datum.id}>
										<td>{idx + 1}</td>
										<td>{datum.email}</td>
										<td>
											<div className='d-flex gap-2'>
												<button
													type='button'
													className='btn btn-light btn-sm'
													onClick={() => handleModal(datum)}
												>
													<FaEdit className='text-success' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				)}
			</div>

			{isShowModal && (
				<Modal
					initValue={selectedOject}
					onChange={() => setIsShowModal(false)}
					onSave={handleUpdate}
					title='Email'
					placeholder='Email Address'
				/>
			)}
		</>
	);
}

function ContactPhone() {
	const { isLoading, error, data } = useFetchData("/contact-phone");
	const [phoneNumbers, setPhoneNumbers] = useState(null);
	const [isShowModal, setIsShowModal] = useState(false);
	const [selectedOject, setSelectedObject] = useState();

	useEffect(() => {
		if (data) {
			setPhoneNumbers(data);
		}
	}, [data]);

	const handleUpdate = async (object) => {
		setPhoneNumbers((prev) =>
			prev.map((phoneNumber) =>
				phoneNumber.id === object.id
					? { ...phoneNumber, phone_number: object.phone_number }
					: phoneNumber
			)
		);
		try {
			const response = await api.put("/contact-phone", object);
			console.log(response.data);
			alert("Update Success");
		} catch (error) {
			alert("Update Fail");
		}
	};

	const handleModal = (datum) => {
		setIsShowModal(true);
		setSelectedObject(datum);
	};

	return (
		<>
			<div>
				<h2 className='fw-medium fs-3'>Phone Number Management</h2>
			</div>
			<div className='table-responsive'>
				{isLoading ? (
					<p>loading ...</p>
				) : error ? (
					<p>An error occurred while fetching data</p>
				) : (
					phoneNumbers && (
						<table className='table table-striped table-bordered table-hover'>
							<thead className='table-primary'>
								<tr>
									<th>#</th>
									<th>Phone Number</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{phoneNumbers.map((datum, idx) => (
									<tr key={datum.id}>
										<td>{idx + 1}</td>
										<td>{datum.phone_number}</td>
										<td>
											<div className='d-flex gap-2'>
												<button
													type='button'
													className='btn btn-light btn-sm'
													onClick={() => handleModal(datum)}
												>
													<FaEdit className='text-success' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				)}
			</div>
			{isShowModal && (
				<Modal
					initValue={selectedOject}
					onChange={() => setIsShowModal(false)}
					onSave={handleUpdate}
					title='Phone Number'
					placeholder='Phone Number'
				/>
			)}
		</>
	);
}

function ContactForm() {
	const statusColors = {
		received: "secondary", // xám nhạt
		seen: "primary", // xanh dương nhạt
		responded: "success", // xanh lá cây
	};
	const { isLoading, error, data } = useFetchData("/contact-form");
	const [forms, setForms] = useState([]);
	const [isShowModal, setIsShowModal] = useState(false);
	const [selectedForm, setSelectedForm] = useState(null);
	//filter
	const [filterForm, setFilterForm] = useState([]);
	const [filterStatus, setFilterStatus] = useState("");
	const [filterDate, setFilterDate] = useState(null);
	//sort
	const [sortOrder, setSortOrder] = useState("desc"); // "asc" || "desc"
	//paginatation
	const [currentPage, setCurrentPage] = useState(1);
	const limitItem = 3;
	//
	const [isConfirmModal, setIsConfirmModal] = useState(false);

	useEffect(() => {
		if (data) {
			setForms(data);
			setFilterForm(data);
		}
	}, [data]);

	useEffect(() => {
		if (forms) {
			const filterFormNew = forms.filter((form) => {
				const matchStatus = filterStatus ? form.status === filterStatus : true;
				const matchDate = filterDate
					? new Date(form.created_at).toDateString() ===
					  filterDate.toDateString()
					: true;
				return matchStatus && matchDate;
			});

			filterFormNew.sort((a, b) => {
				const dateA = new Date(a.created_at).getTime();
				const dateB = new Date(b.created_at).getTime();
				return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
			});
			setFilterForm(filterFormNew);
			setCurrentPage(1);
		}
	}, [filterDate, filterStatus, forms, sortOrder]);

	const toggleSortOrder = () => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
	};

	//logic paginate
	const totalPages = Math.ceil(filterForm.length / limitItem);
	const startIndex = (currentPage - 1) * limitItem;
	const paginateForm = filterForm.slice(startIndex, startIndex + limitItem);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleClearFilter = () => {
		setFilterStatus("");
		setFilterDate(null);
	};

	const handleView = (form) => {
		setIsShowModal(true);
		setSelectedForm(form);
	};

	const updateToSeen = async (object) => {
		try {
			const response = await api.put("/contact-form", {
				id: object.id,
				status: "seen",
			});
			alert("Update successfully!!");
		} catch (error) {
			console.error(error);
			alert("Update fail!!");
		} finally {
			setForms((prev) =>
				prev.map((form) =>
					form.id === object.id ? { ...form, status: "seen" } : form
				)
			);
		}
	};

	const updateToResponded = async (object) => {
		try {
			const response = await api.put("/contact-form", {
				id: object.id,
				status: "responded",
			});
			alert("Update successfully!!");
		} catch (error) {
			console.error(error);
			alert("Update fail!!");
		} finally {
			setForms((prev) =>
				prev.map((form) =>
					form.id === object.id ? { ...form, status: "responded" } : form
				)
			);
		}
	};

	const handleShowConfirmModal = (object) => {
		setIsConfirmModal(true);
		setSelectedForm(object);
	};

	const handleDeleteForm = async (id) => {
		console.log(id);
		try {
			const response = await api.delete(`/contact-form/${id}`);
			alert("Delete successfully!");
		} catch (error) {
			console.error(error);
			alert("Delete Fail!!");
		} finally {
			setForms((prev) => prev.filter((item) => item.id !== id));
		}
	};

	return (
		<>
			<div className='mb-3'>
				<h2 className='text-center'>Contact Form Management</h2>
			</div>
			<div className='row justify-content-center'>
				<div className='col-6 col-md-3'>
					<div className='input-group mb-3'>
						<label className='input-group-text'>Options</label>
						<select
							className='form-select'
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							defaultValue=''
						>
							<option value=''>Choose a status...</option>
							<option value='received'>Received</option>
							<option value='seen'>Seen</option>
							<option value='responded'>Responded</option>
						</select>
					</div>
				</div>
				<div className='col-4 col-md-2'>
					<CustomDatePicker
						selectedDate={filterDate}
						onChange={setFilterDate}
						placeholder='Choose a date ...'
					/>
				</div>
				<div className='col-2 col-md-1'>
					<div className='input-group mb-3'>
						<button
							className='btn btn-outline-primary'
							onClick={handleClearFilter}
						>
							Clear
						</button>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-12'>
					<div className='table-responsive'>
						{isLoading ? (
							<p>loading ...</p>
						) : error ? (
							<p>An error occurred while fetching data</p>
						) : (
							paginateForm && (
								<table className='table table-bordered table-hover'>
									<thead className='table-primary'>
										<tr>
											<th>#</th>
											<th>Full Name</th>
											<th>Email Address</th>
											<th>Phone Number</th>
											<th>Status</th>
											<th onClick={toggleSortOrder}>Send At</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{paginateForm.map((form, idx) => (
											<tr key={form.id}>
												<td>{idx + startIndex + 1}</td>
												<td>{form.name}</td>
												<td>{form.email}</td>
												<td>{form.phone_number}</td>
												<td>
													<p
														className={`btn btn-sm btn-${
															statusColors[form.status]
														}`}
													>
														{form.status.toUpperCase()}
													</p>
												</td>
												<td>
													{format(new Date(form.created_at), "dd/MM/yyyy")}
												</td>
												<td>
													<div className='d-flex gap-2'>
														<OverlayTrigger
															placement='top'
															overlay={<Tooltip>update status</Tooltip>}
														>
															<button
																type='button'
																className='btn btn-light btn-sm'
																onClick={() => handleView(form)}
															>
																<FaEdit className='text-warning' />
															</button>
														</OverlayTrigger>
														<OverlayTrigger
															placement='top'
															overlay={<Tooltip>delete</Tooltip>}
														>
															<button
																type='button'
																className='btn btn-light btn-sm'
																onClick={() => handleShowConfirmModal(form)}
															>
																<FaTrash className='text-danger' />
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
				<ModalContactForm
					initValue={selectedForm}
					onClose={() => setIsShowModal(false)}
					onSeen={updateToSeen}
					onReponded={updateToResponded}
					statusColors={statusColors}
				/>
			)}

			{isConfirmModal && (
				<ConfirmModal
					id={selectedForm.id}
					onClose={() => setIsConfirmModal(false)}
					onDelete={handleDeleteForm}
					title={"Confirm Form"}
					label={"Are you sure you want to delete this form?"}
				/>
			)}
		</>
	);
}

export default function ContactPageAdmin() {
	return (
		<div className='p-4'>
			<h1 className='fw-bold mb-4 text-center'>Contact Page Management</h1>

			<div className='row g-5 mb-5 mt-4'>
				<div className='col-md-6'>
					<ContactEmail />
				</div>
				<div className='col-md-6'>
					<ContactPhone />
				</div>
			</div>

			<div className='row mt-5'>
				<div className='col-12'>
					<ContactForm />
				</div>
			</div>
		</div>
	);
}
