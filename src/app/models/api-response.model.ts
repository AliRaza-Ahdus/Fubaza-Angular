// Templete Model
export interface Templete {
  id: string;
  name: string;
  license: string;
  imageUrl?: string;
}
// Templete and Sports Models

export interface Sport {
  id: string;
  name: string;
  isDeleted: boolean;
  playingPosition: string | null;
}

export type SportsListResponse = ApiResponse<Sport[]>;
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any[];
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