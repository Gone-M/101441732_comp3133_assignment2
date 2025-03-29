import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  displayedColumns: string[] = [
    'profilePicture', 'firstName', 'lastName', 'email', 
    'position', 'department', 'actions'
  ];
  searchCriteria = 'department';
  searchValue = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
        this.employees = data;
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Error loading employees: ' + error.message, 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }

  search(): void {
    if (!this.searchValue.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(this.searchCriteria, this.searchValue).subscribe(
      (data) => {
        this.employees = data;
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Error searching employees: ' + error.message, 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }

  resetSearch(): void {
    this.searchValue = '';
    this.loadEmployees();
  }

  viewDetails(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe(
      (employee) => {
        this.dialog.open(EmployeeDetailsComponent, {
          width: '500px',
          data: employee
        });
      },
      (error) => {
        this.snackBar.open('Error loading employee details: ' + error.message, 'Close', {
          duration: 3000
        });
      }
    );
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this employee?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(id).subscribe(
          () => {
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadEmployees();
          },
          (error) => {
            this.snackBar.open('Error deleting employee: ' + error.message, 'Close', {
              duration: 3000
            });
          }
        );
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}