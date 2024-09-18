export interface Task {
  externalId?: number; // Optional for new tasks
  description: string;
  status?: 'Not Started' | 'In Progress' | 'Completed'; // Optional
  dueDate?: Date; // Optional
  priority?: 'Low' | 'Normal' | 'High'; // Optional
  assignedTo: string;
}


export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';
