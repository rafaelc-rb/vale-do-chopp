import { NextRequest } from "next/server"
import prisma from "../../../prisma/client";

type PersonalUse = {
    who: string,
    type: string,
    amount: number,
    date: string,
}

export async function POST(request: NextRequest) {
    const personalUse: PersonalUse = await request.json()
    try {
        const stock = await prisma.stock.findFirst({
            where: {
                type: personalUse.type,
            },
        })

        if(stock && stock.amount >= personalUse.amount){
            // Atualize a quantidade de estoque corretamente
            await prisma.stock.update({
                where: {
                    id: stock.id
                },
                data: {
                    amount: stock.amount - personalUse.amount
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
            await prisma.personalUse.create({
                data: {
                    who: personalUse.who,
                    type: personalUse.type,
                    amount: personalUse.amount,
                    date: personalUse.date,
                    expenseId: stock.expenseId,
                }
            })
        } else {
            return new Response("No stock",{status : 404})
        }

        return new Response("Created successfully", {status: 200})
    } catch (err){
        console.error(err); // Log do erro
        return new Response("Error",{status: 400})
    }
}
export async function GET() {
    try {
        const uses = await prisma.personalUse.findMany();
        let useSummary: {who: string, type: string, amount: number}[] = [];

        uses.forEach(use => {
            let found = useSummary.find(item => item.who === use.who && item.type === use.type);
            if (found) {
                found.amount += use.amount;
            } else {
                useSummary.push({who: use.who, type: use.type, amount: use.amount});
            }
        });
        return new Response(JSON.stringify({useSummary: useSummary, uses: uses}))
    } catch (err) {
        return new Response("Error",{status: 400})
    }   
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json()
    try {
        const use = await prisma.personalUse.findUnique({
            where: { id: id }
        })
        
        if (use) {
            await prisma.personalUse.delete({
                where: {
                    id: id,
                },
            })

            const expense = await prisma.expense.findUnique({
                where: {
                    id: use.expenseId,
                }
            })
    
            await prisma.stock.create({
                data: {
                    type: use.type,
                    amount: use.amount,
                    price: expense?.price || '0.00',
                    purchase_date: use.date,
                    expenseId: use.expenseId
                }
            })
        }

        return new Response("Deleted successfully", {status: 200})
    } catch (err:any){
        return new Response(err.message, {status: 400})
    }
}

