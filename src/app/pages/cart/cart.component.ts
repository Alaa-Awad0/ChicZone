import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { OrdersService } from '../../core/services/orders/orders.service';


@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);


  cartDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data); //contains {total cart price and products [{}] }
        this.cartDetails = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItem(id: string): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeSpecificCartItem(id).subscribe({
          next: (res) => {
            console.log(res.data); //contains {total cart price and products [{}] }
            this.cartDetails = res.data; //! important
            this.cartService.cartNum.set(res.numOfCartItems) ;
          },
          error: (err) => {
            console.log(err);
          },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
    
  }

  updateCount(id: string, count: number): void {
    this.cartService.updateProductQuantity(id, count).subscribe({
      next: (res) => {
        console.log(res.data); //contains {total cart price and products [{}] }
        this.cartDetails = res.data; //! important
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveIdCart(cartId: string): void {
    this.ordersService.cartId = cartId;
  }

  clearCart():void{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: (res) => {
            console.log(res);
            if (res.message === 'success') {
              this.cartDetails =  {} as ICart;
              this.cartService.cartNum.set(0) ;
    
            }
          },
          error: (err) => {
            console.log(err);
          },
        })
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });

   
  }
}
