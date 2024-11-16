export interface Event {
    id?: string;
    title: string;
    description: string;
    date: string;
    location: string;
    createdBy: string; // User ID
    attendees?: string[];
  }
  