import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { CartService } from './../../core/services/cart/cart.service';
import { Component, OnInit, Signal, computed, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  isLogin = input<boolean>(true);
  navCartCount: Signal<number> = computed(() => this.cartService.cartNum());
  navWishlistCount: Signal<number> = computed(() => this.wishlistService.wishlistNum());


  ngOnInit(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) =>{
        console.log('numOfCartItems',res);
        this.cartService.cartNum.set(res.numOfCartItems);
      }
    });

    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) =>{
        console.log('numOfWishlistItems',res);
        this.wishlistService.wishlistNum.set(res.count);
      }
    })
  }
}
