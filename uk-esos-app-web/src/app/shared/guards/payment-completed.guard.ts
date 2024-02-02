import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, PRIMARY_OUTLET, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { first, map, Observable } from 'rxjs';

import { UrlRequestType, urlRequestTypes } from '@shared/types';

import { StoreContextResolver } from '../store-resolver/store-context.resolver';

@Injectable()
export class PaymentCompletedGuard {
  constructor(private readonly storeResolver: StoreContextResolver, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<true | UrlTree> {
    const tree = this.router.parseUrl(routerState.url);
    const segmentGroup = tree.root.children[PRIMARY_OUTLET];
    const segment = segmentGroup.segments;

    const lastSegment = segment.filter((index) => urlRequestTypes.some((type) => index.path.includes(type))).slice(-1);

    const redirectUrlPath = `/${lastSegment[0].path}/${route.paramMap.get('taskId')}`;

    const redirectUrl = this.router.parseUrl(redirectUrlPath.concat('/payment-not-completed'));

    const store = this.storeResolver.getStore(lastSegment[0].path as UrlRequestType);

    return store.pipe(
      first(),
      map((state) => {
        const paymentCompleted = !!state.paymentCompleted;
        return !(store as any).isPaymentRequired || !!paymentCompleted || redirectUrl;
      }),
    );
  }
}
