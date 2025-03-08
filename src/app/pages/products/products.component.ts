import { Component, inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductsService } from '../../core/services/products/products.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products',
  imports: [RouterLink, FormsModule, SearchPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  products: IProduct[] = [];
  searchTerm: string = '';
  wishlist: string[] = []; // لتغيير لون القلب

  ngOnInit(): void {
    this.getProductsData();
    this.getWishlistData(); // لتغيير لون القلب
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        console.log(this.products);
      },
      error: (error) => console.error('Error:', error),
    });
  }

  addToWishlist(productId: string): void {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Success');
          this.wishlistService.wishlistNum.set(res.data.length);
          console.log(this.wishlistService.wishlistNum());
          this.getWishlistData();

        }
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
          this.toastrService.success(res.message, 'Success');
          this.cartService.cartNum.set(res.numOfCartItems);
          console.log(this.cartService.cartNum());
        }
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
  getWishlistData(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlist = res.data.map((item: IProduct) => item.id);
      },
      error: (error) => console.error('Error:', error),
    });
  }
  // لتغيير لوم القلب
}
