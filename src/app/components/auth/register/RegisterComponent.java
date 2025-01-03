import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerform: FormGroup;
  genders = ['ERKEK', 'KADIN'];
  roles = ['USER', 'MANAGER', 'ADMIN'];
  message: string | null = null; // Success message
  errorMessage: string | null = null; // Error message

  constructor(
    private FormBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerform = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      identificationNumber: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Form Submission Attempt:', this.registerform.value);

    if (this.registerform.valid) {
      console.log('Form Valid. Sending Data...');
      this.authService.registerUser(this.registerform.value).subscribe(
        response => {
          console.log('Registration Successful:', response);
          this.message = 'Registration successful! Redirecting to home page...';
          setTimeout(() => {
            this.message = null; // Clear message after 2 seconds
            this.router.navigate(['/']);
          }, 2000);
        },
        error => {
          console.error('Registration Error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
          setTimeout(() => {
            this.errorMessage = null; // Clear error message after 2 seconds
          }, 2000);
        }
      );
    } else {
      console.warn('Form Invalid:', this.registerform.errors);
      this.errorMessage = 'Please fill out the form correctly before submitting.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 2000);
    }
  }
}
