export type Authority = 'PWD' | 'PMRDA' | 'MIDC' | 'NHAI' | 'GramPanchayat';

export type ProjectStatus =
  | 'Proposed'
  | 'Approved'
  | 'Tender Released'
  | 'Work Started'
  | 'In Progress'
  | '25% Completed'
  | '50% Completed'
  | '75% Completed'
  | 'Completed'
  | 'Delayed'
  | 'On Hold';

export type RoadCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical Potholes';

export type TrafficSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type CitizenReportCategory =
  | 'Potholes'
  | 'Traffic'
  | 'Waterlogging'
  | 'Garbage'
  | 'Illegal Parking'
  | 'Encroachment'
  | 'Street Light Failure'
  | 'Signal Issue'
  | 'Water Supply Issue'
  | 'Other';

export type ReportStatus = 'Reported' | 'Community Verified' | 'Assigned' | 'In Progress' | 'Resolved';

export type Role =
  | 'Citizen'
  | 'Industry'
  | 'Officer_PWD'
  | 'Officer_MIDC'
  | 'Officer_NHAI'
  | 'Officer_PMRDA'
  | 'Officer_GP'
  | 'Collector_Admin';

export type Language = 'mr' | 'en';

export interface ProjectOfficer {
  name: string;
  nameMr: string;
  designation: string;
  designationMr: string;
  department: Authority;
  phone: string;
  email: string;
  officeLocation: string;
  officeLocationMr: string;
}

export interface TenderDetails {
  tenderId: string;
  sanctionDate: string;
  estimatedCostCr: number;
  actualCostCr: number;
  contractorName: string;
  contractorNameMr: string;
  workOrderNumber: string;
  dprNumber: string;
}

export interface ProjectMedia {
  id: string;
  type: 'photo' | 'drone' | 'document';
  url: string;
  title: string;
  titleMr: string;
  date: string;
  caption?: string;
  captionMr?: string;
}

export interface Project {
  id: string; // e.g. CHK-ROAD-001
  name: string;
  nameMr: string;
  description: string;
  descriptionMr: string;
  authority: Authority;
  category: 'Road' | 'Flyover' | 'Drainage' | 'Water' | 'Signal' | 'Bridge' | 'Industrial';
  categoryMr: string;
  status: ProjectStatus;
  progressPercent: number;
  budgetCr: number;
  spentCr: number;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  locationName: string;
  locationNameMr: string;
  coordinates: [number, number]; // [lat, lng]
  polyline?: [number, number][];
  contractor: string;
  contractorMr: string;
  tender: TenderDetails;
  officer: ProjectOfficer;
  media: ProjectMedia[];
  beforeImage?: string;
  afterImage?: string;
  droneImage?: string;
  delayReason?: string;
  delayReasonMr?: string;
  // Detailed Status Analytics
  pendingReason?: string;
  pendingReasonMr?: string;
  responsibleAgency?: string;
  responsibleAgencyMr?: string;
  approvedBudgetCr?: number;
  processStartObstacles?: string;
  processStartObstaclesMr?: string;
  estimatedRemainingDays?: number;
  currentWorkStage?: string;
  currentWorkStageMr?: string;
  qualityChecksDone?: {
    testName: string;
    testNameMr: string;
    result: string;
    resultMr: string;
    agency: string;
    status: 'Passed' | 'Compliant' | 'Certified';
  }[];
  budgetUsedCr?: number;
  workPeriodMonths?: number;
  workPeriodFormatted?: string;
  workPeriodFormattedMr?: string;
  milestones: {
    title: string;
    titleMr: string;
    targetDate: string;
    completedDate?: string;
    status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  }[];
  updates: {
    date: string;
    author: string;
    authorRole: string;
    text: string;
    textMr: string;
  }[];
}

export interface IndustrialCompany {
  id: string;
  name: string;
  nameMr: string;
  category: 'Automotive OEM' | 'Heavy Engineering' | 'Auto Components' | 'Energy & Petroleum' | 'Packaging & Logistics';
  categoryMr: string;
  brandColor: string; // Hex color for polygons & road highlight
  brandColorDark: string;
  sector: string;
  sectorMr: string;
  plotNumber: string;
  connectedRoadName: string;
  connectedRoadNameMr: string;
  dailyTrucks: number;
  employees: number;
  products: string;
  productsMr: string;
  coordinates: [number, number]; // Main Gate [lat, lng]
  plotPolygon: [number, number][]; // Facility footprint under/along road
  roadAccessPolyline?: [number, number][]; // Road segment directly serving the plant
}

export interface RoadSegment {
  id: string;
  name: string;
  nameMr: string;
  fromNode: string;
  fromNodeMr: string;
  toNode: string;
  toNodeMr: string;
  authority: Authority;
  lengthKm: number;
  lanes: number;
  currentCondition: RoadCondition;
  workStatus: ProjectStatus;
  progressPercent: number;
  colorCode: 'Green' | 'Yellow' | 'Red' | 'Grey' | 'Blue';
  coordinates: [number, number][];
  lastInspectedDate: string;
  contractor: string;
  officerContact: string;
  criticalIssuesCount: number;
  highwayCode?: string; // e.g. "NH-60", "SH-55", "SH-112"
  companyTag?: string; // Name of the company this road segment primarily serves
  companyColor?: string; // Brand color for rendering under/along the road
}


