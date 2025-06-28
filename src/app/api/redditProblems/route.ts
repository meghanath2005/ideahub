import { NextRequest, NextResponse } from 'next/server'
import firebase_app from '@/firebase/config'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

const db = getFirestore(firebase_app)

export async function POST(req: NextRequest) {
  const { problems } = await req.json()
  if (!Array.isArray(problems)) {
    return NextResponse.json({ error: 'Problems array required' }, { status: 400 })
  }

  for (const p of problems) {
    await addDoc(collection(db, 'problems'), { ...p, createdAt: Timestamp.now() })
  }

  return NextResponse.json({ stored: problems.length })
}
