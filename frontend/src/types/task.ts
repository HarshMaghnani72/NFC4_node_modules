export interface Task {
  _id: string; // MongoDB ObjectId
  userId: string;
  task: string;
  completed: boolean;
  dueDate: string;
  visibility: "public" | "private";
  by: string;
  groupId?: string;
}