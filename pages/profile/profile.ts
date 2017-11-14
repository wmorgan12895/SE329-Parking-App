import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditInterestsPage } from '../editinterests/editinterests';
import { EditProfilePage } from '../editprofile/editprofile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  username: string;
  fname: string;
  lname: string;
  picture: string;
  interestsString: string;
  interests: any[];
  priorityInterest: string;
  cats: any[];

  numInterests: number;
  test: string;

  constructor(public navCtrl: NavController) {
    this.fname = localStorage.getItem('fname');
    this.lname = localStorage.getItem('lname');
    this.username = localStorage.getItem('username');
    this.picture = localStorage.getItem('picture');


    //parse interests string from local storage
    if(JSON.parse(localStorage.getItem('priorityInterest')) == null){
      this.priorityInterest = " ";
    }
    else{
      this.priorityInterest = JSON.parse(localStorage.getItem('priorityInterest')).interest;
    }
    this.interests = JSON.parse(localStorage.getItem('interests')).interests;
  }


  editProf(event) {
    this.navCtrl.push(EditProfilePage, {} );
  }


  editInt(event) {
    this.navCtrl.push(EditInterestsPage, {} );
  }

}

//test image
/*
'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAEsDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgQAAwUGAQf/xAAzEAACAQMDAgQEBQMFAAAAAAABAgADESEEEjEiQQVRYXEGEzKBobHB0fAUkeEjJGKC8f/EABgBAAMBAQAAAAAAAAAAAAAAAAABAwIE/8QAHBEBAQACAwEBAAAAAAAAAAAAAAECESExQQNR/9oADAMBAAIRAxEAPwDhRbvCsOYPBtCFoBOGEMQDyIQgDCXsOYakC1+fMCCBj2hBb8gmAN6dkZgAwv5GOIoDAkdN8+0RpU9lUEhtp59M8/lLtQlVwVQrZWwWz2z2m4xV1RvluUsjNnhufSQUqDDc1NQTyMcw9FpWSmxqMG3cALj+Zlppqh2ikCB6CMnM1EDm6jP5yvKmxwZsvSoUKW57ED+YHnFKlA6lTUuEc/SnpObHNawi3AllIXfPaQaeqTb5bX9o7p9C9gWBANjKsKkUtgcR2hT9LdsyxKCrx3x7RmnTUk2UEzUhWhCtYXAI9RLadIIqgW25IHFscQqdwBYEkcZ5zDCbQt93n7xk8poVp29bkA4BhkEcI/2wIa9SZGBjpzCCA5Zal/SMnLu7Vqm58AfSvlGKNO4uQbQqFFG6jeXu4VQEFpxZXyOmcKmqChUVr49THHfe5ZLlCLLMqu+9ySRtX8TGdNqGSgqWJHN+J0/PetI5yb2e2oxFwFF+3l/LS2ko3gIfqF7eUROuVVO0kE8Dy/f/ADLNLq3q2BIBvjEow0ArMAAeTnm5PeGyHpBVRxgdh/LyIXYqBYtYG9rH1+3MMoALAEg8Zyfcf3gAgFVyTuByR+sEb7dDWXsMfqZatwTYW8/I9p4GVQASw9AT+0A55Nyr0MCO4JxK6rPexG3zzeP0fD9fWsKWle/cheJVqfCNfTuaundQOcTnxx/V7WfTX51QJY7R5RrYCQhcKo+onFhG9Ppfk0bEFWb+8seipADKM9rZOZfHhK8soAM303vzHtDS31tw+lBc5llLw4NUPUUUHMcp0/6IqEAamTm5yPxzGyZdGKE9N+CM9r9pYFuVFUhSMg2z65lNN0YdLLsIN8ZMd8NomvrKKkixbjPA8vtANTw3wVaoWvqhYW6U9PWbS6WgqgCigA/4iWjiezFqil1VVsoAEzdXYqRePV6mDMuubmJqMbV6ZXfcAN3tzE61GrT44wAf8zVrckwcFDCWwXGVl02OwG4LLm5+0IoW3Mtgo6eny5J/9hVxuB289xKAwUkLzgWAlJZUrjYKp0mynbttusPzmv8ADgWtr95vemhzMKtUZy20lkU5Iva/a83/AIUYf7n/AK/rC9CdurE9laNcQ5Ntm1GLRKu3Mz3+ItMBYLUPuAPzmfqPiGmR00834vA9tCq0qFSxiCeKUqou11v5yz5wOQQR6RVqJq+k7xwcGZ1dluGa9r5tH6rb6ZB4Mx69SysCciKdnZuNhdZp10fyaSjawt7wPhTWlPEjTZjaolvuP4ZgCrYFr5A7G0s0FZqWoWqhAZDcYm9p2Pq1J7wzUN+JzWj8arDYtWgKhYbr0mzb2P7xpvFNM7bmr16RPKGmcfhA3AVBYyq53GSSMqZXhV7Wgmq9JhsNpJI6PD2m1D1QQ9sCZ+tP+uR5ySSfqnhAseL94xpiQbeckkcTrrvh9y2m6rHbgH7Td2gySRm//9k=';
*/
