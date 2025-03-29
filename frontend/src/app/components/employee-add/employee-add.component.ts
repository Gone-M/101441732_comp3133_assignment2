import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  loading = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', Validators.required]
    });
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
      this.loading = true;
      
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
          this.loading = false;
          return;
        }
      }
      
      this.employeeService.createEmployee(employeeData).subscribe(
        () => {
          this.snackBar.open('Employee added successfully', 'Close', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/employees']);
        },
        error => {
          this.snackBar.open('Error adding employee: ' + error.message, 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      );
    }
  }

  // This function would be implemented in a real application
  // to upload the image to a storage service and return the URL
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