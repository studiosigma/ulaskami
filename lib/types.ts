export type RoutingMode = "smart_filter" | "direct";

export interface Plate {
  id: string;
  code: string; // Format: ULK-XXXXXX
  businessName: string;
  googleReviewUrl: string;
  isActive: boolean;
  scanCount: number;
  routingMode?: RoutingMode; // 'smart_filter' (bintang 1-5 filter) atau 'direct' (langsung ke Google)
  feedbackWhatsapp?: string; // Nomor WhatsApp pengaduan untuk rating 1-3
  minGoogleRating?: number; // Ambang batas minimum untuk diarahkan ke Google Review (default: 4)
  ownerEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScanLog {
  id: string;
  plateCode: string;
  userAgent?: string;
  ipHash?: string;
  timestamp: string;
}

export interface ActivatePlateInput {
  code: string;
  businessName: string;
  googleReviewUrl: string;
  routingMode?: RoutingMode;
  feedbackWhatsapp?: string;
  minGoogleRating?: number;
  ownerEmail?: string;
}

export interface UpdatePlateInput {
  code: string;
  googleReviewUrl: string;
  businessName?: string;
  routingMode?: RoutingMode;
  feedbackWhatsapp?: string;
  minGoogleRating?: number;
}

export interface MerchantRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface DailyScanPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Sen 28/09"
  count: number;
}

export interface HourlyPeakPoint {
  hour: number; // 0 - 23
  label: string; // e.g. "12:00"
  count: number;
  isPeak: boolean;
}

export interface DeviceBreakdown {
  ios: number;
  android: number;
  other: number;
  total: number;
  iosPercentage: number;
  androidPercentage: number;
  otherPercentage: number;
}

export interface PlateAnalytics {
  plateCode: string;
  businessName: string;
  totalScans: number;
  scansLast7Days: number;
  scansLast30Days: number;
  averageDailyScans: number;
  dailyTrends: DailyScanPoint[];
  hourlyPeaks: HourlyPeakPoint[];
  busiestHour: {
    hour: number;
    label: string;
    count: number;
  };
  deviceBreakdown: DeviceBreakdown;
}

