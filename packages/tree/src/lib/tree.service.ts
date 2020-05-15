import {Injectable} from '@angular/core';
import {CoreService} from 'core';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor(
    private coreService: CoreService,
  ) {
  }
}
