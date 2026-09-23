import { NextRequest, NextResponse } from "next/server";
import { initialRoadsData } from "@/data/roadsData";
import { initialProjectsData } from "@/data/projectsData";
import { initialTrafficData } from "@/data/trafficData";
import { initialCitizenReportsData } from "@/data/citizenReportsData";
import { initialJurisdictionsData } from "@/data/jurisdictionsData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const layer = searchParams.get("layer");

  // Regional Cardinal Bounding Coordinates (Bhosari - Manchar - Shikrapur - Talegaon)
  const regions = [
    {
      id: "REG-CHAKAN",
      name: "Chakan Central Hub",
      nameMr: "चाकण मध्यवर्ती केंद्र",
      role: "Central Core (Manik Chowk)",
      coordinates: [18.7615, 73.8588],
      bounds: { south: 18.72, north: 18.80, west: 73.78, east: 73.88 },
      authority: "PWD / MIDC",
    },
    {
      id: "REG-BHOSARI",
      name: "Bhosari / Moshi (South Gateway)",
      nameMr: "भोसरी / मोशी (दक्षिण हद्द - PCMC)",
      role: "South Anchor (NH-60 to Pune / PCMC)",
      coordinates: [18.6650, 73.8580],
      highwayConnection: "NH-60",
      authority: "NHAI",
    },
    {
      id: "REG-MANCHAR",
      name: "Manchar & Rajgurunagar (North Corridor)",
      nameMr: "मंचर व राजगुरुनगर (उत्तर कॉरिडॉर)",
      role: "North Anchor (NH-60 to Nashik)",
      coordinates: [19.0050, 73.9450],
      highwayConnection: "NH-60",
      authority: "NHAI",
    },
    {
      id: "REG-SHIKRAPUR",
      name: "Shikrapur Junction & Pabal (East Corridor)",
      nameMr: "शिक्रापूर चौक व पाबळ (पूर्व कॉरिडॉर)",
      role: "East Anchor (SH-55 to Pune-Nagar Highway)",
      coordinates: [18.7200, 74.1200],
      highwayConnection: "SH-55",
      authority: "PWD / NHAI",
    },
    {
      id: "REG-TALEGAON",
      name: "Talegaon Dabhade & MIDC (West Corridor)",
      nameMr: "तळेगाव दाभाडे व MIDC (पश्चिम कॉरिडॉर)",
      role: "West Anchor (SH-55 to Mumbai-Pune Expressway)",
      coordinates: [18.7380, 73.7150],
      highwayConnection: "SH-55",
      authority: "PWD / MIDC",
    },
  ];

  // If format=geojson requested, return standard GeoJSON FeatureCollection
  if (format === "geojson") {
    const features: any[] = [];

    // 1. Road Segments & Highways (Colored strictly by Authority)
    if (!layer || layer === "roads" || layer === "highways") {
      initialRoadsData.forEach((road) => {
        const lineLngLat = road.coordinates.map(([lat, lng]) => [lng, lat]);
        features.push({
          type: "Feature",
          id: road.id,
          geometry: {
            type: "LineString",
            coordinates: lineLngLat,
          },
          properties: {
            layerType: "road_segment",
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
    if (!layer || layer === "traffic") {
      initialTrafficData.forEach((tp) => {
        features.push({
          type: "Feature",
          id: tp.id,
          geometry: {
            type: "Point",
            coordinates: [tp.location[1], tp.location[0]],
          },
          properties: {
            layerType: "traffic_bottleneck",
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
    if (!layer || layer === "projects") {
      initialProjectsData.forEach((proj) => {
        features.push({
          type: "Feature",
          id: proj.id,
          geometry: {
            type: "Point",
            coordinates: [proj.coordinates[1], proj.coordinates[0]],
          },
          properties: {
            layerType: "infrastructure_project",
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

    return NextResponse.json({
      type: "FeatureCollection",
      metadata: {
        title: "Chakan Authority Infrastructure GIS Dataset",
        region: "Chakan - Bhosari - Manchar - Shikrapur - Talegaon",
        crs: "urn:ogc:def:crs:OGC:1.3:CRS84",
        generatedAt: new Date().toISOString(),
        totalFeatures: features.length,
      },
      features,
    });
  }

  // Default Standard JSON Response
  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    tileProvider: "OpenStreetMap (100% Free - Zero API Key Required)",
    regionCoverage: {
      center: { lat: 18.7600, lng: 73.8450 },
      cardinalNodes: {
        centerHub: "Chakan Manik Chowk (NH-60 & SH-55)",
        south: "Bhosari / Moshi (PCMC border)",
        north: "Manchar & Rajgurunagar (Khed)",
        east: "Shikrapur Junction & Pabal",
        west: "Talegaon Dabhade & Talegaon MIDC",
      },
      regions,
    },
    authorityColorCodes: {
      NHAI: { color: "#ef4444", name: "National Highways Authority of India (NH-60)" },
      PWD: { color: "#10b981", name: "Public Works Department (SH-55 & SH-112)" },
      MIDC: { color: "#f97316", name: "Maharashtra Industrial Development Corporation (Spine Roads)" },
      PMRDA: { color: "#3b82f6", name: "Pune Metropolitan Region Development Authority (Ring Connectors)" },
      GramPanchayat: { color: "#a855f7", name: "Gram Panchayat (Rural Village Connectors)" },
    },
    layers: {
      byAuthority: {
        NHAI: initialRoadsData.filter((r) => r.authority === "NHAI"),
        PWD: initialRoadsData.filter((r) => r.authority === "PWD"),
        MIDC: initialRoadsData.filter((r) => r.authority === "MIDC"),
        PMRDA: initialRoadsData.filter((r) => r.authority === "PMRDA"),
        GramPanchayat: initialRoadsData.filter((r) => r.authority === "GramPanchayat"),
      },
      highways: {
        NH60: initialRoadsData.filter((r) => r.highwayCode === "NH-60"),
        SH55: initialRoadsData.filter((r) => r.highwayCode === "SH-55"),
        SH112: initialRoadsData.filter((r) => r.highwayCode === "SH-112"),
      },
      roadSegments: {
        totalLengthKm: initialRoadsData.reduce((sum, r) => sum + r.lengthKm, 0),
        count: initialRoadsData.length,
        data: initialRoadsData,
      },
      projects: {
        count: initialProjectsData.length,
        data: initialProjectsData,
      },
      trafficBottlenecks: {
        count: initialTrafficData.length,
        data: initialTrafficData,
      },
      jurisdictions: {
        count: initialJurisdictionsData.length,
        data: initialJurisdictionsData,
      },
      citizenReports: {
        count: initialCitizenReportsData.length,
        data: initialCitizenReportsData,
      },
    },
    endpoints: {
      allMapData: "/api/map",
      geoJsonExport: "/api/map?format=geojson",
      jurisdictionsGeoJson: "/api/map/geojson?type=jurisdictions",
      roadsApi: "/api/map/roads",
      highwaysApi: "/api/map/roads?highway=NH-60",
      trafficApi: "/api/map/traffic",
      regionsApi: "/api/map/regions",
      geoJsonDedicated: "/api/map/geojson",
    },
  });
}
