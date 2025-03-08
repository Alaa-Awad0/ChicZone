import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, FormsModule, SearchPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  products: IProduct[] = [];
  categories: ICategory[] = [];
  searchTerm: string = '';
  wishlist: string[] = []; // لتغيير لوم القلب

  ngOnInit(): void {
    this.getProductsData();
    this.getCategoryData();
    this.getWishlistData(); // لتغيير لوم القلب
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

  getCategoryData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        console.log(this.categories);
      },
      error: (error) => console.error('Error:', error),
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

  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
    },
    nav: false,
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };
}
