import { Component, OnInit, inject } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

  private readonly brandsService = inject(BrandsService);

  brands: IBrand[] = [];


  ngOnInit(): void {
    this.getBrandsData();
    }

  getBrandsData(): void {
    this.brandsService.getAllbrands().subscribe({
      next: (res) => {
        this.brands = res.data;
        console.log(this.brands);
      },
      error: (error) => console.error('Error:', error),
    });
  }

}
