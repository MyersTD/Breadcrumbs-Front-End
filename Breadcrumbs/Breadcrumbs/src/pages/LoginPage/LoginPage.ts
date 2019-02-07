import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../Register/Register';
import { httprequest } from '../../httprequest';
import { VALID } from '@angular/forms/src/model';
import { Storage } from '@ionic/storage';
//import { User } from '../../datastructs';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-LoginPage',
  templateUrl: 'LoginPage.html',
    providers: [httprequest]
})
export class LoginPagePage {
  @ViewChild("username") username;
  @ViewChild("password") password;
  userID: any;
  validUser: any;
  //userValidation: User; 
  data: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public request: httprequest, public storage:Storage) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPagePage');
    }
  
  signIn() {
    //this.navCtrl.push(HomePage);
    if (this.username.value == "") {
      let alert = this.alertCtrl.create({
        title: "Attention", subTitle: "Username field is empty", buttons: ["Ok"]
      });
      alert.present();
    } else
      if (this.password.value == "") {
        let alert = this.alertCtrl.create({
          title: "Attention", subTitle: "Password field is empty", buttons: ["Ok"]
        });
        alert.present();
      } 

        //this.request.SignIn(user)
   
   }

  signUp() {
    this.navCtrl.push(RegisterPage);
  }

  initialClick() {
    this.signIn();
    this.validateUser();
    console.log(this.validUser, "its true");
  }

  validateUser() {
    let user = {
      username: this.username.value,
      password: this.password.value
    }
    this.request.SignIn(user).then((data) => {
      console.log("Data %s", data);
      this.storage.set('validUser', data);
      //console.log(this.storage.get('validUser'));
    });
    this.navCtrl.push(HomePage);
  }
}
