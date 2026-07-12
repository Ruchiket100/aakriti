import { atom, useAtom } from "jotai";
import type { Product } from "@/lib/supabase";

export interface CartItem {
	product: Product;
	quantity: number;
	size?: string;
	color?: string;
}

// Global cart atom
export const cartAtom = atom<CartItem[]>([]);

export function useCart() {
	const [cart, setCart] = useAtom(cartAtom);

	const addToCart = (
		product: Product,
		quantity = 1,
		size?: string,
		color?: string,
	) => {
		setCart((curr) => {
			const index = curr.findIndex(
				(item) =>
					item.product.id === product.id &&
					item.size === size &&
					item.color === color,
			);

			if (index > -1) {
				const next = [...curr];
				next[index].quantity += quantity;
				return next;
			}

			return [...curr, { product, quantity, size, color }];
		});
	};

	const removeFromCart = (
		productId: string,
		size?: string,
		color?: string,
	) => {
		setCart((curr) =>
			curr.filter(
				(item) =>
					!(
						item.product.id === productId &&
						item.size === size &&
						item.color === color
					),
			),
		);
	};

	const updateQuantity = (
		productId: string,
		quantity: number,
		size?: string,
		color?: string,
	) => {
		setCart((curr) =>
			curr.map((item) =>
				item.product.id === productId &&
				item.size === size &&
				item.color === color
					? { ...item, quantity: Math.max(1, quantity) }
					: item,
			),
		);
	};

	const clearCart = () => setCart([]);

	const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
	const totalPrice = cart.reduce(
		(acc, item) => acc + (item.product.price || 0) * item.quantity,
		0,
	);

	return {
		cart,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		totalItems,
		totalPrice,
	};
}
