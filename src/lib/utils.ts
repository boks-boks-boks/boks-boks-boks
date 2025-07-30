/**
 * Creates a debounced function that delays invoking the provided function
 * until after wait milliseconds have elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	
	return function executedFunction(...args: Parameters<T>) {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, wait);
		}
	};
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

/**
 * Generates a random color for labels
 */
export function generateRandomColor(): string {
	const colors = [
		'#ef4444', '#f97316', '#f59e0b', '#eab308',
		'#84cc16', '#22c55e', '#10b981', '#14b8a6',
		'#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
		'#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
