import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { addeventPage } from '../addevent/addevent';
import { addcontactPage } from '../addcontact/addcontact';
import { vieweventsPage } from '../viewevents/viewevents';
import { httprequest } from '../../httprequest';
import { Storage } from '@ionic/storage';
import { editeventPage } from '../editevent/editevent';
import { GoogleMap, GoogleMaps, GoogleMapOptions } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import { mapPage } from '../map/map';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [httprequest]
})

export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  inactiveEvents: any;
  userid: any;
  newEventSubmit: boolean;
  CurrentEventExists: boolean = false;
  map: any;
  location: any;
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public request: httprequest, public storage: Storage) {
    var userid = 1;
    this.storage.set('userID', userid);
  }

  ionViewWillEnter() {
    var newEvent;
    this.storage.get('lastState').then((data) => {
      if (data === 'addeventsubmit') {
        this.storage.set('lastState', 'homepageenter').then(() => {
          location.reload();
        });
      }
    }).then(() => {
      this.storage.get('newEventSubmit').then((data) => {
        newEvent = data;
        if (newEvent === true || document.getElementById("activeEventContent").innerText === "") {
          this.getActiveEvent();
          this.getInactiveEvents();
        }
      });
      });
  }

  getActiveEvent() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Event...'
    });
    loading.present().then(() => {
        this.request.RequestActiveEvent().then((data) => {
          this.storage.set('activeEvent', data['recordset'][0]);
          document.getElementById("activeEventContent").innerText = data['recordset'][0].EventName;
          this.CurrentEventExists = true;
          this.storage.set('newEventSubmit', false);
        }).catch(() => { document.getElementById("activeEventContent").innerText = "No Active Events"; this.CurrentEventExists = false; });
        loading.dismiss();
    });
  }

  getInactiveEvents() {
    this.request.RequestInactiveEvents().then((data) => {
      this.storage.set('inactiveEvents', data['recordset']);
      this.storage.set('newEventSubmit', false);
     });
  }

  LoadContacts(EventID) {
    this.request.RequestEventContacts(EventID).then((data) => {
      return data;
    });
  }

   viewMap() {
    this.navCtrl.push(mapPage);
  }

  onLink(url: string) {
      window.open(url);
  }

  addEvent() {
    this.navCtrl.push(addeventPage);
  }

  viewEvents() {
    this.navCtrl.push(vieweventsPage);
  }

  addContact() {
    this.navCtrl.push(addcontactPage);
  }

  editEvent() {
    this.navCtrl.push(editeventPage);
  }
  
  checkIn() {
    this.storage.get('activeEvent').then((data) => {
      this.request.DisableEvent(data.EventID);
    }).then(() => {
      this.CurrentEventExists = false;
      this.storage.set('newEventSubmit', true)
        .then(() => {
          location.reload();
        });
    });
    console.log("disableEvent");
  }
}
