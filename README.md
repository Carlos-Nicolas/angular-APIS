# **Http basic**

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


# Detalle de producto


La `solicitudes GET` suelen utilizarse tanto para obtener un conjunto de registros, como para obtener uno solo. A continuación conocerás más sobre el proceso para crear una aplicación.


# Cómo obtener un producto por ID

Cuando necesites obtener datos de un registro individual a través de su ID, el endpoint correspondiente para la petición suele recibir esa información como parte de su URL, por ejemplo `https://example.com/api/producto/12`, para obtener el producto con ID 12.

No es del todo una buena práctica que un endpoint GET reciba datos por medio de un body. Es posible, pero no recomendable y no es natural en una API Rest. Tenlo en cuenta si eres tú quien desarrolla el backend también.


```js
// services/api.service.ts
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

  getProduct(idProduct: number): Observable<Product> {
    return this.http.get<Product>(`https://example.com/api/productos/${idProduct}`);
  }
}
```

En el servicio para realizar las peticiones HTTP, el método `getProduct()` recibe el ID como parámetro para concatenarlo a la URL.

# Simulando una API

Si no tienes a disposición una API real para construir tu App, puedes simular peticiones HTTP en Angular con lo que se conoce como mock de datos. Un objeto que mantiene la estructura de datos real que tendrá la información de tu aplicación.


```js
// services/api.service.ts
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getProduct(idProduct: string): Observable<Product> {
    return of(
      {
        id: 1,
        name: 'Automobil de juguete',
        precio: 100,
        image: 'https://static3.depositphotos.com/1000865/118/i/600/depositphotos_1183767-stock-photo-toy-car.jpg'
      }
    );
  }

}
```

Utilizando la función `of` importándola desde `RxJS`, esta función convierte lo que sea que le envíes como parámetro, en un observable.

De esta manera, tu componente recibirá la respuesta del observable como si fuese una API real que responde datos para construir tu aplicación.


# Implementando slides

Una necesidad crucial cuando se trabaja con Angular es la importación de componentes de terceros para un rápido desarrollo y utilización de los mismos.

## Cómo importar componentes de terceros
Anímate a crear un carrusel de imágenes utilizando librerías como [SwiperJS](https://swiperjs.com/angular). Luego, instala la dependencia con el comando `npm i swiper` e impórtala en el módulo principal de tu aplicación para que esté lista para utilizarse.

```js
mport { SwiperModule } from 'swiper/angular';
@NgModule({
  imports: [SwiperModule],
})
export class AppModule {}
```

Es importante que sepas importar y utilizar este tipo de componentes ya listos para ser utilizados y agilizar así el desarrollo de cualquier aplicación.


# Solicitudes POST

Llega el momento de crear registros a través de una API y para esto, siempre se utiliza el verbo HTTP POST.

## Tipado de Peticiones HTTP

Descubre a continuación cómo utilizar el cliente HTTP de angular para tipar tu solicitiud GET y crear un producto.



## 1. Crea interfaces para tipar el producto y su categoría

Siempre es aconsejable tipar los datos y evitar el uso del tipo `any`, ya que aumenta la posibilidad de errores en tu aplicación. Para esto, creamos varias interfaces para tipar el Producto y la Categoría del producto:


```js
// interfaces producto.interface.ts
export interface Category {
  idCategory: string;
  category: string;
}
export interface Product {
  id: number;
  name: string;
  precio: number;
  description: string;
  image: string;
  category: Category;
}
```
Observa que la interfaz de Producto tiene un ID y una Category. Normalmente, una petición POST no recibe una ID ni tampoco un objeto del tipo category. **El ID es autogenerable** en la base de datos y la categoría suele recibirse solo el identificador de la misma.

## 2. Genera otra interfaz Producto
Para solucionar esto, puedes crear otra interfaz y gracias a características propias de **TypeScript**, puedes extender el uso de la interfaz Producto y omitir los campos que no sirven para una petición POST.

```js
// interfaces producto.interface.ts
export interface CreateProducto extends Omit<Product, 'id' | 'category'> {
  idCategory: string;
}
```
## 3. Logra tipar por completo tu solicitud POST
Ahora es posible tipar por completo tu solicitud POST. Tanto los datos que envías en el body de la petición como los datos que recibirás en la respuesta.

```js
// services/api.service.ts
import { CreateProducto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  createProduct(body: CreateProducto): Observable<Producto> {
    return this.http.post<Producto>(`https://example.com/api/productos`, body);
  }
}
```

## 4. Importa los servicios e interfaces
Desde tu componente puedes importar el servicio, las interfaces que necesites y podrás crear los objetos y realizar la petición POST para crear el Producto.

```js
// components/catalogo/catalogo.component.ts
createProduct(): void {
  const body: CreateProducto = {
    name: 'Nuevo producto',
    precio: 100,
    description: 'Descripción del producto',
    image: 'https://example.com/image',
    idCategory: '1'
  };
  this.apiService.createProduct(body)
    .subscribe((p: Product) => {
        // Guardamos el nuevo producto, en el Array de productos junto con los otros.
        this.productos.push(p);
    });
}
```


Este tipo de endpoints suele recibir un body con los datos que necesita el registro para construirse. En caso de éxito, el mismo tiene que devolver el objeto recientemente insertado en la base de datos para actualizar inmediatamente el front-end.

# Solicitudes PUT y PATCH

Los **endpoints GET** se utilizan para la obtención de datos, los **endpoints POST** para crearlos. Es momento de **actualizarlos con PUT y PATCH**.

# PUT vs. PATCH, ¿cuál es la diferencia?

Técnicamente, los **endpoints PUT** deberían recibir todos los datos del registro a actualizar. Por ejemplo, el título, la descripción, el precio, la categoría, etc. En cambio, **PATCH** debería solo recibir un campo individual a actualizar como solo el título, o solo la categoría.

De todos modos, también puedes utilizar endpoints del tipo PUT que reciban un solo dato a actualizar. Ten en cuenta que **PUT** es mucho más utilizado que **PATCH**, pero si quieres refinar y ser estricto con tu backend y seguir a raja tabla las buenas prácticas, PATCH es ideal para este tipo de actualizaciones de tus datos.

## Como generar una actualización de registros

Para las solicitudes PUT y PATCH y generar una actualización de registros sigue los siguientes pasos.


## **1. Crea las interfaces necesarias**
Crea las interfaces necesarias para actualizar los datos. Recuerda que la interfaz `CreateProducto` extendía de `Product` y a su vez omita los campos que no necesita utilizar.

```js
// interfaces/producto.interface.ts
export interface Product {
  id: number;
  name: string;
  precio: number;
  description: string;
  image: string;
  category?: Category;
}

