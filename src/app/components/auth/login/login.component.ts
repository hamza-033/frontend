import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe(
        response => {
          this.authService.login(response);
          console.log("Login successful");
          this.message = 'Login Successful, Redirecting to Homepage...';
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/']);
          }, 2000);
        },
        error => {
          this.errorMessage = 'Incorrect Email or Password';
          console.log("Login failed", error);
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      );
    }
  }
}
