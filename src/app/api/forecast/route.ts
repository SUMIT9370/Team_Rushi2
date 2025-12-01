import { NextResponse } from 'next/server';
import { z } from 'zod';

const forecastSchema = z.object({
  lat: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Latitude must be a number."}),
  lon: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Longitude must be a number."}),
  days: z.string().optional().default('5'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const parsed = forecastSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    
    // TODO: Fetch forecast data from a third-party API.

    const mockForecast = Array.from({ length: 5 }).map((_, i) => ({
      date: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
      max_temp: 28 + i,
      min_temp: 18 + i,
      condition: i % 2 === 0 ? "Sunny" : "Scattered Showers",
    }));

    return NextResponse.json(mockForecast);
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
