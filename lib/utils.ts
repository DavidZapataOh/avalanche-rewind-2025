import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an Ethereum address for display (shortened)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format USD value with proper formatting
 */
export function formatUSD(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format AVAX value
 */
export function formatAVAX(value: number): string {
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K AVAX`;
  }
  return `${value.toFixed(4)} AVAX`;
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Generate a shareable URL for a rewind
 */
export function generateShareUrl(address: string, year: number): string {
  // Ensure we're using checksummed address format
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://avalanche-rewind.vercel.app';
  
  return `${baseUrl}/share/${address}/${year}`;
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}

/**
 * Get short month name from month number (1-12)
 */
export function getShortMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || '';
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Calculate percentage with safety for division by zero
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Get available years for rewind (from 2020 to current)
 */
export function getAvailableYears(): number[] {
  const currentYear = getCurrentYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 2020; year--) {
    years.push(year);
  }
  return years;
}
/**
 * Resolve IPFS URLs to use a public gateway
 * Handles ipfs:// protocol and rewrites potentially restricted private gateways
 */
export function resolveIpfsUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  // 1. Handle native ipfs:// protocol
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }

  // 2. Handle restricted/private gateways (like the user's Pinata issue)
  // If it's an HTTP URL containing /ipfs/, rewrite to public gateway
  // We exclude ipfs.io itself to avoid loops if we change defaults later
  if (url.includes('/ipfs/') && !url.includes('ipfs.io')) {
    const hashIndex = url.indexOf('/ipfs/');
    const hash = url.substring(hashIndex + 6);
    return `https://ipfs.io/ipfs/${hash}`;
  }

  return url;
}
