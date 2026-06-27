import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password &&
          u.active !== false
        );
        
        if (user) {
          const token = 'mock-jwt-token-' + user.id;
          const response: AuthResponse = { user, token };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
          this.currentUserSubject.next(user);
          return response;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  //Login function here
  loginUser(credentials: LoginRequest): Observable<AuthResponse> {
    const loginUrl = this.apiUrl + '/auth/login';

    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      map(response => {
        //save user
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        //Save token
        localStorage.setItem('token', response.token);
        //Update current user
        this.currentUserSubject.next(response.user);

        return response;
      })
    );
  }

  register(userData: any): Observable<any> {
    const registerUrl = this.apiUrl + '/auth/register';
    return this.http.post<User>(registerUrl, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  forgotPassword(email: string): Observable<any> {
    // Simulate API call
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email);
        if (user) {
          return { message: 'Password reset email sent successfully' };
        } else {
          throw new Error('Email not found');
        }
      })
    );
  }
}