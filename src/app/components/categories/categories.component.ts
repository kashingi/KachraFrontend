import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded:', categories);
        //this.categories = categories;

        this.categories = categories.map(category => {
          let formattedImage = 'assets/images/default-category.png'; // Fallback image if null

          if (category.categoryImage) {
            // Prefix the Base64 string so the <img> tag can render it
            formattedImage = `data:image/jpeg;base64,${category.categoryImage}`;
          }

          return {
            ...category,
            image: formattedImage // Dynamically adding the 'image' property
          };
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  // Add this method
  getImageSrc(category: ProductCategory): string {
    if (!category.categoryImage) {
      return 'assets/images/placeholder.jpg'; // fallback image
    }

    // If it's already a full URL (http/https), return as is
    if (category.categoryImage.startsWith('http')) {
      return category.categoryImage;
    }

    // Convert Base64 to data URL
    return `data:image/jpeg;base64,${category.categoryImage}`;
  }
}