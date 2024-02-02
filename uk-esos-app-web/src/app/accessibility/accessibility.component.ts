import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BackToTopComponent } from '@shared/back-to-top/back-to-top.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

@Component({
  selector: 'esos-accessibility',
  standalone: true,
  templateUrl: './accessibility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, BackToTopComponent],
})
export class AccessibilityComponent {}
