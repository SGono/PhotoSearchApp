import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Image {
  id: string;
  secret: string;
  title: string;
  server: string;
  farm: string;

}

export interface ImageOutput {
  images: {
    image: Image[];
  };
}

@Injectable({
  providedIn: 'root'
})

export class ImageSearchService {

  previousKeyword: string;
  currentPage = 1;

  constructor(private http: HttpClient) { }

  searchImageKeyword(keyword: string) {
    if (this. previousKeyword === keyword) {
      this.currentPage++;
    } else {
      this.currentPage = 1;
    }
    this. previousKeyword = keyword;
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    const params = `api_key=${environment.flickrImage.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=16&page=${this.currentPage}`;

    return this.http.get(url + params).pipe(map((response: ImageOutput) => {
      const urlArray = [];
      response.images.image.forEach((photo: Image) => {
        const imageObj = {
          url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`,
          title: photo.title
        };
        urlArray.push(imageObj);
      });
      return urlArray;
    }));
  }
}
