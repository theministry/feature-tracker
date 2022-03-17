import { prisma } from "$lib/prisma";
// import type { Product } from "@prisma/client";

/*
    Typing disabled because of this bug: https://github.com/prisma/prisma/issues/10404
*/

// GET /products.json
export const get = async ({params, request, url}) => {
    const body = await prisma.product.findMany();
    return { body }
};

// POST /products.json
export const post = async ({ request }) => {
    const data = await request.json()
    const body = await prisma.product.create({ data });
    return { body }
}