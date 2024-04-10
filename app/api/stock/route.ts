import { NextRequest } from "next/server"
import prisma from "../../../prisma/client";

type Stock = {
    type: string;
    amount: number;
    price: string;
    purchase_date: string;
}

export async function POST(request: NextRequest) {
    const stock: Stock = await request.json()
    try {
        const newExpense = await prisma.expense.create({
            data: {
                item_name: `Barril de ${stock.type}`,
                amount: stock.amount,
                price: stock.price,
                purchase_date: stock.purchase_date,
            }
        })

        await prisma.stock.create({
            data: {
                type: stock.type,
                amount: stock.amount,
                price: stock.price,
                purchase_date: stock.purchase_date,
                expenseId: newExpense.id
            }
        })


        return new Response("Created successfully", {status: 200})
    } catch (err){
        return new Response("Error",{status: 400})
    }
}

export async function GET() {
    try {
        const stocks = await prisma.stock.findMany();
        let stockSummary: {type: string, amount: number}[] = [];

        stocks.forEach(stock => {
            let found = stockSummary.find(item => item.type === stock.type);
            if (found) {
                found.amount += stock.amount;
            } else {
                stockSummary.push({type: stock.type, amount: stock.amount});
            }
        });

        return new Response(JSON.stringify({stock: stocks, summary: stockSummary}))
    } catch (err) {
        return new Response("Error",{status: 400})
    }   
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json()
    try {
        const deletedItem = await prisma.stock.findUnique(id)

        if(deletedItem){ 
            await prisma.stock.delete({
                where: {
                    id: id,
                },
            })

            await prisma.expense.delete({
                where: {
                    id: deletedItem.expenseId,
                }
            })
        }


        return new Response("Deleted successfully", {status: 200})
    } catch (err){
        return new Response("Error",{status: 400})
    }
}
