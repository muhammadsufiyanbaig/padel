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
    team1: {
      name: string;
      set1: number;
      set2: number;
      set3: number;
      set4?: number;
      set5?: number;
      game: number;
      score: number;
    };
    team2: {
      name: string;
      set1: number;
      set2: number;
      set3: number;
      set4?: number;
      set5?: number;
      game: number;
      score: number;
    };
    matchTime: string;
    setTimes: string[];
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