export interface CreateProducto extends Omit<Product, 'id' | 'category'> {
  idCategory: string;
}
```

A partir de aquí, crea la interfaz `UpdateProducto` que extiende de `CreateProducto` y a su vez utiliza una nueva característica de TypeScript llamada `Partial<>` que coloca como opcionales todos los campos. Al ser todos los campos opcionales, puedes utilizar esta interfaz para solicitudes PUT o PATCH según tengas la necesidad.

```js
// interfaces/producto.interface.ts
export interface UpdateProducto extends Partial<CreateProducto> { }
```

## **2. Maneja interfaces para HTTP**

Utiliza estas nuevas interfaces en el servicio para realizar peticiones HTTP

```js
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

 // ...

  updateProductPUT(idProduct: number, body: UpdateProducto): Observable<Product> {
    return this.http.put<Product>(`https://example.com/api/productos`, body);
  }

  updateProductPATCH(idProduct: number, body: UpdateProducto): Observable<Product> {
    return this.http.patch<Product>(`https://example.com/api/productos`, body);
  }
}
```

Ya sea que los endpoints del backend sean PUT o PACH, podrás realizar la solicitud y mantener tus datos tipados y tu aplicación más segura de errores.

## **3. Haz la solicitud para actualizar el producto**

Finalmente, desde tu componente, realiza la solicitud para actualizar el producto. Cuando recibas el producto actualizado, deberás reemplazarlo por el producto viejo en tu lista de productos.

```js
// components/catalogo/catalogo.component.ts
updateProduct(idProduct: number): void {
    const body: UpdateProducto = {
      name: 'Nuevo nombre del producto',
    };
    this.apiService.updateProductPATCH(idProduct, body)
      .subscribe(p => {
        // Reemplazamos el producto actualizado en el Array de productos
        const index = this.productos.findIndex(product => product.id === p.id);
        this.productos[index] = p;
      });
}
```

Si no utilizas PATCH y todos tus endpoints son PUT, eso está bien. No tiene que preocuparte.

# Solicitudes DELETE

En programación, el verbo **HTTP DELETE** se utiliza para solicitudes que eliminen del registro una base y puedan modificar el estado del servidor a diferencia de los verbos **HEAD y GET**.

# Borrando registros en Javascript

El **DELETE** es mucho más sencillo, ya que no necesitas de tipado de datos. Solo con el ID del registro que quieres borrar suele ser suficiente.

```js
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,) { }
  
  // ...

  deleteProduct(idProduct: number): Observable<boolean> {
    return this.http.delete<boolean>(`https://example.com/api/productos/${idProduct}`);
  }
}
```
Este tipo de endpoint suele devolver un booleano, o un objeto con alguna propiedad booleana, que indica si el registro fue borrado o no. Desde tu componente, únicamente le envías el ID como parámetro al método y si el registro fue borrado correctamente, puedes eliminarlo de tu lista de productos.

```js
// components/catalogo/catalogo.component.ts
deleteProduct(idProduct: number): void {
    this.apiService.deleteProduct(idProduct)
      .subscribe(p => {
        if (p) {
          // Borramos el producto del Array de productos
          const index = this.productos.findIndex(product => product.id === idProduct);
          this.productos.splice(index, 1);
        }
      });
}
```
#  Baja lógica vs. baja física

Los endpoints del tipo **DELETE**, realmente no borran el registro como tal en la base de datos la mayoría de veces. En cambio, únicamente modifican un booleando colocándolo en `false` para que dicho registro ya no esté disponible.

A eso se lo conoce como Baja Lógica, mientras que la Baja Física si borra el registro completamente de la base de datos sin poder recuperarse. Es importante que conozcas la diferencia, ya que en aplicaciones profesionales suele utilizarse siempre la Baja Lógica, el registro ya no estará disponible, pero continúa existiendo.

# Borrando registros en Javascript

El **DELETE** es mucho más sencillo, ya que no necesitas de tipado de datos. Solo con el ID del registro que quieres borrar suele ser suficiente.


```js
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,) { }
  
  // ...

  deleteProduct(idProduct: number): Observable<boolean> {
    return this.http.delete<boolean>(`https://example.com/api/productos/${idProduct}`);
  }
}
```

Este tipo de endpoint suele devolver un booleano, o un objeto con alguna propiedad booleana, que indica si el registro fue borrado o no. Desde tu componente, únicamente le envías el ID como parámetro al método y si el registro fue borrado correctamente, puedes eliminarlo de tu lista de productos.


```js
// components/catalogo/catalogo.component.ts
deleteProduct(idProduct: number): void {
    this.apiService.deleteProduct(idProduct)
      .subscribe(p => {
        if (p) {
          // Borramos el producto del Array de productos
          const index = this.productos.findIndex(product => product.id === idProduct);
          this.productos.splice(index, 1);
        }
      });
}
```

# Baja lógica vs. baja física

Los endpoints del tipo **DELETE**, realmente no borran el registro como tal en la base de datos la mayoría de veces. En cambio, únicamente modifican un booleando colocándolo en `false` para que dicho registro ya no esté disponible.

A eso se lo conoce como Baja Lógica, mientras que la Baja Física si borra el registro completamente de la base de datos sin poder recuperarse. Es importante que conozcas la diferencia, ya que en aplicaciones profesionales suele utilizarse siempre la Baja Lógica, el registro ya no estará disponible, pero continúa existiendo.
# Url Parameters / Paginación

Los endpoints del tipo GET suelen recibir información por parámetros de URL. Por ejemplo:

- https://example.com/api/productos?offset=0&limit=10
- https://example.com/api/productos?q=XXXXX

# Pasaje de parámetros en Angular

Angular posee un método sencillo para construir varias URL con parámetros para realizar consultas en API.

```js
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getProductsParams(offset: number, limit: number): Observable<any> {
    return this.http.get<Product[]>(`https://example.com/api/productos`, { params: { offset, limit } });
  }
}
```
Al avanzar al segundo argumento de las peticiones tipo GET un objeto `params`, Angular automaticamente convertirá las variables que entregues en `?offset=0&limit=10`, utilizando sus respectivos nombres.


En este ejemplo, las variables `offset` y `limit` suelen utilizarse para crear un paginador de registros. Offset (a veces también llamado “skip”) indica desde qué posición de la cantidad total de registros el backend tiene que devolver y Limit la cantidad total.

```js
// components/catalogo/catalogo.components.ts
getProductsParams(): void {
    this.apiService.getProductsParams(0, 10)
      .subscribe(res => {
        this.productos = res;
      });
}
```


Al realizar la petición al backend, estamos indicando que devuelva desde la posición 0 un total de 10 registros. Si pasáramos los parámetros `(30, 15)`, estaríamos indicando que desde el registro número 30 nos devuelva una cantidad de 15.

Un buen backend suele permitir este tipo de paginación y dinamismo en sus endpoints que devuelven grandes cantidades de registros.
 
 # Observable vs. Promesa


JavaScript posee dos maneras de manejar la asincronicidad, a través de: **Observables y Promesas**, que comparten el mismo objetivo, pero con características y comportamientos diferentes.

# ¿Qué es la asincronicidad en JavaScript?

La **asincronicidad** se refiere a cuando Javascript utiliza procesos asíncronos para realizar muchas tareas a la vez, tareas que pueden tomar determinado tiempo o nunca finalizar. Es decir, este lenguaje de programación es un monohilo y esto significa que solo puede hacer una cosa a la vez y la ejecución de un proceso demorará a los que vengan posteriormente hasta que este termine.

Es así como la lectura de archivos o las peticiones HTTP son procesos asíncronos y se requiere de un método para manipular este tipo de procesos como los observables y promesas.

# ¿Qué son los observables?

Gran parte del ecosistema Angular está basado en observables y la librería RxJS es tu mejor aliado a la hora de manipularlos. El patrón de diseño “observador” centraliza la tarea de informar un cambio de estado de un determinado dato o la finalización de un proceso, notificando a múltiples interesados cuando esto sucede sin necesidad de que tengan que consultar cambios activamente.

# Características de los Observables en Javascript
- Emiten múltiples datos
- Permiten escuchar cualquier tipo de proceso, (peticiones a una API, lectura de archivos, etc.)
- Notifican a múltiples interesados
- Pueden cancelarse
- Manipulan otros datos (transformar, filtrar, etc.) con RxJS.
- Son propensos al callback hell.

## Ejemplos con Observables

```js
 import { Observable } from 'rxjs';
 
 const getAnObservable$ = () => {
    return new Observable(observer => {
        observer.nest('Valor 1');
        observer.nest('Valor 2');
        observer.nest('Valor 3');
    });
 };
 (() => {
   getAnObservable$
     .pipe(
        // Manipulación de resultados con RxJS
     )
     .subscribe(res => {
       console.log(res);
     });
 })
 ```

 # ¿Qué son las promesas?

 Las **promesas** son un método algo más sencillo y directo para manipular procesos asincrónicos en Javascript. Además,
estos objetos tienen dos posibles estados:

- Resuelto
- Rechazado
Dependiendo si el proceso asincrónico se ejecutó correctamente hubo algún error.

Desde el año 2017 se especificó en el estandar de EcmaScript la posibilidad de manipular promesas de una manera mucho más fácil con **async/await**. Async para especificar que una función es asíncrona y Await para esperar por el resultado sin bloquear el hilo de ejecución.

# Características de las Promesas
- Ofrecen mayor simplicidad
- Emiten un único valor
- Evitan el callback hell
- No se puede cancelar
- Proveen una robusta API nativa de Javascript disponible desde ES 2017
- Constituyen librerías populares como **AXIOS** o **Fetch**

# Ejemplos con Promesas

```js
// Promesas con .then() y .catch()
const p = new Promise((resolve, reject) => {
  setTimeout(function(){
    resolve("¡Hola Promesa!");
  }, 1000);
});
p.then((result: string) => {
  console.log(result);        // ¡Hola Promesa!
}).catch(err => {
  console.log(err);           // En caso de error
});

