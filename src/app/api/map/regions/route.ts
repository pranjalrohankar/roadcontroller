import { NextResponse } from "next/server";

export async function GET() {
  const regions = [
    {
      id: "REG-CHAKAN",
      name: "Chakan Central Industrial Hub",
      nameMr: "चाकण मध्यवर्ती औद्योगिक केंद्र",
      role: "Central Core / MIDC Phase 1-4 Hub",
      coordinates: [18.7615, 73.8588],
      highways: ["NH-60", "SH-55", "SH-112"],
      keyLandmarks: [
        "Chakan Manik Chowk",
        "Ambethan Chowk",
        "MIDC Phase 2 Vasuli",
        "Mahalunge Hub",
        "Kharabwadi Gate",
        "Nanekarwadi",
      ],
      description: "Heart of India's premier automotive and engineering corridor.",
    },
    {
      id: "REG-BHOSARI",
      name: "Bhosari / Moshi (South Gateway)",
      nameMr: "भोसरी / मोशी (दक्षिण हद्द - PCMC)",
      role: "South Anchor linking Pune & PCMC Municipal Corporation",
      coordinates: [18.6650, 73.8580],
      highways: ["NH-60 (Pune-Nashik Highway)"],
      keyLandmarks: [
        "Moshi Toll Plaza",
        "Bhosari MIDC",
        "Chimbali Phata",
        "Tata Motors Logistics Corridor",
      ],
      description: "Southern gateway connecting Chakan to Pune city, Bhosari industrial belt, and PCMC.",
    },
    {
      id: "REG-MANCHAR",
      name: "Manchar & Rajgurunagar (North Corridor)",
      nameMr: "मंचर व राजगुरुनगर (उत्तर कॉरिडॉर)",
      role: "North Anchor linking Khed taluka & Nashik Highway",
      coordinates: [19.0050, 73.9450],
      highways: ["NH-60 (Nashik Corridor)"],
      keyLandmarks: [
        "Rajgurunagar (Khed) ST Stand",
        "Peth Phata",
        "Manchar Bus Stand",
        "Ghodegaon Link",
      ],
      description: "Northern agricultural and agro-processing arterial corridor towards Nashik.",
    },
    {
      id: "REG-SHIKRAPUR",
      name: "Shikrapur Junction & Pabal (East Corridor)",
      nameMr: "शिक्रापूर चौक व पाबळ (पूर्व कॉरिडॉर)",
      role: "East Anchor linking Pune-Ahmednagar State Highway",
      coordinates: [18.7200, 74.1200],
      highways: ["SH-55 (Chakan-Shikrapur Elevated Highway)"],
      keyLandmarks: [
        "Pabal Phata",
        "Mutkewadi",
        "Bahul",
        "Shelgaon",
        "Shikrapur Junction (Nagar Road)",
      ],
      description: "Eastern logistics corridor connecting heavy container traffic to Pune-Nagar highway and Sanaswadi MIDC.",
    },
    {
      id: "REG-TALEGAON",
      name: "Talegaon Dabhade & MIDC (West Corridor)",
      nameMr: "तळेगाव दाभाडे व MIDC (पश्चिम कॉरिडॉर)",
      role: "West Anchor linking Mumbai-Pune Expressway & NH-48",
      coordinates: [18.7380, 73.7150],
      highways: ["SH-55 (Chakan-Talegaon 4-Lane Highway)"],
      keyLandmarks: [
        "Talegaon MIDC",
        "Talegaon Dabhade Station",
        "JCB & Schindler Manufacturing Zone",
        "Sudumbre",
        "NH-48 Expressway Connector",
      ],
      description: "Western heavy logistics artery linking Chakan manufacturing plants directly to JNPT Port and Mumbai-Pune Expressway.",
    },
  ];

  return NextResponse.json({
    status: "success",
    count: regions.length,
    coverageAreaKm2: 450,
    center: { lat: 18.7600, lng: 73.8450 },
    regions,
  });
}
