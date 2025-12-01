import { NextResponse } from 'next/server';
import { z } from 'zod';

const weatherSchema = z.object({
  lat: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Latitude must be a number."}),
  lon: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Longitude must be a number."}),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const parsed = weatherSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    
    // const { lat, lon } = parsed.data;
    // TODO: Fetch weather data from a third-party API using lat and lon.

    const mockWeather = {
      temperature: 25,
      condition: "Partly Cloudy",
      humidity: 65,
      wind_speed: 15, // km/h
    };

    return NextResponse.json(mockWeather);
  } catch (error) {
    console.error('Current weather error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
