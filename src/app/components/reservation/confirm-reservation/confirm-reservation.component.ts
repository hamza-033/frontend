import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutComponent } from '../../layout/layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-confirm-reservation',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  templateUrl: './confirm-reservation.component.html',
  styleUrl: './confirm-reservation.component.scss'
})
export class ConfirmReservationComponent implements OnInit {
  reservationForm: FormGroup;
  paymentTypes = ['CREDITCARD', 'MASTERCARD',  'PAYPAL'];
  reservationId: number | null = null;
  roomId: number = 0;
  enteranceDay: string = '';
  releaseDay: string = '';
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.reservationForm = this.fb.group({
      paymentType: ['', Validators.required],
      guests: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken();
    this.route.queryParams.subscribe(params => {
      this.reservationId = +params['reservationId'];
      this.roomId = +params['roomId'];
      this.enteranceDay = params['enteranceDay'];
      this.releaseDay = params['releaseDay'];
    });
    this.addGuest(); // Called to add at least one guest information.
  }

  get guests(): FormArray {
    return this.reservationForm.get('guests') as FormArray;
  }

  addGuest(): void {
    this.guests.push(this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      identificationNumber: ['', [Validators.required, Validators.pattern('\\d{10,11}')]],
      gender: ['', Validators.required]
    }));
  }

  removeGuest(index: number): void {
    this.guests.removeAt(index);
  }

  confirmReservation(): void {
    const paymentRequest = {
      reservationId: this.reservationId,
      paymentType: this.reservationForm.get('paymentType')?.value
    };

    const guestInformationRequests = this.guests.value.map((guest: any) => ({
      reservationId: this.reservationId,
      name: guest.name,
      surname: guest.surname,
      identificationNumber: guest.identificationNumber,
      gender: guest.gender
    }));

    this.reservationService.createPayment(paymentRequest).subscribe(
      () => {
        this.reservationService.addGuestInformation(guestInformationRequests).subscribe(
          () => {
            this.router.navigate(['/reservationdetails'], {
              queryParams: {
                reservationId: this.reservationId,
                roomId: this.roomId,
                enteranceDay: this.enteranceDay,
                releaseDay: this.releaseDay
              }
            });
          },
          error => {
            console.error('Error while creating guest:', error);
          }
        );
      },
      error => {
        console.error('Error while processing payment:', error);
      }
    );
  }
}
