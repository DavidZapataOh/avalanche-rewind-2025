import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/**
 * API Route: Generate Rewind Card Image
 * 
 * Creates a beautiful, Instagram-worthy image for the user's Rewind
 * This image will be uploaded to IPFS and used as the NFT image
 * 
 * GET /api/generate-image?address=0x...&year=2025&persona=Summit%20Builder&emoji=🏗️&transactions=150&volume=25000&nfts=12&activeDays=89
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract parameters
        const address = searchParams.get('address') || '0x0000...0000';
        const year = searchParams.get('year') || '2025';
        const persona = searchParams.get('persona') || 'Avalanche Explorer';
        const emoji = searchParams.get('emoji') || '🏔️';
        const transactions = searchParams.get('transactions') || '0';
        const volume = searchParams.get('volume') || '$0';
        const nfts = searchParams.get('nfts') || '0';
        const activeDays = searchParams.get('activeDays') || '0';

        // Format address for display
        const shortAddress = address.length > 10
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : address;

        // Generate the image using Next.js ImageResponse (OG Image)
        const imageResponse = new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #050816 0%, #0a0f1f 50%, #1a0a1e 100%)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background glow effects */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-20%',
                            left: '-10%',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(232, 65, 66, 0.3) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-20%',
                            right: '-10%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }}
                    />

                    {/* Main card container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '60px',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {/* Brand header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <span style={{ fontSize: '24px', color: '#E84142', fontWeight: 600 }}>
                                ✨ AVALANCHE REWIND ✨
                            </span>
                        </div>

                        {/* Big Year */}
                        <div
                            style={{
                                fontSize: '180px',
                                fontWeight: 900,
                                color: 'white',
                                lineHeight: 1,
                                marginBottom: '20px',
                                textShadow: '0 0 80px rgba(232, 65, 66, 0.5)',
                            }}
                        >
                            {year}
                        </div>

                        {/* Persona */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '40px',
                            }}
                        >
                            <span style={{ fontSize: '60px' }}>{emoji}</span>
                            <span
                                style={{
                                    fontSize: '42px',
                                    fontWeight: 700,
                                    color: 'white',
                                }}
                            >
                                {persona}
                            </span>
                        </div>

                        {/* Stats grid */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '40px',
                                marginBottom: '40px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 32px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <span style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>
                                    {transactions}
                                </span>
                                <span style={{ fontSize: '16px', color: '#9CA3AF' }}>Transactions</span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 32px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <span style={{ fontSize: '36px', fontWeight: 700, color: '#10B981' }}>
                                    {volume}
                                </span>
                                <span style={{ fontSize: '16px', color: '#9CA3AF' }}>Volume</span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 32px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <span style={{ fontSize: '36px', fontWeight: 700, color: '#8B5CF6' }}>
                                    {nfts}
                                </span>
                                <span style={{ fontSize: '16px', color: '#9CA3AF' }}>NFTs</span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '24px 32px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <span style={{ fontSize: '36px', fontWeight: 700, color: '#E84142' }}>
                                    {activeDays}
                                </span>
                                <span style={{ fontSize: '16px', color: '#9CA3AF' }}>Active Days</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px 32px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '100px',
                                marginBottom: '20px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '24px',
                                    fontFamily: 'monospace',
                                    color: '#9CA3AF',
                                }}
                            >
                                {shortAddress}
                            </span>
                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#6B7280',
                                fontSize: '18px',
                            }}
                        >
                            <span>🏔️</span>
                            <span>avalanche-rewind.xyz</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 1200, // Square format for Instagram
            }
        );

        return imageResponse;
    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
