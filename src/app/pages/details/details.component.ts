import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  productDetails: IProduct | null = null; //
  // productDetails: IProduct = {} as IProduct;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.productsService.getSpecificProduct(productId).subscribe({
          next: (res) => {
            console.log(res.data);
            this.productDetails = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
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

  changeImg(img: string) {
    document.querySelector('.imageCover')?.setAttribute('src', img);
  }
}
