export function buildWhatsAppURL({
	phone,
	productName,
	category,
	price,
	size,
	quantity = 1,
}: {
	phone: string;
	productName: string;
	category: string;
	price: string;
	size: string;
	quantity?: number;
}): string {
	const lines = [
		`Hi! 👋 I'd like to order from *Aakriti 3D Studio*`,
		``,
		`🛍️ *Product:* ${productName}`,
		`📂 *Category:* ${category}`,
		`📐 *Size:* ${size}`,
		`🔢 *Quantity:* ${quantity}`,
		`💰 *Price:* ₹${price} × ${quantity} = ₹${parseInt(price.replace(/,/g, "")) * quantity}`,
		``,
		`Please confirm availability and share payment details. Thank you!`,
	];
	const message = encodeURIComponent(lines.join("\n"));
	return `https://wa.me/${phone}?text=${message}`;
}
