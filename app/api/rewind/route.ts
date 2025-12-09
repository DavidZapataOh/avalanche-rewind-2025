import { NextRequest, NextResponse } from 'next/server';
import { getUserRewindData } from '@/lib/rewind-data';
import { isValidAddress } from '@/lib/utils';

/**
 * POST /api/rewind
 * 
 * Computes and returns the Avalanche Rewind data for a given address and year.
 * 
 * Request body:
 * {
 *   address: string (Ethereum address)
 *   year: number (e.g., 2024)
 * }
 * 
 * Response:
 * - 200: AvalancheRewind object
 * - 400: Invalid input
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, year } = body;

    // Validate address
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate year
    if (!year || typeof year !== 'number') {
      return NextResponse.json(
        { error: 'Year is required and must be a number' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    if (year < 2020 || year > currentYear) {
      return NextResponse.json(
        { error: `Year must be between 2020 and ${currentYear}` },
        { status: 400 }
      );
    }

    // Fetch rewind data
    const rewindData = await getUserRewindData(address, year);

    return NextResponse.json(rewindData);
  } catch (error) {
    console.error('Error in /api/rewind:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rewind?address=0x...&year=2024
 * 
 * Alternative GET endpoint for easier sharing/caching.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const yearStr = searchParams.get('year');

    // Validate address
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate year
    const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year) || year < 2020 || year > currentYear) {
      return NextResponse.json(
        { error: `Year must be between 2020 and ${currentYear}` },
        { status: 400 }
      );
    }

    // Fetch rewind data
    const rewindData = await getUserRewindData(address, year);

    // Cache for 5 minutes
    return NextResponse.json(rewindData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in /api/rewind GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
