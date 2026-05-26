import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiDevUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  public addBadge(badgeData: any): Observable<any> {
    const badgeUrl = `${this.apiDevUrl}/api/v1/badge/addBadge`;

    return this.httpClient.post<any>(badgeUrl, badgeData);
  }

  public getBadge(): Observable<any> {
    const badgeUrl = `${this.apiDevUrl}/api/v1/badge/getBadges`;

    return this.httpClient.get<any>(badgeUrl);
  }
}
