import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClient) {}

  myToken: any = localStorage.getItem('userToken');
  cartNum: WritableSignal<number> = signal(0);

  cardId:WritableSignal<string> = signal('');

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: id,
    });
  }

  getLoggedUserCart(): Observable<any> {
    const token = localStorage.getItem('userToken');
    if (!token) return of(null); // يمنع إرسال الطلب إذا لم يكن هناك توكن دي من  gpt عشان كان بيظهر رسايل error اول لما بفتح ال login

    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`);
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`);
  }

  updateProductQuantity(id: string, newCount: number): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, {
      count: newCount,
    });
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }
}
