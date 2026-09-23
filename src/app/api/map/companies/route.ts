import { NextRequest, NextResponse } from "next/server";
import { initialCompaniesData } from "@/data/companiesData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get("sector");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let filtered = [...initialCompaniesData];

  if (sector) {
    filtered = filtered.filter((c) => c.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  if (category) {
    filtered = filtered.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameMr.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.connectedRoadName.toLowerCase().includes(q) ||
        c.products.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    status: "success",
    count: filtered.length,
    totalDailyFreightTrucks: filtered.reduce((acc, c) => acc + c.dailyTrucks, 0),
    totalEmployees: filtered.reduce((acc, c) => acc + c.employees, 0),
    data: filtered,
  });
}
