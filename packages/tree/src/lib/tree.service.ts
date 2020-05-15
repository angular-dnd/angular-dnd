import {Injectable} from '@angular/core';
import {CoreService} from '@angular-dnd/core';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor(
    private coreService: CoreService,
  ) {
  }
}
