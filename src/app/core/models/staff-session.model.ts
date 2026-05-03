export interface StaffSession {
  id: string;
  name: string;
  role: 'House Manager' | 'Case Worker' | 'Front Desk';
  email: string;
}
