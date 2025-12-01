import { NextResponse } from 'next/server';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    // TODO: Implement database logic to create a new user.
    // Example with Firebase Auth:
    // import { auth } from '@/lib/firebase'; // assuming you have firebase configured
    // const userRecord = await auth.createUser({ email, password, displayName: name });

    const mockUserId = `user_${Date.now()}`;

    return NextResponse.json({ message: 'User created successfully', userId: mockUserId }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
