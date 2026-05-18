import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') ?? 'FanHub26';
  const sub = searchParams.get('sub') ?? 'Vivez la Coupe du Monde 2026 au Canada';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0f172a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245,158,11,0.2)',
            border: '1px solid rgba(245,158,11,0.5)',
            borderRadius: '100px',
            padding: '8px 20px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '20px' }}>⚽</span>
          <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 600, letterSpacing: '2px' }}>
            FIFA WORLD CUP 2026
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: title.length > 40 ? '44px' : '56px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
            marginBottom: '16px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: 'rgba(148,163,184,1)',
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          {sub}
        </div>

        {/* Logo */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: '#1d4ed8',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              padding: '6px 14px',
              color: 'white',
              fontWeight: 800,
              fontSize: '20px',
            }}
          >
            FanHub26
          </div>
          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '16px' }}>fanhub26.ca</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
