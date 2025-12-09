import { NextRequest, NextResponse } from 'next/server';
import { generateNftMetadata, generateImageUrl } from '@/lib/nft';
import type { AvalancheRewind } from '@/lib/types';

/**
 * API Route: Upload NFT Metadata to IPFS
 * 
 * Complete flow:
 * 1. Receive rewind data
 * 2. Generate image URL (or fetch and upload to IPFS)
 * 3. Generate metadata JSON
 * 4. Upload metadata to IPFS via Pinata
 * 5. Return the IPFS metadata URI
 * 
 * POST /api/upload-metadata
 * Body: { rewind: AvalancheRewind }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rewind } = body as { rewind: AvalancheRewind };

    // Validate input
    if (!rewind || !rewind.address || !rewind.year) {
      return NextResponse.json(
        { error: 'Invalid rewind data provided' },
        { status: 400 }
      );
    }

    // Get base URL for image generation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get('origin') || 
                    'http://localhost:3000';

    // Check if Pinata is configured
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;
    const isPinataConfigured = Boolean(pinataApiKey && pinataSecretKey);

    let imageIpfsUrl: string;
    let metadataUri: string;

    if (isPinataConfigured) {
      // ============ PRODUCTION: Upload to IPFS via Pinata ============
      
      // Step 1: Generate and fetch the image
      const imageUrl = generateImageUrl(rewind, baseUrl);
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error('Failed to generate image');
      }

      const imageBlob = await imageResponse.blob();
      const imageBuffer = await imageBlob.arrayBuffer();

      // Step 2: Upload image to IPFS via Pinata
      const imageFormData = new FormData();
      imageFormData.append('file', new Blob([imageBuffer], { type: 'image/png' }), `rewind-${rewind.address}-${rewind.year}.png`);
      imageFormData.append('pinataMetadata', JSON.stringify({
        name: `Avalanche Rewind ${rewind.year} - ${rewind.address.slice(0, 8)}`,
      }));

      const imageUploadResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey!,
          'pinata_secret_api_key': pinataSecretKey!,
        },
        body: imageFormData,
      });

      if (!imageUploadResponse.ok) {
        const errorText = await imageUploadResponse.text();
        throw new Error(`Failed to upload image to IPFS: ${errorText}`);
      }

      const imageData = await imageUploadResponse.json();
      imageIpfsUrl = `ipfs://${imageData.IpfsHash}`;

      // Step 3: Generate metadata with IPFS image URL
      const metadata = generateNftMetadata(rewind, imageIpfsUrl);

      // Step 4: Upload metadata JSON to IPFS
      const metadataUploadResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey!,
          'pinata_secret_api_key': pinataSecretKey!,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `Avalanche Rewind ${rewind.year} Metadata - ${rewind.address.slice(0, 8)}`,
          },
        }),
      });

      if (!metadataUploadResponse.ok) {
        const errorText = await metadataUploadResponse.text();
        throw new Error(`Failed to upload metadata to IPFS: ${errorText}`);
      }

      const metadataData = await metadataUploadResponse.json();
      metadataUri = `ipfs://${metadataData.IpfsHash}`;

      console.log('NFT assets uploaded to IPFS:', {
        imageIpfsUrl,
        metadataUri,
      });

    } else {
      // ============ DEMO MODE: Use placeholder URIs ============
      console.warn('Pinata not configured - using demo metadata URI');
      
      // Generate a deterministic demo URI based on address and year
      const demoHash = `Qm${Buffer.from(`${rewind.address}-${rewind.year}`).toString('base64').slice(0, 44)}`;
      imageIpfsUrl = `ipfs://${demoHash}-image`;
      metadataUri = `ipfs://${demoHash}-metadata`;

      // Log what would have been uploaded
      const imageUrl = generateImageUrl(rewind, baseUrl);
      const metadata = generateNftMetadata(rewind, imageIpfsUrl);
      
      console.log('Demo mode - would upload:', {
        imageUrl,
        metadata,
        metadataUri,
      });
    }

    return NextResponse.json({
      success: true,
      metadataUri,
      imageIpfsUrl,
      isPinataConfigured,
    });

  } catch (error) {
    console.error('Upload metadata error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload metadata',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing/preview
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const year = searchParams.get('year');

  if (!address || !year) {
    return NextResponse.json({
      message: 'Avalanche Rewind Metadata Upload API',
      usage: 'POST /api/upload-metadata with { rewind: AvalancheRewind }',
      preview: 'GET /api/upload-metadata?address=0x...&year=2025',
      pinataConfigured: Boolean(process.env.PINATA_API_KEY),
    });
  }

  // Generate preview image URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  request.headers.get('origin') || 
                  'http://localhost:3000';
  
  const imageUrl = `${baseUrl}/api/generate-image?address=${address}&year=${year}&persona=Avalanche%20Explorer&emoji=🏔️&transactions=100&volume=$10,000&nfts=5&activeDays=30`;

  return NextResponse.json({
    previewImageUrl: imageUrl,
    pinataConfigured: Boolean(process.env.PINATA_API_KEY),
    note: 'Visit the previewImageUrl to see the generated image',
  });
}
