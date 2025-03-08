import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient) {}
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);


  myToken: any = localStorage.getItem('userToken');
  cartId :string = '';

  userId: string = this.authService.userData.id;

  checkOutCardPayment(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${this.cartId}?url=http://localhost:4200`,
      {
        shippingAddress: data,
      },
      {
        headers: {
          token: this.myToken,
        },
      }
    );
  }

  createCashOrder(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/${this.cartId}`,
      {
        shippingAddress: data,
      }
    );
  }

  getUserOrders(): Observable<any> {
    const userId: string = this.authService.userData.id;

    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${userId}`
    );
  }
}
