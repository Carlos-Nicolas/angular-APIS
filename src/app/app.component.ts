import { Component } from '@angular/core';
import { FilesService } from './services/files.service';

import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token='';

  constructor(
    private usersService:UsersService,
    private filesService:FilesService
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

  downloadPDF(){
    this.filesService.getFile('my.pdf','https://young-sands-07814.herokuapp.com/api/files/dummy.pdf','application/pdf')
    .subscribe()
  }

}
