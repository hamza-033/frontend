import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {

  user: any;
  profileForm: FormGroup;
  message: string | null = null;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{6,}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d+$')]]
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      data => {
        this.user = data;
        this.profileForm.patchValue({
          email: data.email,
          password: '',
          phoneNumber: data.phoneNumber
        });
      },
      error => {
        console.error('Profile data could not be retrieved', error);
      }
    );
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateUser(this.profileForm.value).subscribe(
        response => {
          this.message = 'User Profile Updated';
          console.log('User information updated:', response);
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/profile']);
          }, 3000);
        },
        error => {
          console.error('Update error:', error);
          this.message = 'Profile Information Could Not Be Updated' + error.message;
        }
      );
    }
  }

  onUpdate(addressId: number): void {
    this.router.navigate(['/addressupdate'], { queryParams: { id: addressId } });
  }

  send(): void {
    this.router.navigate(['/createuseraddress']);
  }
}
