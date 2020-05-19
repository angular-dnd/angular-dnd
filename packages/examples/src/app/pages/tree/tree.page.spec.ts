import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TreePage } from './tree.page';

describe('TreePage', () => {
  let component: TreePage;
  let fixture: ComponentFixture<TreePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
