import {Component} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'examples';

  constructor(
    dnd: AngularDndService,
  ) {
  }
}
