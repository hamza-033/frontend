import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CitySliderComponent } from '../city-slider/city-slider.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoomService } from '../../services/room/room.service';
import { AvailableRoomsComponent } from '../room/available-rooms/available-rooms.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  searchForm: FormGroup;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialiser la date minimale à aujourd'hui
    this.minDate = new Date();

    // Définir le formulaire avec les validations
    this.searchForm = this.fb.group({
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      roomType: [''],
      capacity: ['']
    }, {
      validators: this.dateRangeValidator // Validation personnalisée pour les plages de dates
    });
  }

  ngOnInit(): void {}

  // Méthode pour formater une date (facultatif)
  formatDate(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Méthode de validation personnalisée pour vérifier les plages de dates
  dateRangeValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  // Méthode appelée lors de la recherche
  onSearch(): void {
    const { location, startDate, endDate, roomType, capacity } = this.searchForm.value;
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    // Navigation avec les paramètres
    this.router.navigate(['/availableroomslist'], {
      queryParams: {
        enteranceDay: formattedStartDate,
        releaseDay: formattedEndDate,
        roomType: roomType,
        capacity: capacity,
        location: location
      }
    });
  }
}
