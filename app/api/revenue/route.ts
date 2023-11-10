import { NextRequest } from "next/server"
import prisma from "../../../prisma/client";

type Revenue = {
    type: string,
    amount: string,
    price: string,
    date: string,
}

export async function POST(request: NextRequest) {
    const revenue: Revenue = await request.json()
    try {
        await prisma.revenue.create({
            data: {
                type: revenue.type,
                amount: revenue.amount,
                price: revenue.price,
                date: revenue.date,
            }
        })
        return new Response("Created successfully", {status: 200})
    } catch (err){
        return new Response("Error",{status: 500})
    }
}

export async function GET(request: NextRequest) {
    const body = await request.json()
    console.log(body)
    return new Response('Not yet implemented')
}
