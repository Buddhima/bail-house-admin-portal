export type RequestType = 'absence' | 'visitor';
export type RequestStatus = 'pending' | 'first-level-approved' | 'approved' | 'rejected';

export interface ResidentRequest {
  id: string;
  locationId: string;
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
