import { NextRequest, NextResponse } from "next/server";
import { initialRoadsData } from "@/data/roadsData";
import { initialProjectsData } from "@/data/projectsData";
import { initialTrafficData } from "@/data/trafficData";
import { initialJurisdictionsData } from "@/data/jurisdictionsData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("authority"); // 'NHAI' | 'PWD' | 'MIDC' | 'PMRDA' | 'GramPanchayat'
  const type = searchParams.get("type"); // 'roads' | 'traffic' | 'projects' | 'jurisdictions'

  const features: any[] = [];

  // 0. Highlighted Jurisdiction Wards & Areas (Polygons)
  if (!type || type === "jurisdictions" || type === "wards") {
    let wards = [...initialJurisdictionsData];
    if (authority) {
      wards = wards.filter((w) => w.authority.toLowerCase() === authority.toLowerCase());
    }

    wards.forEach((ward) => {
      // GeoJSON polygon coordinates are [lng, lat] and must be closed
      const polygonLngLat = ward.polygon.map(([lat, lng]) => [lng, lat]);
      // Ensure closed ring
      if (
        polygonLngLat[0][0] !== polygonLngLat[polygonLngLat.length - 1][0] ||
        polygonLngLat[0][1] !== polygonLngLat[polygonLngLat.length - 1][1]
      ) {
        polygonLngLat.push([...polygonLngLat[0]]);
      }

      features.push({
        type: "Feature",
        id: ward.id,
        geometry: {
          type: "Polygon",
          coordinates: [polygonLngLat],
        },
        properties: {
          layer: "jurisdiction_wards",
          name: ward.name,
          nameMr: ward.nameMr,
          wardLabel: ward.wardLabel,
          authority: ward.authority,
          activeIssuesCount: ward.activeIssuesCount,
          resolvedIssuesCount: ward.resolvedIssuesCount,
          totalBudgetCr: ward.totalBudgetCr,
          population: ward.population,
          aiActionBrief: ward.aiActionBrief,
        },
      });
    });
  }

  // 1. Roads & Highways (Categorized by Authority)
  if (!type || type === "roads" || type === "highways") {
    let roads = [...initialRoadsData];
    if (authority) {
      roads = roads.filter((r) => r.authority.toLowerCase() === authority.toLowerCase());
    }

    roads.forEach((road) => {
      const lineLngLat = road.coordinates.map(([lat, lng]) => [lng, lat]);
      features.push({
        type: "Feature",
        id: road.id,
        geometry: {
          type: "LineString",
          coordinates: lineLngLat,
        },
        properties: {
          layer: "roads",
          name: road.name,
          nameMr: road.nameMr,
          authority: road.authority,
          highwayCode: road.highwayCode || null,
          lengthKm: road.lengthKm,
          lanes: road.lanes,
          condition: road.currentCondition,
          workStatus: road.workStatus,
          progressPercent: road.progressPercent,
          contractor: road.contractor,
          officerContact: road.officerContact,
        },
      });
    });
  }

  // 2. Traffic Bottlenecks
  if (!type || type === "traffic") {
    initialTrafficData.forEach((tp) => {
      features.push({
        type: "Feature",
        id: tp.id,
        geometry: {
          type: "Point",
          coordinates: [tp.location[1], tp.location[0]],
        },
        properties: {
          layer: "traffic",
          name: tp.name,
          nameMr: tp.nameMr,
          severity: tp.severity,
          avgDelayMinutes: tp.avgDelayMinutes,
          peakHours: tp.peakHours,
          cause: tp.cause,
          alternateRoute: tp.alternateRoute,
        },
      });
    });
  }

  // 3. Infrastructure Projects
  if (!type || type === "projects") {
    let projs = [...initialProjectsData];
    if (authority) {
      projs = projs.filter((p) => p.authority.toLowerCase() === authority.toLowerCase());
    }

    projs.forEach((proj) => {
      features.push({
        type: "Feature",
        id: proj.id,
        geometry: {
          type: "Point",
          coordinates: [proj.coordinates[1], proj.coordinates[0]],
        },
        properties: {
          layer: "projects",
          name: proj.name,
          nameMr: proj.nameMr,
          authority: proj.authority,
          category: proj.category,
          status: proj.status,
          progressPercent: proj.progressPercent,
          budgetCr: proj.budgetCr,
          spentCr: proj.spentCr,
          contractor: proj.contractor,
        },
      });
    });
  }

  return NextResponse.json(
    {
      type: "FeatureCollection",
      metadata: {
        title: "Chakan Authority GIS GeoJSON Export",
        region: "Chakan - Bhosari - Manchar - Shikrapur - Talegaon",
        crs: "urn:ogc:def:crs:OGC:1.3:CRS84",
        totalFeatures: features.length,
        timestamp: new Date().toISOString(),
      },
      features,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/geo+json",
      },
    }
  );
}
