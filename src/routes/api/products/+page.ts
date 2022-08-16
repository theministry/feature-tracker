import type { Product } from '$lib/prisma';

export const load = async ({ fetch }) => {
	const response = await fetch('/api/products.json?foo=bar');
	const products: Product[] = await response.json();
	return { products };
};
