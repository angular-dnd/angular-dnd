import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularDndTreeComponent} from './dnd-tree.component';


describe('DndCardsTreeComponent', () => {
  let component: AngularDndTreeComponent<any>;
  let fixture: ComponentFixture<AngularDndTreeComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AngularDndTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularDndTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
