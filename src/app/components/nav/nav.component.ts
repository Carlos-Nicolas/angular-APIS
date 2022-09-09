import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service'
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile:User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login(){
    // this.authService.login("pasitas@pasitas.com","123445")
    // .subscribe( rta => {
    //   this.token = rta.access_token
    // })
    this.authService.loginAndGet('pasitas@pasitas.com','123445')
    .subscribe( user => {
      this.profile = user;
      // this.token = '---';
    })
  }

  // getProfile(){
  //   this.authService.profile(this.token)
  //   .subscribe(user=>{
  //     this.profile = user;
  //   })
  // }


}
