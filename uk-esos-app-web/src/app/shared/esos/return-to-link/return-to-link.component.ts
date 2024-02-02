import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { GovukComponentsModule } from 'govuk-components';

@Component({
  selector: 'esos-return-to-link',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, GovukComponentsModule],
  template: `<a govukLink [routerLink]="returnToUrl$ | async"> Return to: {{ returnText$ | async }} </a> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToLinkComponent {
  constructor(private readonly route: ActivatedRoute) {
    let returnRoute = this.route;
    while (returnRoute.parent && ![':actionId', ':taskId'].includes(returnRoute.routeConfig?.path)) {
      returnRoute = returnRoute.parent;
    }

    const url = returnRoute.snapshot.pathFromRoot.map((route) => route.url.map((u) => u.path)).flat();
    url[0] = `/${url[0]}`;
    this.returnToUrl$.next(url);
  }

  readonly returnToUrl$ = new BehaviorSubject(['']);
  readonly returnText$ = this.returnToText();

  returnToText(): Observable<string> {
    // TODO get Request Task Type
    return of('Dashboard');
  }
}