// Promesas con async/await
(async () => {
    const p = await new Promise((resolve, reject) => {
      setTimeout(function(){
        resolve("¡Hola Promesa!");
      }, 1000);
    }).catch(err => {
      console.log(err);           // En caso de error
    });;
    console.log(p);            // ¡Hola Promesa!
});
```

# Observable a Promesa
Una característica más de RxJS es la posibilidad de convertir fácilmente un **Observable a Promesa**:
```js
import { of, firstValueFrom, lastValueFrom } from 'rxjs';

observableToPromise(): Promise<string> {
    return lastValueFrom(of('¡Soy una promesa!'));
}
```

La función of devuelve en forma de observable lo que sea que le coloques dentro. La función `firstValueFrom` o `lastValueFrom` devuelve el primer (o último) valor que el observable emita en forma de promesa.


# Promesa a Observable


De manera muy similar, puedes convertir una Promesa en un Observable:

```js
import { from } from 'rxjs';

PromiseToObservable(): Promise<Observable<any>> {
    return from(new Promise((resolve, reject) => { console.log('¡Soy un observable!') }));
}
```

La función `from` de RxJS convertirá una promesa en observable para que puedas manipular y suscribirte a la emisión de sus datos.


# Reintentar una petición

Gracias a los **observables** en conjunto con **RxJS** puedes fácilmente implementar funcionalidades que de lo contrario sería complejo desarrollar por tu cuenta.


# Reintento automático de peticiones fallidas

Para reintentar peticiones HTTP, puedes hacer que automáticamente vuelva a realizar otro intento si este llegara a fallar. Sería muy complejo su desarrollo casero ya que hay que recurrir a la recursividad y asincronicidad al mismo tiempo.

```js
// services/api.service.ts
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getProduct(idProduct: number): Observable<Product> {
    return this.http.get<Product>(`https://example.com/api/productos/${idProduct}`)
      .pipe(
        retry(2)
      );
  }

}
```
El método `.pipe()` de los observables permite manipular datos y con la función `retry()` de **RxJS** le indicas la cantidad de reintentos que buscas para que la petición lo haga en caso de fallar.


# **Bunenas Practicas**

# El problema de CORS

**Cross Origin Resource Sharing (CORS)** o en español, **Intercambio de Recursos de Origen Cruzado**, es un mecanismo de seguridad para la solicitud e intercambio de recursos entre aplicaciones con dominios diferentes. En pocas palabras, si las solicitudes HTTP se realizan desde un dominio diferente al dominio del backend, estas serán rechazadas.

Si eres desarrollador o desarrolladora front-end, tendrás problemas de **CORS** a lo largo de tu carrera y en múltiples oportunidades. Pero no te preocupes, es completamente normal y vamos a ver de qué se trata para evitar dolores de cabeza.

# **Cómo habilitar el dominio**

Si **CORS** no está habilitado en el backend que estés consultando, las peticiones se bloquearán y verán un error en la consola de desarrollo del navegador.

Dependerá del equipo back end o de ti si también estás desarrollándolo, de habilitar el dominio del front-end desde el cual se ejecutarán las peticiones.

La habilitación del dominio suele ser muy sencilla y dependerá del lenguaje de programación y framework que estés utilizando, pero suele verse de la siguiente manera:


```js
// MAL: Un * da permisos a cualquier dominio de realizar peticiones, es una muy mala práctica de seguridad.
cors({ origin: '*' })

