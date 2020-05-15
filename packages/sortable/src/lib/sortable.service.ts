import {Injectable} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';

@Injectable({
  providedIn: 'root'
})
export class SortableService {

  constructor(
    dnd: AngularDndService,
  ) {
  }
}
