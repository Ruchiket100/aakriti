"use client";

export function StarIcon({ size = 12 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b">
			<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
		</svg>
	);
}

export function ArrowRight({ size = 13 }: { size?: number }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			viewBox="0 0 24 24"
		>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}