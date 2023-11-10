import { NextRequest } from "next/server"

export async function POST(request: Request) {
    return new Response('Not yet implemented')
}

export async function GET(request: NextRequest) {
    const body = await request.json()
    console.log(body)
    return new Response('Not yet implemented')
}
