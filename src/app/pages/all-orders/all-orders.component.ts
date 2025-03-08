import { Component, PLATFORM_ID, inject } from '@angular/core';
import { OrdersService } from '../../core/services/orders/orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { IOrders } from '../../shared/interfaces/iorders';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-orders',
  imports: [DatePipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
})
export class AllOrdersComponent {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);

  orders: IOrders[] = [];

  ngOnInit(): void {
    this.authService.saveUserData();
    this.getOrdersData();
  }

  getOrdersData(): void {
    this.ordersService.getUserOrders().subscribe({
      next: (res) => {
        console.log(res);
        this.orders = res;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  getStatus(order: IOrders): string {
    if (!order.isPaid) return 'Pending';
    if (order.isPaid && !order.isDelivered) return 'Processing';
    if (order.isDelivered) return 'Delivered';
    return 'Unknown';
  }

  getStatusClass(order: IOrders): string {
    const status = this.getStatus(order).toLowerCase();
    return status;
  }
}
