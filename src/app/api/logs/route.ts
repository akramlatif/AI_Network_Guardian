import { NextResponse } from 'next/server';

export async function GET() {
    const logsData = [
        { id: 1, message: "System firewall updated successfully.", level: "info", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
        { id: 2, message: "Blocked multiple invalid SSH login attempts from 198.51.100.44.", level: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
        { id: 3, message: "Detected unusual outbound traffic from internal server 10.0.0.15. Isolating host.", level: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
        { id: 4, message: "Nightly backup completed with no errors.", level: "info", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
        { id: 5, message: "Intrusion Detection System (IDS) signature database updated.", level: "info", timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
        { id: 6, message: "High CPU usage detected on Node 3.", level: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 350).toISOString() },
    ];

    return NextResponse.json(logsData);
}
