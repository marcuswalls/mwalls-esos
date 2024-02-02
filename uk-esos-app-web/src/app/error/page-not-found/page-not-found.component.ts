import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-page-not-found',
  template: `
    <esos-page-heading size="xl">Page Not Found</esos-page-heading>
    <p class="govuk-body">If you typed the web address, check it is correct.</p>
    <p class="govuk-body">If you pasted the web address, check you copied the entire address.</p>
    <p class="govuk-body">
      If the web address is correct,
      <a govukLink [routerLink]="['/contact-us']"> contact your regulator </a>
      for help.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {}
