import { prisma } from "$lib/prisma";
// import type { Product } from "@prisma/client";

/*
    Typing disabled because of this bug: https://github.com/prisma/prisma/issues/10404
*/

// GET /products.json
export const get = async ({params, request, url}) => {
    try {
        const body = await prisma.product.findMany();
        return { body }
    } catch ({ code, message }) {
        return {
            status: 500,
            body: { code, message }
        }
    }
};

// POST /products.json
export const post = async ({ request }) => {
    const data = await request.json()

    try {
        const body = await prisma.product.create({ data });
        return { body }
    } catch ({ code, message }) {
        return {
            status: 500,
            body: { code, message }
        }
    }
}