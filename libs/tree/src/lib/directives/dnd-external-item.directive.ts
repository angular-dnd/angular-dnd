import {Directive} from '@angular/core';
import {Input} from '@angular/core';
import {ElementRef} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {OnChanges} from '@angular/core';
import {SimpleChanges} from '@angular/core';
import {IDragSource} from '@sneat-dnd/core';
import {AngularDndService} from '@angular-dnd/core';
import {IDragSourceSpec} from '@angular-dnd/core';
import {IDragSourceMonitor} from '@angular-dnd/core';
import {IDraggedTreeItem} from '@sneat-dnd/tree';
import {ITreeNode} from '@sneat-dnd/tree';
import {Subscription} from 'rxjs';

export interface IAngularDndExternalTreeItem<Item> {
  type: string;
  item?: Item;
  getItem?: () => Item;
}

@Directive({
  selector: '[angularDndExternalTreeItem]',
})
export class AngularDndExternalTreeItemDirective<Item> implements OnChanges, OnDestroy {

  @Input() public angularDndExternalTreeItem?: IAngularDndExternalTreeItem<Item>;

  private dragSourceSpec?: IDragSourceSpec<IDraggedTreeItem<Item>>;

  private sub = new Subscription();

  private dragSource?: IDragSource<IDraggedTreeItem<Item>>;

  constructor(
    private readonly dnd: AngularDndService,
    private readonly el: ElementRef<HTMLElement>,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.angularDndExternalTreeItem && this.angularDndExternalTreeItem) {
      this.sub.unsubscribe();
      this.dragSourceSpec = {
        beginDrag: (_: IDragSourceMonitor<void, void>): IDraggedTreeItem<Item> => {
          const item = this.angularDndExternalTreeItem?.item || this.angularDndExternalTreeItem?.getItem && this.angularDndExternalTreeItem.getItem();
          if (!item) {
            throw new Error('no item');
          }
          return {
            node: {
              id: new Date().toUTCString(),
              data: item,
              level: 0,
              tree: undefined,
            } as unknown as ITreeNode<Item>,
          };
        }
      };
      this.dragSource = this.dnd.dragSource<IDraggedTreeItem<Item>>(this.angularDndExternalTreeItem.type, this.dragSourceSpec, this.sub);
      this.sub.add(this.dragSource.connectDragSource(this.el.nativeElement));
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
