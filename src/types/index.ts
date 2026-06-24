export interface ApiError {
  message: string;
  status?: number;
}

export interface LoginCredentials {
  identifier: string;
  password:  string;
  role: 'admin' | 'attendee';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: 'admin' | 'attendee';
    email: string;
  };
}

export interface IssuePassRequest {
  fullName: string;
  phoneNumber: string;
}

export interface IssuePassResponse {
  passId?: string;
  attendeeId?: string;
  deliveryStatus?: string;
  whatsappMessageId?: string;
  message?: string;
}

export interface QrPayload {
  pid: string;
  aid: string;
  sid: string;
  exp?: number;
}

export interface QrToken {
  payload: QrPayload;
  signature: string;
}

export interface AttendancePass {
  passId: string;
  attendeeId: string;
  eventSessionId: string;
  barcodeFormat?: string;
  payloadVersion?: number;
  publicTokenHash?: string;
  issuedAt?: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  whatsappMessageId?: string | null;
  deliveryStatus?: string | null;
  createdAt?: string;
}

export interface CheckInRequest {
  payload: QrPayload;
  signature: string;
  scannerDeviceId?: string;
  deviceScanId?: string;
  source?: string;
}

export interface CheckInResponse {
  status?: string;
  attendeeName?: string;
  message?: string;
  alreadyCheckedIn?: boolean;
}

export interface BulkUploadResponse {
  jobId: string;
  message?: string;
}

export interface BulkUploadJob {
  jobId: string;
  status?: string;
  totalRows?: number;
  processedRows?: number;
  successCount?: number;
  failureCount?: number;
  message?: string;
}

export interface Attendee {
  attendeeId?: string;
  id?: string | number;
  tenantId?: string;
  fullName: string;
  gender?: string;
  age?: string;
  standard?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  phoneNumber?: string;
  phoneE164?: string;
  dedupeKey?: string;
  whatsappOptInAt?: string | null;
  registrationTimestamp?: string | null;
  residentialSuburb?: string;
  whoWillAttend?: string;
  referenceName?: string;
  deliveryStatus?: string;
  attendanceStatus?: string;
  createdAt?: string;
  qrToken?: QrToken;
  pass?: AttendancePass;
}

export interface RegisterAttendeeRequest {
  fullName: string;
  gender: string;
  age: string;
  standard: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  residentialSuburb: string;
  whoWillAttend: string;
  referenceName: string;
}

export interface RegisterAttendeeResponse {
  attendeeId?: string;
  passId?: string;
  deliveryStatus?: string;
  whatsappMessageId?: string;
  message?: string;
}

export interface AttendeeWithPass {
  attendee: Attendee;
  qrToken?: QrToken;
  pass?: AttendancePass;
}

export type AttendeeResponseItem = Attendee | AttendeeWithPass;

export type GetAttendeesResponse = Attendee[] | {
  attendees?: AttendeeResponseItem[];
  data?: AttendeeResponseItem[];
  content?: AttendeeResponseItem[];
};
