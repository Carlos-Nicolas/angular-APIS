import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { catchError, retry,map } from 'rxjs/operators';

import { Product } from './../models/product.model';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';

import { environment } from "../../environments/environment";
import { throwError, zip } from 'rxjs';
import { checkTime } from '../interceptors/time.interceptor';


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
    return this.http.get<Product[]>(this.urlAPi,{params, context :checkTime()})
    .pipe(
      retry(3),
      map(products => products.map(item =>{
        return  { ...item ,
        taxes: .16 * item.price
      }
      }) )
    )
    ;
  }

  fetchReadAndUpdate(id:string,dto: UpdateProductDTO){
    return   zip(
      this.getProduct(id),
      this.update(id,dto)
    )

  }


  getProduct(id: string) {
    return this.http.get<Product>(`${this.urlAPi}/${id}`)
    .pipe(
      catchError((error:HttpErrorResponse)=>{
        if (error.status === HttpStatusCode.Conflict ){
          return throwError('algo esta fallando en el servidor ')
        }
        if (error.status === HttpStatusCode.NotFound ){
          return throwError('the product don`t exist ')
        }
        if (error.status === HttpStatusCode.Unauthorized ){
          return throwError('no estas autorisado ')
        }
        return throwError('Ups algo salio mal');
      })
      )
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
