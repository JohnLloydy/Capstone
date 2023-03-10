import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonItemSliding } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public storage: Storage,
    private userservice: UserService
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  login(userdata: any): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      // this.userservice.crudService.fetchEntity(userdata.id).subscribe( item => {
      //   this.setUserData(item);
      // });
      this.setUserData(userdata);
      
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  signup(userdata: any): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUserData(userdata);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('userdata');
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setUserData(userdata: any): Promise<any> {
    return this.storage.set('userdata', userdata);
  }

  getUserData(): Promise<string> {
    return this.storage.get('userdata').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
