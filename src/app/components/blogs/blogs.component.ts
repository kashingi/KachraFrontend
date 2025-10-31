import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.http.get<Blog[]>('http://localhost:3000/blogs').subscribe({
      next: (blogs) => {
        this.blogs = blogs;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }
}