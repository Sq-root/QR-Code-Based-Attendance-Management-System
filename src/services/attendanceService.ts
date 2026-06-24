import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  BulkUploadJob,
  BulkUploadResponse,
  CheckInRequest,
  CheckInResponse,
  Attendee,
  GetAttendeesResponse,
  IssuePassRequest,
  IssuePassResponse,
  RegisterAttendeeRequest,
  RegisterAttendeeResponse,
  AttendeeResponseItem,
} from '../types';

const normalizeAttendee = (item: AttendeeResponseItem): Attendee => {
  if ('attendee' in item) {
    return {
      ...item.attendee,
      qrToken: item.qrToken,
      pass: item.pass,
      deliveryStatus: item.attendee.deliveryStatus ?? item.pass?.deliveryStatus ?? undefined,
    };
  }

  return item;
};

const normalizeAttendees = (data: GetAttendeesResponse): Attendee[] => {
  if (Array.isArray(data)) {
    return data.map(normalizeAttendee);
  }

  const items = data.attendees ?? data.data ?? data.content ?? [];
  return items.map(normalizeAttendee);
};

export const attendanceService = {
  async issuePass(sessionId: string, data: IssuePassRequest): Promise<IssuePassResponse> {
    console.log('[Attendance Service] Issue pass request started', {
      sessionId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
    });

    const response = await api.post<IssuePassResponse>(API_ENDPOINTS.ISSUE_PASS(sessionId), data);
    console.log('[Attendance Service] Issue pass request completed', response.data);
    return response.data;
  },

  async checkIn(data: CheckInRequest): Promise<CheckInResponse> {
    const sessionId = data.payload.sid;

    console.log('[Attendance Service] Check-in request started', {
      sessionId,
      passId: data.payload.pid,
      attendeeId: data.payload.aid,
      qrSessionId: data.payload.sid,
      scannerDeviceId: data.scannerDeviceId,
      deviceScanId: data.deviceScanId,
      source: data.source,
    });

    const response = await api.post<CheckInResponse>(API_ENDPOINTS.CHECK_IN(sessionId), data);
    console.log('[Attendance Service] Check-in request completed', response.data);
    return response.data;
  },

  async bulkUpload(sessionId: string, file: File): Promise<BulkUploadResponse> {
    console.log('[Attendance Service] Bulk upload request started', {
      sessionId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<BulkUploadResponse>(
      API_ENDPOINTS.BULK_UPLOAD(sessionId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('[Attendance Service] Bulk upload request completed', response.data);
    return response.data;
  },

  async getBulkUploadJob(jobId: string): Promise<BulkUploadJob> {
    console.log('[Attendance Service] Bulk upload job status request started', { jobId });
    const response = await api.get<BulkUploadJob>(API_ENDPOINTS.BULK_UPLOAD_JOB(jobId));
    console.log('[Attendance Service] Bulk upload job status request completed', response.data);
    return response.data;
  },

  async getAttendees(sessionId: string): Promise<Attendee[]> {
    console.log('[Attendance Service] Get attendees request started', { sessionId });
    const response = await api.get<GetAttendeesResponse>(API_ENDPOINTS.GET_ATTENDEES(sessionId));
    const attendees = normalizeAttendees(response.data);
    console.log('[Attendance Service] Get attendees request completed', {
      count: attendees.length,
      rawResponse: response.data,
    });
    return attendees;
  },

  async registerAttendee(
    sessionId: string,
    data: RegisterAttendeeRequest,
  ): Promise<RegisterAttendeeResponse> {
    console.log('[Attendance Service] Register attendee request started', {
      sessionId,
      fullName: data.fullName,
      fatherPhone: data.fatherPhone,
      motherPhone: data.motherPhone,
    });

    const response = await api.post<RegisterAttendeeResponse>(
      API_ENDPOINTS.REGISTER_ATTENDEE(sessionId),
      data,
    );

    console.log('[Attendance Service] Register attendee request completed', response.data);
    return response.data;
  },
};

export default attendanceService;
