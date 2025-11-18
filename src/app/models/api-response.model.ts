// Templete Model
export interface Templete {
  id: string;
  title: string;
  templeteUrl: string | null;
  fileUrl: string | null;
  sportName: string;
  sportId: string;
}
// Templete and Sports Models

export interface Sport {
  id: string;
  name: string;
  isDeleted: boolean;
  playingPosition: string | null;
}

export interface SportsListResponse {
  success: boolean;
  message: string;
  data: Sport[];
  error: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string[];
}

// Player Overview Types
export type PlayerCountBySportResponse = ApiResponse<Array<{
  sportId: string;
  sportName: string;
  playerCount: number;
}>>;

export interface PlayerOverviewData {
  playerCountBySport: Array<{
    sportId: string;
    sportName: string;
    playerCount: number;
  }>;
}

export type PlayersResponse = ApiResponse<{
  pagination: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  items: Array<{
    id: string;
    fullName: string;
    dateOfBirth: string;
    subscriptionPlan: string;
    subscriptionDate: string;
    playingPosition: string;
    currentClub: string;
    fileUrl: string | null;
  }>;
}>;

export type PlayerInfoResponse = ApiResponse<PlayerInfo>;

export interface PlayerInfo {
  fullName: string;
  dateOfBirth: string;
  gender: number;
  weightKg: number | null;
  heightCm: number | null;
  jerseyNumber: number;
  signedAt: string;
  playingPositionName: string;
  currentClub: string;
  joinedAt: number;
  images: {
    profileUrl: string | null;
    inMotionUrl: string | null;
    celebrationUrl: string | null;
    fullBodyUrl: string | null;
  };
  career: Array<{
    clubId?: string;
    clubName: string;
    startYear: number;
    endYear: number | null;
    isCurrentClub: boolean;
    clubUrl?: string | null;
  }>;
}

// Club Overview Types
export type ClubCountBySportResponse = ApiResponse<Array<{
  sportId: string;
  sportName: string;
  clubCount: number;
}>>;

export type ClubsResponse = ApiResponse<{
  pagination: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  items: Array<{
    id: string;
    fullName: string;
    owner: string;
    subscriptionPlan: string;
    subscriptionDate: string;
    fileUrl: string | null;
  }>;
}>;

export type ClubInfoResponse = ApiResponse<{
  fullName: string;
  address: string;
  sportName: string;
  clubUrl: string | null;
  totalPlayers: number;
  totalOfficials: number;
  totalMembers: number;
  players: Array<{
    id: string;
    fullName: string;
    dateOfBirth: string;
    playingPositionName: string;
    playerUrl: string | null;
  }>;
  officials: Array<{
    id: string;
    name: string;
    designation: string;
    joiningDate: string;
    clubOfficialUrl: string | null;
  }>;
}>;

export interface TempletesPagination {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface TempletesResponse {
  pagination: TempletesPagination;
  items: Templete[];
}

export interface TempletesListResponse {
  success: boolean;
  message: string;
  data: TempletesResponse;
}

export interface TempleteRequest {
  sportId: string;
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  templeteType?: number; // Changed from string to number to match the ID
}

// Template Type Models
export interface TempleteType {
  id: number;
  name: string;
}

export interface TempleteTypesListResponse {
  success: boolean;
  message: string;
  data: TempleteType[];
  error: string[];
}