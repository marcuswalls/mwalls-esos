import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { PipesModule } from '@shared/pipes/pipes.module';

import { GovukComponentsModule } from 'govuk-components';

import { ContactPerson, OperatorUserRegistrationDTO } from 'esos-api';

@Component({
  selector: 'esos-user-input-summary-template',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, PipesModule, RouterLink],
  templateUrl: './user-input-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInputSummaryTemplateComponent implements OnInit {
  @Input() userInfo: Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>> & Partial<ContactPerson>;
  @Input() changeLink: string;

  changeQueryParams: Params = { change: true };
  modifiedUserInfo: Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>>;

  constructor(readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const { line1, line2, city, county, postcode, ...userInfo } = this.userInfo;

    this.modifiedUserInfo = line1
      ? {
          ...userInfo,
          address: {
            line1,
            line2,
            city,
            county,
            postcode,
          },
        }
      : this.userInfo;
  }
}
