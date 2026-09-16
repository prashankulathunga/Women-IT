import { useCallback, useMemo, useState } from 'react';
import { validateSchema } from '../lib/validators';

/**
 * Controlled-form controller with schema validation, touched tracking and
 * async submit state. Kept dependency-free so the whole app shares one
 * form contract instead of hand-rolling `useState` per screen.
 *
 * @param {object}   config
 * @param {object}   config.initialValues
 * @param {object}   [config.validationSchema] `{ field: [rule, …] }`
 * @param {Function} [config.onSubmit] `(values, helpers) => void | Promise`
 * @param {boolean}  [config.validateOnChange=false]
 */
export const useForm = ({
	initialValues = {},
	validationSchema,
	onSubmit,
	validateOnChange = false,
} = {}) => {
	// The baseline the form compares against for `isDirty` and resets to. Held
	// in state rather than a ref so it is never read during render from a ref.
	const [baseline, setBaseline] = useState(initialValues);
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	const runValidation = useCallback(
		(nextValues) =>
			validationSchema ? validateSchema(nextValues, validationSchema) : {},
		[validationSchema],
	);

	const setFieldValue = useCallback(
		(name, value) => {
			setValues((prev) => {
				const next = { ...prev, [name]: value };
				if (validateOnChange) {
					const nextErrors = runValidation(next);
					setErrors((prevErrors) =>
						nextErrors[name]
							? { ...prevErrors, [name]: nextErrors[name] }
							: omit(prevErrors, name),
					);
				} else {
					setErrors((prevErrors) => omit(prevErrors, name));
				}
				return next;
			});
			setSubmitError(null);
		},
		[runValidation, validateOnChange],
	);

	const setFieldError = useCallback((name, message) => {
		setErrors((prev) => ({ ...prev, [name]: message }));
	}, []);

	/** Works with native inputs, checkboxes and our own UI primitives. */
	const handleChange = useCallback(
		(event) => {
			const target = event?.target;
			if (!target) return;
			const next =
				target.type === 'checkbox' ? target.checked : target.value;
			setFieldValue(target.name, next);
		},
		[setFieldValue],
	);

	const handleBlur = useCallback(
		(event) => {
			const name = event?.target?.name;
			if (!name) return;
			setTouched((prev) => ({ ...prev, [name]: true }));
			const nextErrors = runValidation(values);
			setErrors((prev) =>
				nextErrors[name] ? { ...prev, [name]: nextErrors[name] } : omit(prev, name),
			);
		},
		[runValidation, values],
	);

	const validate = useCallback(() => {
		const nextErrors = runValidation(values);
		setErrors(nextErrors);
		setTouched(
			Object.keys(validationSchema || {}).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{},
			),
		);
		return Object.keys(nextErrors).length === 0;
	}, [runValidation, validationSchema, values]);

	const reset = useCallback(
		(nextInitial) => {
			const base = nextInitial ?? baseline;
			setBaseline(base);
			setValues(base);
			setErrors({});
			setTouched({});
			setSubmitError(null);
			setIsSubmitting(false);
		},
		[baseline],
	);

	const handleSubmit = useCallback(
		async (event) => {
			event?.preventDefault?.();
			if (!validate()) return false;

			setIsSubmitting(true);
			setSubmitError(null);
			try {
				await onSubmit?.(values, { reset, setFieldError });
				return true;
			} catch (error) {
				setSubmitError(error?.message || 'Something went wrong. Please try again.');
				return false;
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSubmit, reset, setFieldError, validate, values],
	);

	/** Spread onto an `<Input />` to wire value + error + handlers at once. */
	const getFieldProps = useCallback(
		(name) => ({
			name,
			value: values[name] ?? '',
			onChange: handleChange,
			onBlur: handleBlur,
			error: touched[name] ? errors[name] : undefined,
		}),
		[errors, handleBlur, handleChange, touched, values],
	);

	const isDirty = useMemo(
		() => JSON.stringify(values) !== JSON.stringify(baseline),
		[baseline, values],
	);

	return {
		values,
		errors,
		touched,
		isSubmitting,
		submitError,
		isDirty,
		isValid: Object.keys(errors).length === 0,
		setValues,
		setFieldValue,
		setFieldError,
		setSubmitError,
		handleChange,
		handleBlur,
		handleSubmit,
		getFieldProps,
		validate,
		reset,
	};
};

const omit = (object, key) => {
	if (!(key in object)) return object;
	const next = { ...object };
	delete next[key];
	return next;
};
