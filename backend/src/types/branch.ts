// Represents a retail branch or store location
export interface Branch {
  readonly id: string;
  name: string;
  location: string;
  contactNumber?: string;
  isActive: boolean;
  readonly createdAt: string;
}
