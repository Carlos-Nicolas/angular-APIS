import { Component, OnInit } from '@angular/core';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    title: '',
    price: 0,
    images: [],
    description: '',
    category: {
      id: '',
      name: '',
    },
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading'|'success'|'error'|'init' = 'init' ;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0).subscribe((data) => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toogleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail= 'loading';
    this.toogleProductDetail();

    this.productsService.getProduct(id).subscribe((data) => {

      this.productChosen = data;
      this.statusDetail='success';
    },errorMsg =>{
      window.alert(errorMsg)
      this.statusDetail='error';
    });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'new Product',
      description: 'description',
      images: [''],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      this.products.push(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: `nuevo titulo`,
    };
    const id = this.productChosen.id;
    this.productsService.update(id, changes).subscribe((data) => {
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products[productIndex] = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore() {
    this.productsService
      .getProductsByPage(this.limit, this.offset)
      .subscribe((data) => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
