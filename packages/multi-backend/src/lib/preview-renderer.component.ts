import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';
import {Offset} from '@angular-dnd/core';
import {map} from 'rxjs/operators';

// @ts-ignore

/**
 * This is internal, you probably won't ever need to use it directly.
 *
 * For understanding's sake, it helps to know that this component
 * essentially just renders whatever is placed between its tags, but
 * in a `position: fixed` container that is translated according to
 * the drag in progress and how far it has travelled.
 *
 * It currently has a workaround for some Firefox versions where the
 * whole thing wouldn't re-render unless you animated the border.
 */
@Component({
  selector: 'angular-dnd-preview-renderer',
  template: `
    <div class="firefox-bug" [ngStyle]="style$|async">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
      `
      :host {
        display: block;
        position: fixed;
        pointer-events: none;
        z-index: 100;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      @keyframes animatedBorder {
        from {
          border-color: rgba(0, 0, 0, 0);
        }
        to {
          border-color: rgba(0, 0, 0, 1);
        }
      }

      .firefox-bug {
        animation-name: animatedBorder;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularDndPreviewRendererComponent implements OnDestroy {
  /** @ignore */
  private layer = this.dndService.dragLayer();

  /** @ignore */
  collect$ = this.layer.listen(monitor => ({
    initialOffset: monitor.getInitialSourceClientOffset() as Offset,
    currentOffset: monitor.getSourceClientOffset()
  }));

  /** @ignore */
  style$ = this.collect$.pipe(
    map(c => {
      const {initialOffset, currentOffset} = c;

      if (!initialOffset || !currentOffset) {
        return {
          display: 'none'
        };
      }

      const {x, y} = currentOffset;

      const transform = `translate(${x}px, ${y}px)`;
      return {
        transform,
        WebkitTransform: transform
      };
    })
  );

  constructor(
    private dndService: AngularDndService,
  ) {
  }

  ngOnDestroy() {
    this.layer.unsubscribe();
  }
}
