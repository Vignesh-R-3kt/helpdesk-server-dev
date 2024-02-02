import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TabTypeService {

  private tabType = new BehaviorSubject<string>('all');

  constructor() { }

  getTabType(): Observable<any> {
    return this.tabType.asObservable();
  }

  updateTab(tabType: string = 'all'): void {
    this.tabType.next(tabType);
  }

}
