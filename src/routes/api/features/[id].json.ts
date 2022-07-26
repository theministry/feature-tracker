import { prisma } from "$lib/prisma";

// GET /features/:id.json
export const GET = async ({ params }) => {
    const id = parseInt(params.id);
    
    try {
        const body = await prisma.feature.findUnique({
            where: { id }
        })
        return { body }
    } catch ({ code, message }) {
        return {
            status: 500,
            body: { code, message }
        }
    }
}

// PATCH /features/:id.json
export const PATCH = async ({ params, request }) => {
    const data = await request.json()
    const id = parseInt(params.id);
    data.category_id = data.category_id || null
    
    try {
        const body = await prisma.feature.update({
            where: { id },
            data
        })
        return { body }
    } catch ({ code, message }) {
        return {
            status: 500,
            body: { code, message }
        }
    }
}

// DELETE /features/:id.json
export const DELETE = async ({ params }) => {
    const id = parseInt(params.id);
    
    try {
        const body = await prisma.feature.delete({
            where: { id }
        })
        return { body }
    } catch ({ code, message }) {
        return {
            status: 500,
            body: { code, message }
        }
    }
}
