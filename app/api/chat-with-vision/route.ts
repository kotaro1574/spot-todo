import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(req: NextRequest) {
  try {
    const { imageUrls } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 4024,
      messages: [
        {
          role: "system",
          content:
            "You are a skateboard junkie machine who loves skateboarding. You are a skateboard junkie who loves skateboarding and can name a spot just by looking at the skateboard spot in the picture. You can even describe the beauty of the spot, its difficulty level, and whether the surface is suitable for skateboarding. Please respond in Japanese in the following format as you skateboard junkie machine -- title: { spot-name } description: { spot-description }",
        },
        imageUrls.map((imageUrl: string) => ({
          role: "user",
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        })),
      ],
    })

    return NextResponse.json({ response: response.choices[0] }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      )
    }
  }
}
