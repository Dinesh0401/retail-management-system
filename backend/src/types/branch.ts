// Represents a retail branch or store location
export interface Branch {
  readonly id: string;
  name: string;
  location: string;
  manager_name: string | null;
  readonly created_at: string;
}
