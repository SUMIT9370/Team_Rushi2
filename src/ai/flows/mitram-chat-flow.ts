'use server';
/**
 * @fileOverview A conversational AI agent for the MITRAM app.
 *
 * - mitramChat - A function that handles the conversational chat process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for a single message in the history
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input schema for the flow
const MitramChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});

// Define the output schema for the flow
const MitramChatOutputSchema = z.string();

export async function mitramChat(
  input: z.infer<typeof MitramChatInputSchema>
): Promise<z.infer<typeof MitramChatOutputSchema>> {
  return mitramChatFlow(input);
}

const mitramChatFlow = ai.defineFlow(
  {
    name: 'mitramChatFlow',
    inputSchema: MitramChatInputSchema,
    outputSchema: MitramChatOutputSchema,
  },
  async ({ history, message }) => {
    const systemPrompt = `You are MITRAM, a caring and friendly digital companion for the elderly. Your personality is warm, patient, and encouraging. You are not just a chatbot; you are a friend.

      Your primary functions are:
      - Providing companionship and engaging in friendly conversation.
      - Assisting with managing medicine reminders, doctor's appointments, and health tracking.
      - Helping users connect with their family and emergency contacts.
      - Answering general knowledge questions in a simple, clear, and reassuring way.

      GUIDELINES:
      - Always be polite, respectful, and empathetic.
      - Keep your responses concise and easy to understand. Avoid jargon.
      - If a user's message is unclear, ask gentle clarifying questions.
      - If a user seems distressed or mentions an emergency, gently guide them to use the app's "Emergency" feature or to call for help immediately. Do not try to solve medical emergencies yourself.
      - Proactively suggest features of the app where relevant. For example, if they talk about medicine, you can say "I can help you set a reminder for that in the Reminders section."
      - Maintain a positive and supportive tone.
      `;

    const fullHistory = [...history, { role: 'user' as const, content: message }];

    const response = await ai.generate({
      system: systemPrompt,
      history: fullHistory,
    });

    // Safely access the text output and provide a default if it's empty
    return response.text ?? "I'm not sure how to respond to that. Could you please rephrase?";
  }
);
