import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { CityService } from '../../../services/city-district/city.service';
import { DistrictService } from '../../../services/city-district/district.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-update',
  standalone: true,
  imports: [LayoutComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './address-update.component.html',
  styleUrl: './address-update.component.scss'
})
export class AddressUpdateComponent implements OnInit {
  addressForm: FormGroup;
  userId: number | null = null;
  addressId: number | null = null;
  cities: any[] = [];
  districts: any[] = [];
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userAddressService: UserService,
    private cityService: CityService,
    private districtService: DistrictService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      addressText: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      districtId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    //this.userId = this.authService.getUserIdFromToken();
    this.route.queryParams.subscribe(params => {
      this.addressId = +params['id'];
      if (this.addressId) {
        this.addressForm.patchValue({ id: this.addressId });
      } else {
        console.error('Address ID not found in query parameters');
        this.router.navigate(['/profile']);
      }
    });

    this.cityService.getAllCities().subscribe(
      data => {
        this.cities = data;
      },
      error => {
        console.error('An error occurred while loading cities', error);
      }
    );

    this.addressForm.get('cityId')?.valueChanges.subscribe(cityId => {
      this.districtService.getDistrictsByCity(cityId).subscribe(
        data => {
          this.districts = data;
        },
        error => {
          console.error('An error occurred while loading districts', error);
        }
      );
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const districtId = this.addressForm.get('districtId')?.value;
      console.log('District ID:', districtId);

      const updateUserAddressRequest = {
        id: this.addressId,
        addressText: this.addressForm.get('addressText')?.value,
        district: districtId
      };

      this.userAddressService.updateUserAddress(updateUserAddressRequest).subscribe(
        response => {
          this.message = 'Address successfully updated';  // Update the message
          console.log('Address successfully updated:', response);
          setTimeout(() => {
            this.message = null;  // Clear the message after a while
            this.router.navigate(['/profile']);
          }, 2000);  // The message will disappear after 2 seconds and then redirect
        },
        error => {
          this.errorMessage = 'Address could not be updated';
          console.error('An error occurred while updating the address:', error);
        }
      );
    }
  }
}
