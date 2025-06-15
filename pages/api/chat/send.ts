// pages/api/chat/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Invalid messages format' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Or 'gpt-3.5-turbo' if using that
      messages,
    });

    const reply = completion.choices[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
