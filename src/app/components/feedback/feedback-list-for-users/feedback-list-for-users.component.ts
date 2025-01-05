import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from '../../layout/layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../services/hotel/hotel.service';

@Component({
  selector: 'app-feedback-list-for-users',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  templateUrl: './feedback-list-for-users.component.html',
  styleUrl: './feedback-list-for-users.component.scss'
})
export class FeedbackListForUsersComponent implements OnInit {
  hotelId: number | null = null;
  feedbacks: any[] = [];
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private feedbackService: HotelService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hotelId = +params['hotelId'];
      if (this.hotelId) {
        this.fetchFeedbacks(this.hotelId);
      } else {
        this.errorMessage = 'Hotel ID not found in query parameters';
      }
    });
  }

  fetchFeedbacks(hotelId: number): void {
    this.feedbackService.getFeedbacksByHotelId(hotelId).subscribe(
      data => {
        this.feedbacks = data;
        if (data.length === 0) {
          this.message = 'No feedbacks yet for this hotel.';
        }
      },
      error => {
        this.errorMessage = 'An error occurred while loading feedbacks';
        console.error('Error fetching feedbacks:', error);
      }
    );
  }
}
