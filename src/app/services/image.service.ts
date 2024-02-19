import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {
  constructor(private http: HttpClient) {}

  getImages() {
    return this.http.get('https://api.unsplash.com/photos/random?count=10&client_id=Xbpe8JoYxet4GGZf2sN55DuY1zgnpWmS6y61rY0OwzE');
  }
}