import { writeFileSync, appendFileSync, mkdirSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

const LOG_DIR = "/tmp/browser-debug";
const LOG_FILE = `${LOG_DIR}/debug.log`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const line = `[${new Date().toISOString()}] ${JSON.stringify(body)}\n`;
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, line);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
