import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DndTreeComponent} from './dnd-tree.component';


describe('DndCardsTreeComponent', () => {
  let component: DndTreeComponent<any>;
  let fixture: ComponentFixture<DndTreeComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DndTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DndTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
