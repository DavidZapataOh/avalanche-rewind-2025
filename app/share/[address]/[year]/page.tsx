import { getUserRewindData } from '@/lib/rewind-data';
import { isValidAddress } from '@/lib/utils';
import { ShareExperience } from './ShareExperience';
import { redirect } from 'next/navigation';

interface SharePageProps {
    params: Promise<{
        address: string;
        year: string;
    }>;
}

/**
 * Shareable Rewind Page
 * 
 * Public route that replays the rewind experience for any address/year
 * No wallet connection required
 */
export default async function SharePage({ params }: SharePageProps) {
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

    return <ShareExperience rewind={rewindData} />;
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: SharePageProps) {
    const { address, year } = await params;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return {
        title: `${shortAddress}'s Avalanche Rewind ${year} | Shared`,
        description: `Check out ${shortAddress}'s on-chain journey on Avalanche in ${year}! Create your own Rewind at Avalanche Rewind.`,
        openGraph: {
            title: `${shortAddress}'s Avalanche Rewind ${year}`,
            description: `Check out this wallet's on-chain journey on Avalanche in ${year}!`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Avalanche Rewind ${year} - Shared`,
            description: `Check out this wallet's year on Avalanche!`,
        },
    };
}
