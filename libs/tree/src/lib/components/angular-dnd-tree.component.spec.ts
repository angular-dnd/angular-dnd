import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularDndTreeComponent} from './angular-dnd-tree.component';
import {AngularDndTreeModule} from '../angular-dnd-tree.module';


describe('DndCardsTreeComponent', () => {
  let component: AngularDndTreeComponent<any>;
  let fixture: ComponentFixture<AngularDndTreeComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularDndTreeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularDndTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
