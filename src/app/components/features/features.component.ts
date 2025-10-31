import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  features = [
    {
      icon: 'eco',
      title: 'Fresh and Organic',
      description: 'Brighten up your meals with our premium-quality, farm-fresh produce—handpicked at peak ripeness and naturally grown without harmful chemicals.',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'
    },
    {
      icon: 'delivery_dining',
      title: 'Free Delivery',
      description: 'Experience freshness delivered with speed! Enjoy free express delivery brought straight to your door with care and reliability.',
      image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg'
    },
    {
      icon: 'payment',
      title: 'Easy Payments',
      description: 'Multiple payment options including Lipa na M-Pesa, making checkout quick and hassle-free. We value you and provide friendly service every time!',
      image: 'https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg'
    }
  ];
}