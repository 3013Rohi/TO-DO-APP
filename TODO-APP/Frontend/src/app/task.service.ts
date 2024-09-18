import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Ensure HttpClient is imported
import { Observable } from 'rxjs';
import { Task } from './task.model'; // Import the Task model

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:4000/api/task'; 

  constructor(private http: HttpClient) {}

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Creating task with data:', task); // Add this line
    return this.http.post<Task>(`${this.apiUrl}`, task, { headers });
  }
  

  // Update a task by externalId
  updateTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Task>(`${this.apiUrl}/${task.externalId}`, task, { headers });
  }

  // Delete a task by externalId
  deleteTask(externalId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${externalId}`);
  }
}