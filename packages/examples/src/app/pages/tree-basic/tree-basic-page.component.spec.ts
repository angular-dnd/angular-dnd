import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TreeBasicPage } from './tree-basic-page.component';

describe('TreePage', () => {
  let component: TreeBasicPage;
  let fixture: ComponentFixture<TreeBasicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeBasicPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TreeBasicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
