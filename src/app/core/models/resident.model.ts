export type ResidentStatus = 'active' | 'inactive' | 'on-leave';

export interface Resident {
  id: string;
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
