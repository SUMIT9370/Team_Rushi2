import { NextResponse } from 'next/server';
import { z } from 'zod';

const alertsSchema = z.object({
    lat: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Latitude must be a number."}),
    lon: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Longitude must be a number."}),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        
        const parsed = alertsSchema.safeParse(params);

        if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }
        
        // TODO: Fetch alert data from a third-party API.

        const mockAlerts: object[] = [
        //   {
        //     id: 'alert_1',
        //     severity: 'Moderate',
        //     title: 'Thunderstorm Watch',
        //     description: 'Severe thunderstorms are possible in your area. Be prepared for strong winds and hail.',
        //     starts_at: new Date().toISOString(),
        //     ends_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        //   }
        ];

        return NextResponse.json(mockAlerts);

    } catch (error) {
        console.error('Alerts error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
