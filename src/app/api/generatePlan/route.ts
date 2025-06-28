import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import firebase_app from '@/firebase/config'
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const db = getFirestore(firebase_app)

export async function POST(req: NextRequest) {
  const { ideaId, idea, lockIn } = await req.json()
  if (!ideaId || !idea) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const prompt = lockIn
    ? `You are helping a hackathon team build a minimal viable product fast. Break the following idea into a short plan of tasks per role.\nIdea: ${idea}`
    : `Generate a project plan with tasks per role for the following idea.\nIdea: ${idea}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  })

  const plan = completion.choices[0].message?.content || ''

  await setDoc(doc(collection(db, 'plans'), ideaId), {
    idea,
    lockIn: !!lockIn,
    plan,
    createdAt: Timestamp.now(),
  })

  return NextResponse.json({ plan })
}
