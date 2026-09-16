import { Checkbox } from '../ui/Checkbox';
import { ChipGroup } from '../ui/ChipGroup';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TagInput } from '../ui/TagInput';
import { Textarea } from '../ui/Textarea';

/** Descriptor keys that describe the field rather than the rendered control. */
const META_KEYS = ['name', 'type', 'label', 'hint', 'placeholder', 'options', 'validation', 'colSpan'];

const controlProps = (field) =>
	Object.fromEntries(Object.entries(field).filter(([key]) => !META_KEYS.includes(key)));

/**
 * Renders one field from a descriptor.
 *
 * Onboarding and profile editing describe their fields as data (see
 * `features/profile/profileFields.js`) and render them through here, so the
 * two surfaces can never drift in labels, validation or control type.
 */
export const SchemaField = ({ field, form }) => {
	const { name, type = 'text', label, hint, placeholder, options } = field;
	const rest = controlProps(field);

	const error = form.touched[name] ? form.errors[name] : undefined;
	const value = form.values[name];

	switch (type) {
		case 'textarea':
			return (
				<Textarea
					name={name}
					label={label}
					hint={hint}
					placeholder={placeholder}
					error={error}
					value={value ?? ''}
					onChange={form.handleChange}
					onBlur={form.handleBlur}
					{...rest}
				/>
			);

		case 'select':
			return (
				<Select
					name={name}
					label={label}
					hint={hint}
					placeholder={placeholder}
					options={options}
					error={error}
					value={value ?? ''}
					onChange={form.handleChange}
					onBlur={form.handleBlur}
					{...rest}
				/>
			);

		case 'tags':
			return (
				<TagInput
					label={label}
					hint={hint}
					placeholder={placeholder}
					error={error}
					value={Array.isArray(value) ? value : []}
					onChange={(next) => form.setFieldValue(name, next)}
					{...rest}
				/>
			);

		case 'chips':
			return (
				<ChipGroup
					label={label}
					hint={hint}
					options={options}
					error={error}
					value={Array.isArray(value) ? value : []}
					onChange={(next) => form.setFieldValue(name, next)}
					{...rest}
				/>
			);

		case 'checkbox':
			return (
				<Checkbox
					name={name}
					label={label}
					description={hint}
					error={error}
					checked={Boolean(value)}
					onChange={form.handleChange}
					{...rest}
				/>
			);

		default:
			return (
				<Input
					name={name}
					label={label}
					hint={hint}
					placeholder={placeholder}
					type={type}
					error={error}
					value={value ?? ''}
					onChange={form.handleChange}
					onBlur={form.handleBlur}
					{...rest}
				/>
			);
	}
};
