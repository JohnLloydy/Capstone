import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {
  protected readonly apiUrl = `${this.baseUrl}/api/${this.entityname}`;
 
  constructor(
    protected readonly http: HttpClient,
    protected readonly toastController: ToastController,
    @Inject(String) protected readonly entityname: string,
    @Inject(String) protected readonly baseUrl: string = environment.backend,
    
  ) { }

  fetchEntities(query?: { [key: string]: string }): Observable<T[]> {
    const params = new HttpParams({ fromObject: query });
    return this.http.get<T[]>(this.apiUrl, { params }).pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showToast(e.error.error);
        throw new Error(e);
      })
    );
  }

  createEntity(body: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, body).pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        console.log(JSON.stringify(e));
        this.showToast(e.error.error);
        throw new Error(e);
      })
    );
  }

  fetchEntity(id: string): Observable<T> {
    const url = this.entityUrl(id);
    return this.http.get<T>(url).pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showToast(e.error.error);
        throw new Error(e);
      })
    );
  }

  updateEntity(id: string, body: T): Observable<T> {
    const url = this.entityUrl(id);
    return this.http.put<T>(url, body).pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showToast(e.error.error);
        throw new Error(e);
      })
    );
  }

  deleteEntity(id: string): Observable<T> {
    const url = this.entityUrl(id);
    return this.http.delete<T>(url).pipe(
      tap(res => {
        return res;
      }),
      catchError(e => {
        this.showToast(e.error.error);
        throw new Error(e);
      })
    );
  }

  protected entityUrl(id: string): string {
    return [this.apiUrl, id].join('/');
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });

    toast.present();
  }


}
