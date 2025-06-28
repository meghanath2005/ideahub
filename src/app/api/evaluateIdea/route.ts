import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import firebase_app from '@/firebase/config'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const db = getFirestore(firebase_app)

export async function POST(req: NextRequest) {
  const { idea, userId } = await req.json()
  if (!idea || !userId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content:
          `Evaluate the following idea. Return JSON with overallScore (0-10), innovation, feasibility and a short summary.\nIdea: ${idea}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0].message?.content || '{}'
  let evaluation
  try {
    evaluation = JSON.parse(content)
  } catch {
    evaluation = { summary: content }
  }

  await addDoc(collection(db, 'ideas'), {
    userId,
    idea,
    evaluation,
    createdAt: Timestamp.now(),
  })

  return NextResponse.json(evaluation)
}
