import {Component} from '@angular/core';
import {IDndTreeSpec} from '@angular-dnd/tree';
import {ITreeNode} from '@angular-dnd/tree';
import {ViewChild} from '@angular/core';
import {AngularDndTreeComponent} from '@angular-dnd/tree';

interface IDemoItem {
  id: string;
  title: string;
  children?: IDemoItem[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree-basic-page.component.html',
  styleUrls: ['./tree-basic-page.component.scss'],
})
export class TreeBasicPage {

  public viewMode: 'cards' | 'ul' = 'cards';

  public maxDepth: number = 2;

  public treeId = 'demo-tree';
  public treeSpec: IDndTreeSpec<IDemoItem> = {
    autoExpand: node => true,
    getChildItems: item => item.children,
    childrenCount: item => item.children?.length,
    itemId: item => item.id,
    maxDepth: this.maxDepth,
  };

  @ViewChild(AngularDndTreeComponent, {static: false}) dndTree: AngularDndTreeComponent<IDemoItem>;

  public rootItem: IDemoItem = {
    id: 'root',
    title: 'Demo tree',
    children: [
      {
        id: 'jack', title: 'Jack',
        children: [
          {
            id: 'maria', title: 'Maria',
          },
          {
            id: 'charlie', title: 'Charlie',
          }
        ],
      },
      {
        id: 'Anna', title: 'Anna',
        children: [
          {
            id: 'peter', title: 'Peter',
          },
          {
            id: 'gretta', title: 'Gretta',
          }
        ],
      },
    ],
  };

  public isLocalhost: boolean;

  constructor() {
    this.isLocalhost = window.location.hostname === 'localhost';
  }

  maxDepthChanged(): void {
    this.treeSpec = {
      ...this.treeSpec,
      maxDepth: this.maxDepth,
    };
  }

  toggle(node: ITreeNode<IDemoItem>): void {
    console.log('toggle', node.id);
    if (node.data.children) {
      if (node.isExpanded) {
        this.dndTree.treeState.collapse(node.id);
      } else {
        this.dndTree.treeState.expand(node.id);
      }
    }
  }
}
