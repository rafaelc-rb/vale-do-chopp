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
        const stock = await prisma.stock.findFirst({
            where: {
                type: revenue.type,
            },
        })

        if(stock && stock.amount >= revenue.amount){

            // Atualize a quantidade de estoque corretamente
            await prisma.stock.update({
                where: {
                    id: stock.id
                },
                data: {
                    amount: stock.amount - revenue.amount,
                    price: String((Number(stock.price) / stock.amount) * (stock.amount - revenue.amount))
                }
            })

            // Verifique se a quantidade de estoque é zero
            if(stock.amount - 1 === 0) {
                await prisma.stock.delete({
                    where: {
                        id: stock.id
                    }
                })
            }

            await prisma.revenue.create({
                data: {
                    type: revenue.type,
                    amount: revenue.amount,
                    price: revenue.price,
                    date: revenue.date,
                    expenseId: stock.expenseId
                }
            })
        } else {
            return new Response("No stock",{status : 404})
        }

        return new Response("Created successfully", {status: 200})
    } catch (err: any){
        console.error(err); // Log do erro
        return new Response(err.message,{status: 400})
    }
}

export async function GET() {
    try {
        const revenues = await prisma.revenue.findMany()
        return new Response(JSON.stringify(revenues))
    } catch (err) {
        console.error(err); // Log do erro
        return new Response("Error",{status: 400})
    }   
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json()
    try {
        const rev = await prisma.revenue.findUnique({
            where: { id: id }
        })
        
        if (rev) {

            const expense = await prisma.expense.findUnique({
                where: {
                    id: rev.expenseId,
                }
            })

            let price

            if (expense) {
                price =  (Number(expense.price) / expense.amount) * rev.amount
            }
    
            await prisma.stock.create({
                data: {
                    type: rev.type,
                    amount: rev.amount,
                    price: String(price) || rev.price,
                    purchase_date: rev.date,
                    expenseId: rev.expenseId
                }
            })

            await prisma.revenue.delete({
                where: {
                    id: id,
                },
            })
        }

        return new Response("Deleted successfully", {status: 200})
    } catch (err:any){
        return new Response(err.message, {status: 400})
    }
}
