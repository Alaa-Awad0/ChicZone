import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../../shared/interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  addProductToCart(productId: string) {
    throw new Error('Method not implemented.');
  }
  private readonly toastrService = inject(ToastrService);
  wishlistNum: WritableSignal<number> = signal(0);
  wishlist: string[] = []; // لتغيير لوم القلب


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





  addToWishlist(productId: string): void {
    if (this.isInWishlist(productId)) {
      // إزالة المنتج من القائمة
      this.removeWishlistItem(productId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'Removed from Wishlist');

            // تحديث قائمة الأمنيات
            this.wishlist = this.wishlist.filter((id) => id !== productId);

            // تحديث عدد العناصر في القائمة
            this.wishlistNum.set(res.data.length);
          }
        },
        error: (error) => console.error('Error:', error),
      });
    } else {
      // إضافة المنتج إلى القائمة
      this.addProductToWishlist(productId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'Added to Wishlist');

            // تحديث قائمة الأمنيات
            this.wishlist.push(productId);

            // تحديث عدد العناصر في القائمة
            this.wishlistNum.set(res.data.length);

          }
        },
        error: (error) => console.error('Error:', error),
      });
    }
  }

  getWishlistData(): void {
    this.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.wishlist = res.data.map((item: IProduct) => item.id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // لتغيير لوم القلب

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }
}
