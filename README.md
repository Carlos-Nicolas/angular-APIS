# Solicitudes GET

El verbo **HTTP GET** en JavaScript suele utilizarse para la obtención de datos. Por ejemplo, una lista de productos o el detalle de un único producto en particular.

# Pasos para el consumo de API con Angular

El primer paso para el consumo de API con Angular es la importación del módulo correspondiente y los servicios, luego sigue la siguiente guía para proceder en tu camino.

## 1. Importa los módulos
Asegúrate de importar HttpClientModule en el módulo principal de tu proyecto.


```js
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## 2. Crea un servicio en tu proyecto
Crea un servicio en tu proyecto que será el responsable de todas las peticiones HTTP que tu aplicación necesite. Dicho servicio tiene que importar el cliente HTTP de Angular `HttpClient` para realizar los llamados a una API.

```js
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`https://example.com/api/productos`);
  }
}
```

## 3. Importa los componentes
Importa el nuevo servicio en el componente que necesite realizar peticiones HTTP.

```js
// components/catalogo/catalogo.component.ts
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

  public productos: Producto[] = [];

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.apiService.getProducts()
      .subscribe(res => {
        this.productos = res;
      });
  }
}
```

En Angular, cuando un componente tiene la necesidad de realizar una petición HTTP antes de ser renderizado suele utilizarse el hook `ngOnInit()` que forma parte del Ciclo de Vida de un componente.


