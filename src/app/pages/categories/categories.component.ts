import { Component, OnInit, inject } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService);

  categories: ICategory[] = [];


  ngOnInit(): void {
    this.getCategoryData();
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

}
