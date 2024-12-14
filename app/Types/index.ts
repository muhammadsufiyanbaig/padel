export type ScoreState = {
  team1: {
    set1: number;
    set2: number;
    set3: number;
    set4?: number;
    set5?: number;
    game: number;
    score: string;
  };
  team2: {
    set1: number;
    set2: number;
    set3: number;
    set4?: number;
    set5?: number;
    game: number;
    score: string;
  };
};

export type TeamScore = {
  [key: string]: number | string | undefined;
  set1: number;
  set2: number;
  set3: number;
  set4?: number;
  set5?: number;
  game: number;
  score: string;
};

export type CustomTimerProps = {
  customMinutes: string;
  setCustomMinutes: (value: string) => void;
  customSeconds: string;
  setCustomSeconds: (value: string) => void;
  setCustomTimerAndStart: () => void;
};

export type WinnerSelectionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onWinnerSelected: (winner: string) => void;
};

export type MatchHistoryProps = {
  isStatsDialogOpen: boolean;
  setIsStatsDialogOpen: (open: boolean) => void;
  allPreviousStats: Array<{
    team1name: string;
    team1score: string;
    team1game: string;
    team1set1: number;
    team1set2: number;
    team1set3: number;
    team1set4: number;
    team1set5: number;
    team2name: string;
    team2score: string;
    team2game: string;
    team2set1: number;
    team2set2: number;
    team2set3: number;
    team2set4: number;
    team2set5: number;
    matchtime: string;
    set1time: string;
    set2time: string;
    set3time: string;
    set4time: string;
    set5time: string;
  }>;
  downloadCSV: () => void;
  clearMatchHistory: () => void;
};

export type TeamsNameDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team1Name: string;
  setTeam1Name: (name: string) => void;
  team2Name: string;
  setTeam2Name: (name: string) => void;
};

export type WinnerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  popupMessage: string;
  winningTeamStats: {
    set1: number;
    set2: number;
    set3: number;
    set4?: number;
    set5?: number;
    game: number;
    score: string;
  } | null;
  resetScores: () => void;
  resetTimer: () => void;
};

export type LoginDialogProps = {
  isLoginDialogOpen: boolean;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loginError: { username: string; password: string };
  handleLogin: () => void;
};