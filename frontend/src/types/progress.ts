export type ProgressUpdatePayload = {
  userId: string;
  studyHours?: number; // This will be an increment in hours
  tasksCompleted?: number; // This will be an increment
  xp?: number; // This will be an increment
};

export type WeeklyStats = {
  studyHours: number;
  goal: number;
  sessions: number;
  groups: number;
};

export type DailyStudyHours = {
  day: string;
  hours: number;
}[];
