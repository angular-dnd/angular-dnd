import {Component} from '@angular/core';
import {IDndTreeSpec} from '@angular-dnd/tree';

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

  public maxDepth: number = 2;

  public treeId = 'demo-tree';
  public treeSpec: IDndTreeSpec<IDemoItem> = {
    autoExpand: node => true,
    getChildItems: item => item.children,
    childrenCount: item => item.children?.length,
    itemId: item => item.id,
    maxDepth: this.maxDepth,
  };

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

}
