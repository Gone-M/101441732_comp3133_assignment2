import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}