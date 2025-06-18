export interface Task {
  id: string;
  order: number;
  orderNum: number;
  columnId: string;
  priority: Priority;
  isCompleted: boolean;
  dueDate: string | null;
  title: string;
  text?: string | null;
  createdAt: string;
  creator?: Creator;
}

interface Creator {
  name: string;
  avatar: string | null;
  createdAt: string;
}

type Priority = "none" | "low" | "medium" | "high";

