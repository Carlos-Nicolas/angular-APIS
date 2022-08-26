import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry, } from 'rxjs/operators';

import { Product } from './../models/product.model';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';

import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlAPi = `${environment.API_URL}/api/products`;

  constructor(private http: HttpClient) {}


  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit',limit);
      params = params.set('offset',offset);
    }
    return this.http.get<Product[]>(this.urlAPi,{params})
    .pipe(
      retry(3)
    )
    ;
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.urlAPi}/${id}`);
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.urlAPi}`, {
      params: { limit, offset },
    });
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.urlAPi, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.urlAPi}/${id}`, dto);
  }
  delete(id: string) {
    return this.http.delete<boolean>(`${this.urlAPi}/${id}`);
  }
}
