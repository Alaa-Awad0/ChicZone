import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlistProd } from '../../shared/interfaces/iwishlist-prod';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  wishlist: IWishlistProd[] = [];

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res.data); //contains {total cart price and products [{}] }
        this.wishlist = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.cartService.cartNum.set(res.numOfCartItems);
          console.log(this.cartService.cartNum());
          this.removeItem(productId, false);
          this.toastrService.success(res.message, res.status);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItem(id: string, showAlert: boolean = true): void {
    if (showAlert) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteWishlistItem(id);
        }
      });
    } else {
      this.deleteWishlistItem(id);
    }
  }

  // ✅ دالة لحذف العنصر فعليًا دون تكرار الكود
  private deleteWishlistItem(id: string): void {
    this.wishlistService.removeWishlistItem(id).subscribe({
      next: (res) => {
        console.log('remove', res);
        this.getWishlist();
        this.wishlistService.wishlistNum.set(this.wishlist.length);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
