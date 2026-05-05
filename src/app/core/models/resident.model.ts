export type ResidentStatus = 'active' | 'inactive' | 'on-leave';
export type ResidentSignActionType = 'signin' | 'signout';

export interface Resident {
  id: string;
  locationId: string;
  fullName: string;
  room: string;
  status: ResidentStatus;
  checkInStatus: 'in-house' | 'signed-out';
  caseWorker: string;
  phone: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
  admissionDate: string;
}

export interface ResidentSignAction {
  id: string;
  residentId: string;
  type: ResidentSignActionType;
  recordedAt: string;
  recordedBy: string;
  destination: string;
  notes: string;
}
