export interface Task {
  id: string;
  order: number;
  orderNum: number;
  columnId: string;
  isCompleted: boolean;
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
