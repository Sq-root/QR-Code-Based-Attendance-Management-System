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
  attendeeId?: number;
  deliveryStatus?: string;
  whatsappMessageId?: string;
  message?: string;
}

export interface QrPayload {
  pid: string;
  aid: number;
  sid: string;
  exp: number;
}

export interface CheckInRequest {
  payload: QrPayload;
  signature: string;
  scannerDeviceId: string;
  deviceScanId: string;
  source: string;
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
  attendeeId?: number;
  id?: string | number;
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
  residentialSuburb?: string;
  whoWillAttend?: string;
  referenceName?: string;
  deliveryStatus?: string;
  attendanceStatus?: string;
  createdAt?: string;
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
  attendeeId?: number;
  passId?: string;
  deliveryStatus?: string;
  whatsappMessageId?: string;
  message?: string;
}

export type GetAttendeesResponse = Attendee[] | {
  attendees?: Attendee[];
  data?: Attendee[];
  content?: Attendee[];
};
