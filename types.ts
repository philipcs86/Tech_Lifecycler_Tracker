
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LifecycleResponse {
  productName: string;
  summary: string;
  sources: GroundingSource[];
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}
