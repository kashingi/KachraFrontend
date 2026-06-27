import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';
  usersApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersApi}/auth/getAllUsers`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: User): Observable<any> {
    return this.http.post<User>(`${this.usersApi}/auth/register`, user);
  }


  updateUser(userId: number, user: Partial<User>): Observable<User> {
    const updateUrl = this.usersApi + '/auth/updateUser/'+ `${userId}`;
    
    return this.http.put<User>(updateUrl, user);
  }

  deleteUser(id: number): Observable<void> {
    const deleteUrl = this.usersApi + '/auth/deleteUser/'+ `${id}`;
    
    return this.http.delete<void>(deleteUrl);
  }

  toggleUserStatus(id: number, active: boolean): Observable<User> {
    const statusUrl = this.usersApi + '/auth/updateUserStatus/'+ `${id}`;
    
    return this.http.patch<User>(statusUrl, { active });
  }
}