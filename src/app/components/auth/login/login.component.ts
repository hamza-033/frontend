import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
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
          this.message = 'Login Successful, Redirecting...';
          setTimeout(() => {
            this.message = null;

            // Vérifier si des paramètres de réservation existent dans sessionStorage
            const reservationParams = sessionStorage.getItem('reservationParams');
            if (reservationParams) {
              const params = JSON.parse(reservationParams);

              // Rediriger vers la page de création de réservation avec les paramètres
              this.router.navigate(['/createreservation'], {
                queryParams: {
                  roomId: params.roomId,
                  enteranceDay: params.enteranceDay,
                  releaseDay: params.releaseDay,
                  roomType: params.roomType,
                  capacity: params.capacity,
                  location: params.location
                }
              });

              // Supprimer les paramètres de réservation du sessionStorage
              sessionStorage.removeItem('reservationParams');
            } else {
              // Si aucun paramètre de réservation n'est trouvé, rediriger vers la page d'accueil
              this.router.navigate(['/']);
            }
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
