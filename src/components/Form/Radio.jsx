import { useField } from 'formik';
import { ReactComponent as IconToggleTick } from '../../assets/images/svg/checkbox-tick.svg';

const Radio = ({
	label,
	name,
	radioData,
	formik,
	bottomLabel,
	isMadetory = true,
	checkboxType = 'circle',
	onChange = () => { },
	value, // Added explicit value prop
	...props
}) => {
	// Use the provided name for formik field
	const [field] = useField({ ...props, name, type: 'radio' });

	// Helper function to get nested value from formik values
	const getNestedValue = (obj, path) => {
		const parts = path.split('.');
		let current = obj;
		
		for (const part of parts) {
			if (current && typeof current === 'object' && part in current) {
				current = current[part];
			} else {
				return undefined;
			}
		}
		
		return current;
	};

	// Get the current value from formik or directly from value prop
	const currentValue = value !== undefined ? value : getNestedValue(formik.values, name);

	// Updated handleRadioChange to ensure onChange works properly
	function handleRadioChange(event, radioValue) {
		onChange(event); // Call parent-provided onChange
		formik.setFieldValue(name, radioValue); // Update Formik state
	}

	return (
		<div className="my-1 flex flex-col items-start">
			<label className="font-open-sans text-form-md text-[#283A46]">{label} {isMadetory && <span className="text-red-500">*</span>}</label>
			<div className="flex md:flex-row gap-6">
				{radioData.map(({ id, value, label, description, onSelectMessage }) => (
					<div key={id} className="flex flex-col">
						<label
							htmlFor={id}
							className="relative flex items-start gap-4 pt-4"
						>
							{/* Circle or Square Radio Indicator */}
							{
								{
									circle: currentValue === value ? (
										<div className="relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-primary bg-[#ffffff]">
											<span className="h-[10px] min-h-[10px] w-[10px] min-w-[10px] rounded-full bg-primary"></span>
										</div>
									) : (
										<div className="h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-full border-2 border-[#767676]"></div>
									),
									square: currentValue === value ? (
										<div className="relative h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-sm border-2 border-primary bg-primary">
											<IconToggleTick className="absolute inset-0 top-[3px] left-[2px]" />
										</div>
									) : (
										<div className="h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-sm border-2 border-[#C4C4C4]"></div>
									),
								}[checkboxType]
							}
							<input
								{...field}
								className="invisible absolute h-[0px] w-[0px]"
								type="radio"
								id={id}
								value={value}
								checked={currentValue === value} // Use our currentValue variable
								onChange={(event) => handleRadioChange(event, value)} // Update state
							/>
							<div className="flex flex-col">
								<span className="font-lato text-sm leading-5 text-[#3B3B3B]">{label}</span>
								{description && (
									<p className="font-open-sans text-[12px] italic text-[#3B3B3B]">
										{description}
									</p>
								)}
							</div>
						</label>

						{/* Conditionally render the onSelectMessage */}
						{currentValue === value && onSelectMessage && (
							<div className="flex flex-col gap-[16px] bg-[#E6EFF6] px-[12px] py-[16px]">
								<p className="font-lato text-[14px]">{onSelectMessage}</p>
							</div>
						)}
					</div>
				))}
			</div>
			{bottomLabel && (
				<p className="text-[#283A46] p-1 pt-4">{bottomLabel}</p>
			)}

			{/* Error message display - handle nested paths */}
			{name.split('.').reduce((obj, path) => obj && obj[path], formik.errors) && (
				<div className="font-open-sans text-form-xs text-[#cc3300] mt-2">
					{name.split('.').reduce((obj, path) => obj && obj[path], formik.errors)}
				</div>
			)}
		</div>
	);
};

export default Radio;