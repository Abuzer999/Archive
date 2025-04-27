import type { Task } from "./tasks";

export interface Columns {
  id: string;
  name: string;
  order: number;
  projectId: string;
  tasks: Task[];
}
