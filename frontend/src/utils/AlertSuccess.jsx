export default function AlertSuccess({ content }) {
	return (
		<div
			class='swal2-container swal2-center swal2-backdrop-show'
			style='overflow-y: auto;'
		>
			<div
				aria-labelledby='swal2-title'
				aria-describedby='swal2-html-container'
				class='swal2-popup swal2-modal swal2-icon-success swal2-show'
				tabindex='-1'
				role='dialog'
				aria-live='assertive'
				aria-modal='true'
				style='display: grid;'
			>
				<button
					type='button'
					class='swal2-close'
					aria-label='Close this dialog'
					style='display: none;'
				>
					×
				</button>
				<ul class='swal2-progress-steps' style='display: none;'></ul>
				<div
					class='swal2-icon swal2-success swal2-icon-show'
					style='display: flex;'
				>
					<div
						class='swal2-success-circular-line-left'
						style='background-color: rgb(255, 255, 255);'
					></div>
					<span class='swal2-success-line-tip'></span>{" "}
					<span class='swal2-success-line-long'></span>
					<div class='swal2-success-ring'></div>{" "}
					<div
						class='swal2-success-fix'
						style='background-color: rgb(255, 255, 255);'
					></div>
					<div
						class='swal2-success-circular-line-right'
						style='background-color: rgb(255, 255, 255);'
					></div>
				</div>
				<img class='swal2-image' style='display: none;' />
				<h2 class='swal2-title' id='swal2-title' style='display: block;'>
					{content}
				</h2>
				<div
					class='swal2-html-container'
					id='swal2-html-container'
					style='display: none;'
				></div>
				<input id='swal2-input' class='swal2-input' style='display: none;' />
				<input type='file' class='swal2-file' style='display: none;' />
				<div class='swal2-range' style='display: none;'>
					<input type='range' />
					<output></output>
				</div>
				<select
					id='swal2-select'
					class='swal2-select'
					style='display: none;'
				></select>
				<div class='swal2-radio' style='display: none;'></div>
				<label class='swal2-checkbox' style='display: none;'>
					<input type='checkbox' id='swal2-checkbox' />
					<span class='swal2-label'></span>
				</label>
				<textarea
					id='swal2-textarea'
					class='swal2-textarea'
					style='display: none;'
				></textarea>
				<div
					class='swal2-validation-message'
					id='swal2-validation-message'
					style='display: none;'
				></div>
				<div class='swal2-actions' style='display: flex;'>
					<div class='swal2-loader'></div>
					<button
						type='button'
						class='swal2-confirm swal2-styled'
						aria-label=''
						style='display: inline-block;'
					>
						OK
					</button>
					<button
						type='button'
						class='swal2-deny swal2-styled'
						aria-label=''
						style='display: none;'
					>
						No
					</button>
					<button
						type='button'
						class='swal2-cancel swal2-styled'
						aria-label=''
						style='display: none;'
					>
						Cancel
					</button>
				</div>
				<div class='swal2-footer' style='display: none;'></div>
				<div class='swal2-timer-progress-bar-container'>
					<div class='swal2-timer-progress-bar' style='display: none;'></div>
				</div>
			</div>
		</div>
	);
}
