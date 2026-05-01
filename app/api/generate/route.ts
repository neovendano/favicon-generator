import sharp from 'sharp';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const toIco = require('to-ico') as (buffers: Buffer[]) => Promise<Buffer>;

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { image } = (await request.json()) as { image: string; pro: boolean };

  const base64 = image.replace(/^data:image\/\w+;base64,/, '');
  const input = Buffer.from(base64, 'base64');

  const pngBuffers = await Promise.all(
    [16, 32, 48].map((size) =>
      sharp(input).resize(size, size).png().toBuffer()
    )
  );

  const ico = await toIco(pngBuffers);

  return new Response(new Uint8Array(ico), {
    headers: {
      'Content-Type': 'image/x-icon',
      'Content-Disposition': 'attachment; filename="favicon.ico"',
    },
  });
}