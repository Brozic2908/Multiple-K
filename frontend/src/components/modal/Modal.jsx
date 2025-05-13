import { useState, useEffect } from "react";

export function Modal({ initValue, onChange, onSave, title, placeholder }) {
	const [object, setObject] = useState(initValue);

	const handleChange = (event) => {
		if (initValue.email) {
			setObject((prev) => ({
				...prev,
				email: event.target.value,
			}));
		} else {
			setObject((prev) => ({
				...prev,
				phone_number: event.target.value,
			}));
		}
	};

	const handleSubmit = async () => {
		await onSave(object);
		onChange();
	};

	return (
		<div
			className='modal fade text-left show'
			id='inlineForm'
			tabIndex='-1'
			aria-labelledby='myModalLabel33'
			style={{ display: "block" }}
			role='dialog'
			aria-modal='true'
		>
			<div
				className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
				role='document'
			>
				<div className='modal-content'>
					<div className='modal-header'>
						<h4 className='modal-title' id='myModalLabel33'>
							Update {title}
						</h4>
						<button
							type='button'
							className='close'
							aria-label='Close'
							onClick={onChange}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='feather feather-x'
							>
								<line x1='18' y1='6' x2='6' y2='18'></line>
								<line x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
						</button>
					</div>
					<form action='#'>
						<div className='modal-body'>
							<label htmlFor={title.toLowerCase()}>{title}: </label>
							<div className='form-group'>
								<input
									id={title.toLowerCase()}
									type='text'
									placeholder={placeholder}
									className='form-control'
									value={object?.email ? object?.email : object?.phone_number}
									onChange={handleChange}
								/>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-light-secondary'
								onClick={onChange}
							>
								<i className='bx bx-x d-block d-sm-none'></i>
								<span className='d-none d-sm-block'>Cancel</span>
							</button>
							<button
								type='button'
								className='btn btn-primary ms-1'
								onClick={handleSubmit}
							>
								<i className='bx bx-check d-block d-sm-none'></i>
								<span className='d-none d-sm-block'>Save</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export function ModalContactForm({
	initValue,
	onClose,
	onSeen,
	onReponded,
	statusColors,
}) {
	const [object, setObject] = useState(initValue);

	const handleUpdateToSeen = () => {
		onSeen(object);
		onClose();
	};

	const handleUpdateToResponded = () => {
		onReponded(object);
		onClose();
	};

	return (
		<div
			className='modal fade text-left show'
			id='inlineForm'
			tabIndex='-1'
			aria-labelledby='myModalLabel33'
			style={{ display: "block" }}
			role='dialog'
			aria-modal='true'
		>
			<div
				className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
				role='document'
			>
				<div className='modal-content'>
					<div className='modal-header'>
						<h4 className='modal-title' id='myModalLabel33'>
							Contact Form Detail ID:{object.id}
						</h4>
						<button
							type='button'
							className='close'
							aria-label='Close'
							onClick={onClose}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='feather feather-x'
							>
								<line x1='18' y1='6' x2='6' y2='18'></line>
								<line x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
						</button>
					</div>
					<div className='modal-body'>
						<p>
							<strong>Full Name:</strong> {object.name}
						</p>
						<p>
							<strong>Email Address:</strong> {object.email}
						</p>
						<p>
							<strong>Phone Number:</strong> {object.phone_number}
						</p>
						<p className='text-wrap'>
							<strong>Content:</strong> {object.content}
						</p>
						<p>
							<strong>Status:</strong>{" "}
							<span className={`btn btn-sm btn-${statusColors[object.status]}`}>
								{object.status.toUpperCase()}
							</span>
						</p>
						<p>
							<strong>Send At:</strong> {object.created_at}
						</p>
					</div>
					<div className='modal-footer'>
						{object.status === "received" ? (
							<>
								<button
									type='button'
									className='btn btn-primary'
									onClick={handleUpdateToSeen}
								>
									<i className='bx bx-x d-block d-sm-none'></i>
									<span className='d-none d-sm-block'>Seen</span>
								</button>
								<button
									type='button'
									className='btn btn-success ms-1'
									onClick={handleUpdateToResponded}
								>
									<i className='bx bx-check d-block d-sm-none'></i>
									<span className='d-none d-sm-block'>Response</span>
								</button>
							</>
						) : object.status === "seen" ? (
							<>
								<button
									type='button'
									className='btn btn-success ms-1'
									onClick={handleUpdateToResponded}
								>
									<i className='bx bx-check d-block d-sm-none'></i>
									<span className='d-none d-sm-block'>Response</span>
								</button>
							</>
						) : (
							<>
								<p className='text-center'>
									<i>
										<b>This form contact is responded</b>
									</i>
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ModalOrder({ initValue, onClose, onUpdate }) {
	const [object, setObject] = useState(initValue);

	const handleChangeObject = (event) => {
		setObject({ ...object, status: event.target.value });
	};

	const handleUpdate = () => {
		onUpdate(object);
		onClose();
	};
	console.log(object);
	return (
		<div
			className='modal fade text-left show'
			id='inlineForm'
			tabIndex='-1'
			aria-labelledby='myModalLabel33'
			style={{ display: "block" }}
			role='dialog'
			aria-modal='true'
		>
			<div
				className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
				role='document'
			>
				<div className='modal-content'>
					<div className='modal-header'>
						<h4 className='modal-title' id='myModalLabel33'>
							Order #ID: {object.id}
						</h4>
						<button
							type='button'
							className='close'
							aria-label='Close'
							onClick={onClose}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='feather feather-x'
							>
								<line x1='18' y1='6' x2='6' y2='18'></line>
								<line x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
						</button>
					</div>
					<div className='modal-body'>
						<p className='fs-4'>
							<strong>Status</strong>:{" "}
						</p>
						<div className='input-group'>
							<select
								className='form-select'
								value={object.status}
								onChange={handleChangeObject}
							>
								<option value=''>Choose a status...</option>
								<option value='ordered'>Ordered</option>
								<option value='shipping'>Shipping</option>
								<option value='delivered'>Delivered</option>
							</select>
						</div>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-light-secondary'
							onClick={onClose}
						>
							<i className='bx bx-x d-block d-sm-none'></i>
							<span className='d-none d-sm-block'>Cancel</span>
						</button>
						<button
							type='button'
							className='btn btn-primary ms-1'
							onClick={handleUpdate}
						>
							<i className='bx bx-check d-block d-sm-none'></i>
							<span className='d-none d-sm-block'>Update</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ConfirmModal({ id, onClose, onDelete, title, label }) {
	const handleDelete = () => {
		onDelete(id);
		onClose();
	};
	return (
		<div
			className='modal fade text-left show'
			id='inlineForm'
			tabIndex='-1'
			aria-labelledby='myModalLabel33'
			style={{ display: "block" }}
			role='dialog'
			aria-modal='true'
		>
			<div
				className='modal-dialog modal-dialog-centered modal-dialog-scrollable'
				role='document'
			>
				<div className='modal-content'>
					<div className='modal-header'>
						<p style={{ visibility: "hidden" }}>
							Tôi.
						</p>
						<h4 className='modal-title text-center' id='myModalLabel33'>
							{title}
						</h4>
						<button
							type='button'
							className='close'
							aria-label='Close'
							onClick={onClose}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='feather feather-x'
							>
								<line x1='18' y1='6' x2='6' y2='18'></line>
								<line x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
						</button>
					</div>
					<div className='modal-body'>
						<p className='text-center'>{label}</p>
					</div>
					<div className='modal-footer justify-content-center'>
						<button
							type='button'
							className='btn btn-light-secondary'
							onClick={onClose}
						>
							<i className='bx bx-x d-block d-sm-none'></i>
							<span className='d-none d-sm-block'>Cancel</span>
						</button>
						<button
							type='button'
							className='btn btn-primary ms-1'
							onClick={handleDelete}
						>
							<i className='bx bx-check d-block d-sm-none'></i>
							<span className='d-none d-sm-block'>Confirm</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
