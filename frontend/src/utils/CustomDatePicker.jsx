import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker({ selectedDate, onChange, placeholder }) {
	return (
		<>
			<div className='input-group mb-3'>
				<DatePicker
					selected={selectedDate}
					onChange={onChange}
					dateFormat='dd/MM/yyyy'
					className='form-control'
					isClearable
					placeholderText={placeholder}
				/>
			</div>
		</>
	);
}
