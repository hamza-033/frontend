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
  genders = ['MALE', 'FEMALE'];
  roles = ['USER', 'MANAGER'];
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private FormBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialisation du formulaire avec des validations
    this.registerform = this.FormBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^0[67][0-9]{8}$') // Le numéro de téléphone doit commencer par 06 ou 07 et contenir 10 chiffres
      ]],
      identificationNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{11}$') // Le numéro d'identification doit contenir exactement 11 chiffres
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail.com|outlook.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$') // Validation de l'email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$') // Validation du mot de passe (min 8 caractères, lettres majuscules, minuscules, chiffres et caractères spéciaux)
      ]],
      role: ['', Validators.required]
    });
  }

  // Méthode de soumission du formulaire
  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les messages d'erreur
    this.registerform.markAllAsTouched();

    // Vérification si le formulaire est valide avant de soumettre
    if (this.registerform.valid) {
      // Appel du service d'authentification pour inscrire l'utilisateur
      this.authService.registerUser(this.registerform.value).subscribe(
        response => {
          this.message = 'Registration Successful. Redirecting to Homepage!';
          console.log('Registration Successful', response);
          // Redirection après un délai
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/login']);
          }, 2000);
        },
        error => {
          console.log('Registration Error', error);
          this.errorMessage = 'Registration Failed';
          // Effacer le message d'erreur après un délai
          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
