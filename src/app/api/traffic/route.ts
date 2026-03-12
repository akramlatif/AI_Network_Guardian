import { NextResponse } from 'next/server';

export async function GET() {
  const trafficData = {
    totalPacketsAnalyzed: 15420394,
    currentlyBlockedThreats: 342,
    activeConnections: 1250,
    networkLoad: "78%",
    status: "Normal",
    history: [
      { time: "00:00", packets: 120000 },
      { time: "04:00", packets: 150000 },
      { time: "08:00", packets: 340000 },
      { time: "12:00", packets: 420000 },
      { time: "16:00", packets: 380000 },
      { time: "20:00", packets: 210000 },
    ],
  };

  return NextResponse.json(trafficData);
}
