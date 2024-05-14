import { json } from '@sveltejs/kit';
import { prisma } from "$lib/prisma";
// import type { Release } from "@prisma/client";

/*
    Typing disabled because of this bug: https://github.com/prisma/prisma/issues/10404
*/

// GET /releases.json
export const GET = async () => {
    try {
        const body = await prisma.release.findMany({
            orderBy: { general_availability: 'desc' }
        });
        return json(body);
    } catch ({ code, message }) {
        return json({ code, message }, {
            status: 500
        })
    }
};

// POST /releases.json
export const POST = async ({ request }) => {
    const data = await request.json()
    try {
        const body = await prisma.release.create({ data });
        return json(body);
    } catch ({ code, message }) {
        return json({ code, message }, {
            status: 500
        })
    }
}