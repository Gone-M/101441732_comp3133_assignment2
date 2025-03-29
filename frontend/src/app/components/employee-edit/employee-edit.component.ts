import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeId: string = '';
  employeeForm: FormGroup;
  initialLoading = true;
  submitLoading = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  currentProfilePicture: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.employeeId) {
      this.snackBar.open('Employee ID is required', 'Close', { duration: 3000 });
      this.router.navigate(['/employees']);
      return;
    }

    this.loadEmployee();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', Validators.required]
    });
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe(
      (employee: Employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          gender: employee.gender,
          position: employee.position,
          department: employee.department,
          salary: employee.salary
        });

        this.currentProfilePicture = employee.profilePicture || null;
        this.initialLoading = false;
      },
      error => {
        this.snackBar.open('Error loading employee: ' + error.message, 'Close', {
          duration: 3000
        });
        this.initialLoading = false;
        this.router.navigate(['/employees']);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      this.submitLoading = true;
      
      const employeeData = this.employeeForm.value;
      
      // Handle file upload if a file was selected
      if (this.selectedFile) {
        try {
          const profilePicture = await this.uploadImage(this.selectedFile);
          employeeData.profilePicture = profilePicture;
        } catch (error) {
          this.snackBar.open('Error uploading image: ' + error, 'Close', {
            duration: 3000
          });
          this.submitLoading = false;
          return;
        }
      } else if (this.currentProfilePicture) {
        employeeData.profilePicture = this.currentProfilePicture;
      }
      
      this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe(
        () => {
          this.snackBar.open('Employee updated successfully', 'Close', {
            duration: 3000
          });
          this.submitLoading = false;
          this.router.navigate(['/employees']);
        },
        error => {
          this.snackBar.open('Error updating employee: ' + error.message, 'Close', {
            duration: 3000
          });
          this.submitLoading = false;
        }
      );
    }
  }

  // This function would be implemented in a real application
  async uploadImage(file: File): Promise<string> {
    // Mock implementation - in a real app, this would upload to a server
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Return a placeholder URL for demo purposes
        resolve('https://via.placeholder.com/150');
      }, 1000);
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}