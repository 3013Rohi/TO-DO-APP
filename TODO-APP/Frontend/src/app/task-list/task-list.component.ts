import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { TaskService } from '../task.service'; // Import TaskService
import { Task } from '../task.model'; // Import Task model
import { NewTaskModalComponent } from '../new-task-modal/new-task-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, FormsModule, HttpClientModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  recordsPerPage = 20;
  currentPage = 1;
  paginatedTasks: Task[] = [];

  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.paginatedTasks = this.tasks.slice(startIndex, endIndex);
  }

  increaseRecordsPerPage(): void {
    this.recordsPerPage += 1;
    this.updatePagination();
  }

  decreaseRecordsPerPage(): void {
    if (this.recordsPerPage > 1) {
      this.recordsPerPage -= 1;
      this.updatePagination();
    }
  }

  openNewTask(): void {
    const dialogRef = this.dialog.open(NewTaskModalComponent, {
      width: '500px',
      data: { task: {} } // Pass empty task for new task creation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.comments = result.description; // Map description to comments
        this.taskService.createTask(result).subscribe(newTask => {
          this.tasks.push(newTask);
          this.updatePagination();
        });
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(NewTaskModalComponent, {
      width: '500px',
      data: { task: task } // Pass the task data for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.comments = result.description; // Map description to comments
        this.taskService.updateTask(result).subscribe(updatedTask => {
          const index = this.tasks.findIndex(t => t.externalId === updatedTask.externalId);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.updatePagination();
          }
        });
      }
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && task.externalId !== undefined) {
        this.taskService.deleteTask(task.externalId).subscribe(() => {
          this.tasks = this.tasks.filter(t => t.externalId !== task.externalId);
          this.updatePagination();
        });
      }
    });
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < Math.ceil(this.tasks.length / this.recordsPerPage)) {
      this.currentPage += 1;
      this.updatePagination();
    }
  }

  goToLastPage(): void {
    this.currentPage = Math.ceil(this.tasks.length / this.recordsPerPage);
    this.updatePagination();
  }
}