export interface TrafficBottleneck {
  id: string;
  name: string;
  nameMr: string;
  location: [number, number];
  severity: TrafficSeverity;
  avgDelayMinutes: number;
  peakHours: string;
  peakHoursMr: string;
  cause: string;
  causeMr: string;
  affectedCorridor: string;
  affectedCorridorMr: string;
  alternateRoute: string;
  alternateRouteMr: string;
  isAccidentBlackspot: boolean;
  blackspotRemediationStatus: 'Pending' | 'Work In Progress' | 'Remediated';
  signalStatus: 'Operational' | 'Smart AI Sync' | 'Needs Repair' | 'No Signal';
}

export interface CitizenReport {
  id: string;
  title: string;
  titleMr: string;
  category: CitizenReportCategory;
  categoryMr: string;
  description: string;
  descriptionMr: string;
  landmark: string;
  landmarkMr: string;
  coordinates: [number, number];
  photoUrl?: string;
  resolvedPhotoUrl?: string;
  reportedBy: string;
  reportedAt: string;
  status: ReportStatus;
  upvotes: number;
  assignedAuthority: Authority;
  assignedOfficerName?: string;
  officialRemarks?: string;
  officialRemarksMr?: string;
  resolvedAt?: string;
  userHasUpvoted?: boolean;
  // Authentic Field Work & Quality Audit Info
  workDoneSummary?: string;
  workDoneSummaryMr?: string;
  qualityAuditDetails?: {
    auditAgency: string;
    auditAgencyMr: string;
    testPerformed: string;
    testPerformedMr: string;
    qualityGrade: 'A+ High Grade' | 'A Grade Standard' | 'Verified' | 'Pending Audit';
    certificateNo: string;
    auditDate: string;
  };
  communityFeedback?: {
    citizenName: string;
    comment: string;
    commentMr: string;
    rating: number; // 1-5
    date: string;
    verifiedResident: boolean;
  }[];
}

export interface DailyFieldUpdate {
  id: string;
  date: string;
  time: string;
  title: string;
  titleMr: string;
  location: string;
  locationMr: string;
  authority: Authority;
  category: string;
  engineerInCharge: string;
  engineerDesignation: string;
  workCompletedToday: string;
  workCompletedTodayMr: string;
  equipmentDeployed: string[];
  equipmentDeployedMr: string[];
  laborCount: number;
  photoUrl: string;
  status: 'On Schedule' | 'Accelerated' | 'Weather Interruption' | 'Material Delay';
  notes?: string;
  notesMr?: string;
}

export interface OfficialNewsRelease {
  id: string;
  publishDate: string;
  title: string;
  titleMr: string;
  department: Authority;
  departmentMr: string;
  category: 'Government Resolution (GR)' | 'Collector Order' | 'Tender Notification' | 'Traffic Diversion' | 'Taskforce Directive';
  referenceOrderNo: string;
  summary: string;
  summaryMr: string;
  fullText: string;
  fullTextMr: string;
  signatory: string;
  signatoryDesignation: string;
  documentUrl?: string;
  priority: 'High Alert' | 'Public Advisory' | 'Administrative Order';
}

export interface PromiseItem {
  id: string;
  title: string;
  titleMr: string;
  sourceMeeting: string;
  sourceMeetingMr: string;
  announcementDate: string;
  commitment: string;
  commitmentMr: string;
  responsibleAuthority: Authority;
  responsibleLeaderOrOfficer: string;
  responsibleLeaderOrOfficerMr: string;
  deadline: string;
  status: 'Fulfilled' | 'In Progress' | 'Delayed / Overdue' | 'Stalled';
  progressPercent: number;
  notes: string;
  notesMr: string;
  referenceDocumentUrl?: string;
}

export interface PublicDocument {
  id: string;
  title: string;
  titleMr: string;
  category: 'DPR' | 'Tender' | 'RTI Reply' | 'Meeting Minutes' | 'Government Resolution (GR)' | 'Audit Report';
  categoryMr: string;
  department: Authority;
  referenceNumber: string;
  publishDate: string;
  fileSize: string;
  summary: string;
  summaryMr: string;
  downloadUrl: string;
  relatedProjectId?: string;
}

export interface TimeMachineSnapshot {
  periodId: string;
  label: string;
  labelMr: string;
  year: number;
  quarter: string;
  summary: string;
  summaryMr: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  delayedProjectsCount: number;
  budgetSpentCr: number;
  trafficIndexScore: number; // 0 to 100
  roadQualityScore: number; // 0 to 100
  keyMilestoneAchieved: string;
  keyMilestoneAchievedMr: string;
}

export interface JurisdictionArea {
  id: string;
  name: string;
  nameMr: string;
  wardLabel: string;
  wardLabelMr: string;
  authority: Authority;
  coordinates: [number, number]; // center [lat, lng]
  polygon: [number, number][]; // boundary polygon
  activeIssuesCount: number;
  resolvedIssuesCount: number;
  activeProjectsCount: number;
  totalBudgetCr: number;
  population: number;
  topIssues: {
    title: string;
    titleMr: string;
    category: CitizenReportCategory;
    count: number;
  }[];
  aiActionBrief: {
    headline: string;
    headlineMr: string;
    summary: string;
    summaryMr: string;
    primaryDepartment: Authority;
    estimatedCostCr: number;
    timelineDays: number;
    keyActions: {
      action: string;
      actionMr: string;
      department: string;
      days: number;
    }[];
  };
}

export interface MapLayerConfig {
  pwdRoads: boolean;
  pmrdaRoads: boolean;
  midcRoads: boolean;
  nhaiRoads: boolean;
  gpRoads: boolean;
  jurisdictionAreas: boolean;
  companyCorridors: boolean;
  waterNetwork: boolean;
  drainageNetwork: boolean;
  trafficSignals: boolean;
  flyovers: boolean;
  ongoingProjects: boolean;
  citizenComplaints: boolean;
  industrialZones: boolean;
  futureProjects: boolean;
}


