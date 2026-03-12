import { NextResponse } from 'next/server';

export async function GET() {
    const classificationsData = [
        { type: "DDoS", percentage: 35, count: 1250, color: "#ef4444" },
        { type: "Phishing", percentage: 25, count: 890, color: "#f97316" },
        { type: "Malware", percentage: 20, count: 710, color: "#eab308" },
        { type: "SQL Injection", percentage: 15, count: 535, color: "#3b82f6" },
        { type: "Other", percentage: 5, count: 178, color: "#8b5cf6" },
    ];

    return NextResponse.json(classificationsData);
}
