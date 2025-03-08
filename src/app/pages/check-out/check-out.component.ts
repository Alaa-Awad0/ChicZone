import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrdersService } from '../../core/services/orders/orders.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
})
export class CheckOutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly cartService = inject(CartService);

  private readonly toastrService = inject(ToastrService);

  isLoading: boolean = false;
msgError: string = '';
msgSuccess: string = '';

paymentMethod: string = '';

checkOutForm!: FormGroup;

ngOnInit(): void {
  this.checkOutForm = this.formBuilder.group({
    details: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^0[0125][0-9]{9}$/)],
    ],
    city: [null, [Validators.required]],
  });
}

setPaymentMethod(method: string): void {
  this.paymentMethod = method;
}

submitForm(): void {
  if (this.checkOutForm.valid) {
    if (this.paymentMethod === 'card') {
      this.payWithCard();
    } else if (this.paymentMethod === 'cash') {
      this.payWithCash();
    }
  } else {
    this.checkOutForm.markAllAsTouched();
  }
}

payWithCard(): void {
  this.ordersService.checkOutCardPayment(this.checkOutForm.value).subscribe({
    next: (res) => {
      if (res.status === 'success') {
        this.cartService.cartNum.set(0);
        open(res.session.url, '_self');
      }
    },
    error: (err) => {
      this.toastrService.error(err.message, 'Error');
    },
  });
}

payWithCash(): void {
  this.ordersService.createCashOrder(this.checkOutForm.value).subscribe({
    next: (res) => {
      if (res.status === 'success') {
        this.cartService.cartNum.set(0);
        this.toastrService.success(res.message, 'Success');
      }
    },
    error: (err) => {
      this.toastrService.error(err.message, 'Error');
    },
  });
}
}
