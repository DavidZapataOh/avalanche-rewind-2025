import { getUserRewindData } from '@/lib/rewind-data';
import { isValidAddress } from '@/lib/utils';
import { RewindExperience } from './RewindExperience';
import { redirect } from 'next/navigation';

interface RewindPageProps {
    params: Promise<{
        address: string;
        year: string;
    }>;
}

/**
 * Main Rewind Experience Page
 * 
 * Server-side:
 * - Validates address and year parameters
 * - Fetches rewind data from Glacier API
 * 
 * Client-side:
 * - Renders the immersive slide-based experience
 */
export default async function RewindPage({ params }: RewindPageProps) {
    const { address, year: yearStr } = await params;
    const year = parseInt(yearStr, 10);

    // Validate address
    if (!isValidAddress(address)) {
        redirect('/');
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 2020 || year > currentYear) {
        redirect('/');
    }

    // Fetch rewind data server-side
    const rewindData = await getUserRewindData(address, year);

    return <RewindExperience rewind={rewindData} />;
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: RewindPageProps) {
    const { address, year } = await params;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return {
        title: `${shortAddress}'s Avalanche Rewind ${year}`,
        description: `Explore ${shortAddress}'s on-chain journey on Avalanche in ${year}. View transactions, tokens, NFTs, and more!`,
        openGraph: {
            title: `${shortAddress}'s Avalanche Rewind ${year}`,
            description: `Explore this wallet's on-chain journey on Avalanche in ${year}.`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Avalanche Rewind ${year}`,
            description: `Check out this wallet's year on Avalanche!`,
        },
    };
}
