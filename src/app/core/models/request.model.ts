export type RequestType = 'absence' | 'visitor';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ResidentRequest {
  id: string;
  residentId: string;
  residentName: string;
  type: RequestType;
  status: RequestStatus;
  submittedAt: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
}
