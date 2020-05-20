import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TreeLinesPage } from './tree-lines-page.component';

describe('TreePage', () => {
  let component: TreeLinesPage;
  let fixture: ComponentFixture<TreeLinesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeLinesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TreeLinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
