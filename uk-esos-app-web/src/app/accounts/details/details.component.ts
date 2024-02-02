import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, Observable } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';

import { OrganisationAccountPayload } from 'esos-api';

@Component({
  selector: 'esos-account-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [NgIf, OrganisationAccountSummaryComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class DetailsComponent {
  @Input() currentTab: string;

  account$ = (
    this.route.data as Observable<{
      data: OrganisationAccountPayload;
    }>
  ).pipe(map((account) => account.data));

  constructor(private readonly route: ActivatedRoute) {}
}
