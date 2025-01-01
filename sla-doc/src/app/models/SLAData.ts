export interface SLAData {
  slaName: string;
  partiesInvolved: string;
  systemConcerned: string;
  description: string;
  associatedMetrics: string[];
  pageNumber: number[]; // might have multiple references
}
