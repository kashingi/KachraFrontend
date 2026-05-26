import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FeaturesComponent } from '../features/features.component';
import { ProductsComponent } from '../products/products.component';
import { CategoriesComponent } from '../categories/categories.component';
import { BlogsComponent } from '../blogs/blogs.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FeaturesComponent,
    ProductsComponent,
    CategoriesComponent,
    BlogsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  badgeImage!: string;
  badgeTitle!: string;
  badgeDescription!: string;

  ngOnInit(): void {
    this.getBadge();
  }

  getBadge() {
    this.homeService.getBadge().subscribe({
      next: (resp: any)=>{
        console.log("Badge response : ", resp);
        if (resp && resp.length > 0) {
          const badge = resp[0];
          this.badgeTitle = badge.title;
          this.badgeDescription = badge.description;
          this.badgeImage = `data:image/jpeg;base64,${badge.image}`;
        }
        console.log("Response error : ", resp)
      },
      error: (error)=> {
        console.log("Response error : ", error);
      },
      complete: () => {
        console.log("API executed successfully.")
      }
    })
  }
}