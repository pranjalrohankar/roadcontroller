import { NextRequest, NextResponse } from "next/server";
import { initialRoadsData } from "@/data/roadsData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("authority");
  const highway = searchParams.get("highway");
  const condition = searchParams.get("condition");
  const company = searchParams.get("company");
  const search = searchParams.get("search");

  let filtered = [...initialRoadsData];

  if (authority && authority !== "ALL") {
    filtered = filtered.filter((r) => r.authority.toLowerCase() === authority.toLowerCase());
  }

  if (highway) {
    filtered = filtered.filter((r) => r.highwayCode?.toLowerCase() === highway.toLowerCase());
  }

  if (condition) {
    filtered = filtered.filter((r) => r.currentCondition.toLowerCase() === condition.toLowerCase());
  }

  if (company) {
    filtered = filtered.filter((r) => r.companyTag?.toLowerCase().includes(company.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.nameMr.toLowerCase().includes(q) ||
        r.fromNode.toLowerCase().includes(q) ||
        r.toNode.toLowerCase().includes(q) ||
        r.contractor.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    status: "success",
    count: filtered.length,
    totalLengthKm: filtered.reduce((acc, r) => acc + r.lengthKm, 0),
    data: filtered,
  });
}
