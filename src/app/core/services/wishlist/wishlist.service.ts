import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  addProductToCart(productId: string) {
    throw new Error('Method not implemented.');
  }
  wishlistNum: WritableSignal<number> = signal(0);

  constructor(private httpClient: HttpClient) {}

  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: id,
    });
  }

  getLoggedUserWishlist(): Observable<any> {

    const token = localStorage.getItem('userToken');
    if (!token) return of(null); // يمنع إرسال الطلب إذا لم يكن هناك توكن دي من  gpt عشان كان بيظهر رسايل error اول لما بفتح ال login
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  removeWishlistItem(id: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`
    );
  }
}
