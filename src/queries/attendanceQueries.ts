import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import attendanceService from '../services/attendanceService';
import type {
  ApiError,
  Attendee,
  BulkUploadJob,
  BulkUploadResponse,
  CheckInRequest,
  CheckInResponse,
  IssuePassRequest,
  IssuePassResponse,
  RegisterAttendeeRequest,
  RegisterAttendeeResponse,
} from '../types';

export const attendanceQueryKeys = {
  bulkUploadJob: (jobId: string) => ['bulk-upload-job', jobId] as const,
  attendees: (sessionId: string) => ['attendees', sessionId] as const,
};

export const useIssuePass = (sessionId: string) => {
  return useMutation<IssuePassResponse, ApiError, IssuePassRequest>({
    mutationFn: (data) => attendanceService.issuePass(sessionId, data),
  });
};

export const useCheckIn = () => {
  return useMutation<CheckInResponse, ApiError, CheckInRequest>({
    mutationFn: (data) => attendanceService.checkIn(data),
  });
};

export const useCheckInAttendee = (sessionId: string) => {
  return useMutation<CheckInResponse, ApiError, string | number>({
    mutationFn: (attendeeId) => attendanceService.checkInAttendee(sessionId, attendeeId),
  });
};

export const useBulkUpload = (sessionId: string) => {
  return useMutation<BulkUploadResponse, ApiError, File>({
    mutationFn: (file) => attendanceService.bulkUpload(sessionId, file),
  });
};

export const useBulkUploadJob = (jobId: string, enabled = true) => {
  return useQuery<BulkUploadJob, ApiError>({
    queryKey: attendanceQueryKeys.bulkUploadJob(jobId),
    queryFn: () => attendanceService.getBulkUploadJob(jobId),
    enabled: enabled && Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status?.toLowerCase();
      return status === 'completed' || status === 'failed' ? false : 3000;
    },
  });
};

export const useAttendees = (sessionId: string, enabled = true, status?: string) => {
  return useQuery<Attendee[], ApiError>({
    queryKey: status ? ['attendees', sessionId, status] : attendanceQueryKeys.attendees(sessionId),
    queryFn: () => attendanceService.getAttendees(sessionId, status),
    enabled: enabled && Boolean(sessionId),
    placeholderData: keepPreviousData,
  });
};

export const useRegisterAttendee = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RegisterAttendeeResponse, ApiError, RegisterAttendeeRequest>({
    mutationFn: (data) => attendanceService.registerAttendee(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.attendees(sessionId) });
    },
  });
};
