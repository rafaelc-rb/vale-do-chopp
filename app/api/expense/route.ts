import { NextRequest } from "next/server"
import prisma from "../../../prisma/client";

type Expense = {
    item_name: string;
    amount: number;
    price: string;
    purchase_date: string;
}

export async function POST(request: NextRequest) {
    const expense: Expense = await request.json()
    try {
        await prisma.expense.create({
            data: {
                item_name: expense.item_name,
                amount: expense.amount,
                price: expense.price,
                purchase_date: expense.purchase_date,
            }
        })
        return new Response("Created successfully", {status: 200})
    } catch (err){
        return new Response("Error",{status: 400})
    }
}

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            select:{
                price: true
            }
        })
        return new Response(JSON.stringify(expenses))
    } catch (err) {
        return new Response("Error",{status: 400})
    }   
}
