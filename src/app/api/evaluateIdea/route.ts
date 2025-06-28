import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import addData from '@/firebase/firestore/addData';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { idea, userId } = await req.json();
    if (!idea || !userId) {
      return NextResponse.json({ error: 'Missing idea or userId' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an idea evaluation assistant. Return a short evaluation with a numerical score between 1 and 10.' },
        { role: 'user', content: idea }
      ]
    });

    const evaluation = completion.choices[0]?.message?.content || '';
    const id = uuidv4();
    await addData('ideas', id, { idea, userId, evaluation, createdAt: Date.now() });

    return NextResponse.json({ id, evaluation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
