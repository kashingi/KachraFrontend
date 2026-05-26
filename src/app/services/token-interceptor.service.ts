import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';


export const tokenInterceptor: HttpInterceptorFn = (request, next) => {

  const router = inject(Router)
  const token = localStorage.getItem('token');

  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}`}
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.clear();
        router.navigate(['/'])
      }
      return throwError(()=> error);
    })
  );
}