// BIEN: Lo ideal es solo permitir los dominios que queremos autorizar a realizar peticiones.
cors({ origin: ['mydomain.com', 'app.mydomain.com'] })
```
# **Entornos donde se produce este error**

Este error suele producirse principalmente en entornos de desarrollo o productivos reales, en servidores en la nube. No es tan habitual que suceda en entornos locales, ya que aplicaciones como Postman o Insomnia para realizar pruebas de petición HTTP, cambian el origen de las peticiones y evitan este problema.
 
# **Manejo de ambientes**

Los desarrolladores o desarrolladoras del `Core de Angular` ya pensaron en todos los problemas típicos que ocurren cuando programas en front-end. Uno de ellos es la posibilidad de diferenciar entre ambientes de un mismo proyecto.


# **Ambientes de Desarrollo y Producción**

En tu proyecto de Angular encontrarás una carpeta llamada environments y por defecto con dos archivos dentro:

- environments.ts
- environments.prod.ts

Ambos lucen de manera muy similar.

```js
// environments.ts
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};
```

```js
// environments.prod.ts
export const environment = {
  production: true
};
```

Presta atención a los comentarios en el archivo `environments.ts`, pues explican como Angular, cuando compila la aplicación, se reemplaza por el correspondiente dependiendo del ambiente.


Busca en el archivo `angular.json` la propiedad fileReplacements:

```js
// angular.json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
],
```

Como claramente indica, el archivo `environment.ts` será reemplazado por `environment.prod.ts` al compilar la aplicación en modo producción.

# **Compilando en Modo Desarrollo y Producción**

Cuando haces un `ng serve`, la aplicación se compila en modo desarrollo por defecto. Esta configuración también puedes cambiarla en el `angular.json`:

```js
// angular.json
"serve": {
  ...
  "defaultConfiguration": "development"
},
```

Es equivalente a hacer un `ng serve --configuration development`.

Mientras que cuando haces un `ng serve --configuration production` se compila en modo producción y utilizará las variables de entorno que le corresponda.

De esta manera puedes manejar N cantidad de ambientes, cada uno con sus propias variables de entorno y su propia configuración dependiendo la necesidad.


# **Manejo de errores**

Las **peticiones HTTP** que tu aplicación realiza pueden fallar por una u otra razón. Recuerda que una aplicación profesional tiene que contemplar estos escenarios y estar preparada para cuando esto suceda.

# **Manejo de Errores con RxJS**

Ya hemos visto anteriormente la función `retry()` de RxJS para reintentar una petición en caso de fallo. Pero si el error persiste, veamos cómo es posible manejar los mismos.

# 1. Imports desde RxJS

Presta atención a las siguientes importaciones desde **RxJS** y `@angular/common/http` que utilizaremos.

```js
// service/api.service.ts
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    // ...
}
```

# 2. Manejo de errores con catchError()

Agrega a los métodos que realizan las solicitudes HTTP un `.pipe()` para manipular los datos que el observable emita antes de enviarlos al componente.
Aquí estamos utilizando `catchError` de RxJS para capturar los errores y le pasamos un método personalizado llamado `handleErrors()` para centralizar el manejo de los mismos (Así no repetimos el mismo código en todos los pipes).


```js
// service/api.service.ts
getProduct(idProduct: number): Observable<Product> {
  return this.http.get<Product>(`https://example.com/api/productos/${idProduct}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        return this.handleErrors(err)
      })
    );
}
  
handleErrors(error: HttpErrorResponse): Observable<never>  {
  if (error.status == HttpStatusCode.Forbidden)
    return throwError('No tiene permisos para realizar la solicitud.');
  if (error.status == HttpStatusCode.NotFound)
    return throwError('El producto no existe.');
  if (error.status == HttpStatusCode.InternalServerError)
    return throwError('Error en el servidor.');
  return throwError('Un error inesperado ha ocurrido.');
}
```

# 3. Identifica el tipo de error
 
 Dicho método recibe un parámetro del tipo `HttpErrorResponse` que Angular nos provee para tipar errores HTTP. Utilizando el enumerado `HttpStatusCode` puedes determinar qué tipo de error se produjo. Si fue un error 403, 404, 500, etc. Fácilmente, puedes verificarlo y devolver un error al componente con `throwError` y un mensaje personalizado.

 ```
 NOTA: Más allá de este enum que Angular nos facilita, es muy importante que como desarrollador de software sepas diferenciar lo que significa un 401, 403, 404, 500, 501, entre otros estados HTTP. Poco a poco lo irás aprendiendo.
 ```

 # 4. Captura los errores en los componentes

 En tu componente, captura los errores en las suscripciones de la siguiente manera:

 ```js
 // components/catalogo/catalogo.component.ts
this.apiService.getProducts()
  .subscribe(res => {
    this.productos = res;
  }, err => {
    alert(err);     // Aquí se emitirá el alerta con el mensaje que `throwError` devuelva.
  });
  ```

Así, ya puedes diferenciar los errores y comunicarle al usuario si algo salió mal de la manera más apropiada, mostrándole un mensaje o una alerta.

# **Evitando el callback hell**

Uno de los principales problemas de los observables es el Callback Hell. La anidación de N cantidad de suscripciones, una dentro de la otra, vuelve tu código muy difícil de mantener y de leer.


# Cómo solucionar el Infierno de Callbacks

Utilizando promesas, puedes resolver este problema fácilmente con `async/await`. Pero si hablamos de observables, nuestra mejor amiga, la librería RxJS, llega para aportar su solución.

Un ejemplo común de esta problemática en Angular es como la siguiente.

```js
readAndUpdate(): void {
  // Ejemplo de callback hell
  this.apiService.getProduct(1)
    .subscribe(res => {
      this.apiService.updateProduct(1, { name: 'Nuevo nombre del producto' })
        .subscribe(res2 => {
          // ...
        });
    });
}
```

Donde se está realizando una petición para la lectura de un producto e inmediatamente se está actualizando el mismo. Generando un `subscribe` dentro de otro.

# ¿Cómo resolver este problema de Callback Hell?

Tal vez hasta dos subscribe es aceptable, pero no se recomienda continuar con esa estructura de código y es posible resolverlo de la siguiente manera.

```js
import { switchMap } from 'rxjs/operators';
readAndUpdate(): void {
  // Solución callback hell
  this.apiService.getProduct(1)
    .pipe(
      switchMap(products => this.apiService.updateProduct(1, { name: 'Nuevo nombre' }) )
    )
    .subscribe(res => {
      // Producto actualizado
    });
}
```

Importando `switchMap` desde `rxjs/operators`, lo que hace esta función es recibir el dato que emite un observable, y utilizarlo como input para el segundo. De esta manera, el código queda más limpio y profesional.


# Conoce más sobre RxJS

Otra alternativa que brinda RxJS es la posibilidad de manipular varios observables al mismo tiempo. Con las promesas, puedes hacer uso de `Promise.all([])` para realizar N procesamientos asincrónicos en paralelo y obtener sus resultados.

De forma muy similar, en **RxJS** puedes hacer lo siguiente.

```js
import { zip } from 'rxjs';
readAndUpdate(): void {
  // Agrupando observables en un mismo subscribe
  zip(
    this.apiService.getProduct(1),
    this.apiService.updateProductPATCH(1, { name: 'Nuevo nombre' })
  )
  .subscribe(res => {
    const get = res[0];
    const update = res[1];
  });
}
```

Importando la función `zip`, puedes crear un array de observables y suscribirte a todos ellos al mismo tiempo. Diferenciando por el índice de cada uno el resultado de la operación que ejecutaron para obtenerlo.


# ****Auth****


# **Login y manejo de Auth**

Muchas aplicaciones hoy en día requieren de un Login para identificar al usuario y que pueda interactuar con la plataforma.

# Login de Usuarios

Veamos a continuación buenas prácticas para el manejo de sesiones con Angular.

1. Interfaces para tipado de datos
Comencemos creando algunas interfaces para conocer y tipar la estructura de los datos.

```js

// interfaces/user.interface.ts
export interface Credentials {
  email: string;
  password: string;
}
export interface Login {
  access_token: string;
}
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}
```

Hemos creado tres interfaces.

- **Credentials** para tomar los datos necesarios para registrar a un usuario
- **Login** que contiene la respuesta al registrar exitosamente un usuario
- **User** la interfaz que contiene la estructura de datos de un usuario

2. Servicio para el manejo del Login
Crea un simple servicio que manejará todo lo relacionado con inicios de sesión de los usuarios.

```js
// services/auth.service.ts
import { Credentials, Login, User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(credentials: Credentials): Observable<Login> {
    return this.http.post<Login>(`https://example.com/api/login`, credentials);
  }
}
```

3. Inicio de sesión desde el componente
Desde el componente que contiene el formulario de login, realizamos el inicio de sesión del usuario.

```js
// components/login/login.components.ts
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Credentials, Login, User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private auth: AuthService) { }

  loginUser(): void {
    const credentials: Credentials = {
      email: 'user@gmail.com',
      password: '123456',
    };
    this.auth.loginUser(credentials)
      .subscribe((res: Login) => {
        localStorage.setItem('platzi_token', res.access_token);
      });
  }
}
```
En este ejemplo, efectuamos el login de un usuario con su email y password. El backend suele devolver el token de autenticación del usuario o un access_token. Lo guardamos en Local Storage o en el store que sea de tu preferencia.


# **Manejo de headers**

Luego de que el usuario se halla registrado, puedes utilizar el token para realizar peticiones al backend que requieran de autenticación. Para esto, es necesario inyectar dicho token en las solicitudes HTTP.

# Autenticación del Usuario

Para esto, puedes obtener el token desde Local Storage (o si prefieres guardarlo en Cookies) e inyectarlo directamente en los Headers de la petición.

```js
// services/auth.service.ts
getProfileUser(): Observable<User> {
  const token = localStorage.getItem('platzi_token');
  return this.http.get<User>(`https://example.com/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
```

El protocolo de este tipo de token suele emplear la palabra Bearer seguido de un espacio por delante del propio token.

Puede ser bastante engorroso tener que inyectar el token, método por método en todos los endpoints que necesitas consumir. Puedes simplificar esto con una única función que construya los headers.

```js
// services/auth.service.ts
import { HttpHeaders } from '@angular/common/http';

getProfileUser(): Observable<User> {
  return this.http.post<User>(`https://example.com/api/profile`, this.getHttpHeaders());
}

getHttpHeaders() {
  const token = localStorage.getItem('platzi_token');
  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}
```

La clase `HttpHeaders` construye los header en la función `getHttpHeaders()` y llamas a dicha función para que inyecte los headers en cada solicitud.


Es una forma más elegante y limpia de inyectar los headers necesarios en tus solicitudes.

# Uso de interceptores

Los **Interceptores** de Angular llegan para facilitar la manipulación de las peticiones que tu aplicación realiza.

 # Mi Primer Interceptor

 Un interceptor, como su nombre indica, interceptará las solicitudes HTTP antes de que se envíen al servidor, para agregar información a las request, manipular datos, entre otras utilidades.

 1. Crea el interceptor

 Con el CLI de Angular, puedes crear un interceptor con el comando 
 `ng generate interceptor <interceptro_name>`. En este ejemplo, generaremos un interceptor para manipular los errores HTTP en toda tu aplicación.


 ```js
 // interceptors/errors.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      );
  }
}
```

2. Inyección del interceptor
Lo interceptores son muy similares a los Servicios, pero se inyectan en el módulo de tu app de una forma diferente.


```js
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@NgModule({
  // ...
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor
    }
  ]
})
export class AppModule { }
```

Importando primeramente `HTTP_INTERCEPTORS` desde `@angular/common/http`, puedes importar tu propio interceptor. Ahora, todas las solicitudes que salgan de tu aplicación, se interceptarán por el mismo.

# Manejo de errores con un interceptor

Un buen uso para los interceptores es el manejo de errores. Como casi todo en Angular utiliza Observables, los interceptores no son la excepción y puedes apoyarte de RxJS para manipular la emisión de los datos del observable.

```js
// interceptors/errors.interceptor.ts
intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401)
          return throwError('No posee permisos suficientes.');
        else if (error.status === 403)
          return throwError('Acceso prohibido.');
        else if (error.status === 404)
          return throwError('Registro no encontrado.');
        else
          return throwError('Ha ocurrido un error inesperado.');

      }),
    );
}
```

Implementa esta lógica para identificar el tipo de respuesta del backend y realizar una u otra acción dependiendo el error.

# Enviar Token con un interceptor

El uso principal para los Interceptores es para la inyección del token en las request.

# Inyección de token

Veamos cómo puedes utilizar los interceptores para la inyección de token a las solicitudes HTTP.

1. **Crea el interceptor**

Para esto, crea un nuevo interceptor que lea el token desde el storage donde decidiste guardarlo y posteriormente inyectarlo en las peticiones.

```js
// interceptors/token-interceptor.interceptor.ts
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    return next.handle(request)
  }

  private addHeaders(request: HttpRequest<any>) {
    let token: string | null = '';
    token = localStorage.getItem('platzi_token');
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      return request;
    }

  }
}
```

2. **Duplicando la solicitud**

La función `addHeaders()` recibe la request y usando `clone()` crea una copia de si misma para inyectar el token. De no existir este, devuelve la request tal cual fue recibida.
De esta manera, limpias por completo tu servicio que se ocupa de la autenticación de usuarios y centralizas toda la lógica de inyección de headers en el interceptor.

Y no olvides de importar el nuevo interceptor en tu módulo.

```js
// app.module.ts
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { TokenInterceptorService } from './interceptors/token-interceptor.interceptor';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ]
})
export class AppModule { }
```
Agrégalo a los `providers` y si ya tienes otro interceptor, también agrega la propiedad `multi: true` a cada uno de ellos.


# **Creando un contexto a interceptor**

Suele ocurrir que un front-end consume más de un backend diferente, con diferentes URLs, que eventualmente podrían utilizar diferentes tokens o necesitar cada uno de una manipulación diferente de la request por parte del interceptor.


# Manipulando múltiples tipos de solicitudes
Es posible crear un contexto para los interceptores para indicar si queremos que X endpoint sea interceptado o no.

1. **Importando clases necesarias**
Para esto, importando `HttpContextToken` y `HttpContext` desde `@angular/common/http` vamos a crear una función para validar si el endpoint necesita o no la inyección de un token.

```js
// interceptors/token-interceptor.interceptor.ts
import { HttpContextToken, HttpContext } from '@angular/common/http';

