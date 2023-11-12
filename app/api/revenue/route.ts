import { NextRequest } from "next/server"
import prisma from "../../../prisma/client";

type Revenue = {
    type: string,
    amount: number,
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
        return new Response("Error",{status: 400})
    }
}

export async function GET() {
    try {
        const revenues = await prisma.revenue.findMany({
            select:{
                price: true
            }
        })
        return new Response(JSON.stringify(revenues))
    } catch (err) {
        return new Response("Error",{status: 400})
    }   
}
