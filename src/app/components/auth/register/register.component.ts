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
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerform: FormGroup;
  genders = ['MALE', 'FEMALE'];
  roles = ['USER', 'MANAGER' ];
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private FormBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerform = this.FormBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerform.valid) {
      this.authService.registerUser(this.registerform.value).subscribe(
        response => {
          this.message = 'Registration Successful. Redirecting to Homepage!';
          console.log('Registration Successful', response);
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/']);
          }, 2000);
        },
        error => {
          console.log('Registration Error', error);
          this.errorMessage = 'Registration Failed';
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      );
    }
  }
}