const ADD_TOKEN = new HttpContextToken<boolean>(() => true);

export function addToken() {
  return new HttpContext().set(ADD_TOKEN, false);
}
```

Creamos la constante **ADD_TOKEN** que indicará si el endpoint necesita de un token o no. Por defecto, todos los endpoints necesitan un token. La función `addToken()` hará que no se inyecte el token cuando no se requiere.

También puedes utilizar la lógica inversa, que ningún endpoint por defecto utilice el token y solo habilitar manualmente los que si lo requieren.


2. **Creando el contexto para las solicitudes**
En la lógica del interceptor, colocamos un **IF** para validar si la petición necesita o no del token.


```js
// interceptors/token-interceptor.interceptor.ts
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  if (request.context.get(ADD_TOKEN)) {
    request = this.addHeaders(request);
    return next.handle(request);
  } else
    return next.handle(request);
}
```
3. **Denegar la utilización del token**
Ahora, importamos dicha función y la utilizamos para que un endpoint no requiera del token.

```js
// services/auth.service.ts
import { addToken } from '../interceptors/token-interceptor.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(credentials: Credentials): Observable<Login> {
    return this.http.post<Login>(`https://example.com/api/login`, credentials, { context: addToken() });
  }
}
```
Agregamos como argumento `context` a las opciones de la solicitud. El endpoint de Login no suele necesitar de un token para funcionar, es el único que excluimos del uso del interceptor.
