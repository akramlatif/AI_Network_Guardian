import { NextResponse } from 'next/server';

export async function GET() {
    const threatsData = [
        { id: 1, type: "DDoS Attempt", sourceIp: "192.168.1.100", targetIp: "10.0.0.5", severity: "High", timestamp: new Date().toISOString() },
        { id: 2, type: "SQL Injection", sourceIp: "203.0.113.50", targetIp: "10.0.0.12", severity: "Critical", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: 3, type: "Port Scan", sourceIp: "198.51.100.22", targetIp: "10.0.0.254", severity: "Low", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: 4, type: "Malware Signature", sourceIp: "192.0.2.1", targetIp: "10.0.0.100", severity: "Medium", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        { id: 5, type: "Brute Force SSH", sourceIp: "198.51.100.44", targetIp: "10.0.0.2", severity: "High", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    ];

    return NextResponse.json(threatsData);
}
