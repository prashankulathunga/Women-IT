/**
 * Conditional className joiner.
 *
 * Deliberately dependency-free: variant maps in this codebase are authored so
 * that two variants never set the same Tailwind property, which removes the
 * need for a class-conflict resolver.
 *
 * @param  {...(string|false|null|undefined|string[]|Record<string, boolean>)} inputs
 * @returns {string}
 */
export const cn = (...inputs) => {
	const classes = [];

	for (const input of inputs) {
		if (!input) continue;

		if (typeof input === 'string') {
			classes.push(input);
			continue;
		}

		if (Array.isArray(input)) {
			const nested = cn(...input);
			if (nested) classes.push(nested);
			continue;
		}

		if (typeof input === 'object') {
			for (const [key, value] of Object.entries(input)) {
				if (value) classes.push(key);
			}
		}
	}

	return classes.join(' ');
};
