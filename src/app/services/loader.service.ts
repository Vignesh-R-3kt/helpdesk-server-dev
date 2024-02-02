import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader = new Subject<boolean>();

  constructor() { }

  getLoaderState(): Observable<boolean> {
    return this.loader.asObservable();
  }

  show(): void {
    this.loader.next(true);
  }

  hide(): void {
    this.loader.next(false);
  }
}
