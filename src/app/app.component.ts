import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;

  constructor(
    private authService:AuthService,
    private usersService:UsersService,
  ){
  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.usersService.create({
      name:"carlos",
      email:"pasitas@pasitas.com",
      password:"123445"
    })
    .subscribe( rta => {
      console.log(rta);
    })
  }

  login(){
    this.authService.login("pasitas@pasitas.com","123445")
    .subscribe( rta => {
      console.log(rta.access_Token);
    })

  }
}
