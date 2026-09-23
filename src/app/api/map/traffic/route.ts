import { NextRequest, NextResponse } from "next/server";
import { initialTrafficData } from "@/data/trafficData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get("severity");
  const blackspotOnly = searchParams.get("blackspot");

  let filtered = [...initialTrafficData];

  if (severity) {
    filtered = filtered.filter((t) => t.severity.toLowerCase() === severity.toLowerCase());
  }

  if (blackspotOnly === "true") {
    filtered = filtered.filter((t) => t.isAccidentBlackspot);
  }

  return NextResponse.json({
    status: "success",
    count: filtered.length,
    criticalCount: filtered.filter((t) => t.severity === "Critical").length,
    highCount: filtered.filter((t) => t.severity === "High").length,
    accidentBlackspots: filtered.filter((t) => t.isAccidentBlackspot).length,
    data: filtered,
  });
}
