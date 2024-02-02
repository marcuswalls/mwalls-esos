import { NgModule } from '@angular/core';

import { CompetentAuthorityLocationPipe } from '@shared/pipes/competent-authority-location.pipe';
import { CoordinatePipe } from '@shared/pipes/coordinate.pipe';
import { DefaultIfEmptyPipe } from '@shared/pipes/default-if-empty.pipe';
import { IncludesPipe } from '@shared/pipes/include.pipe';
import { IncludesAnyPipe } from '@shared/pipes/includes-any.pipe';
import { LegalEntityTypePipe } from '@shared/pipes/legal-entity-type.pipe';
import { ParameterTypePipe } from '@shared/pipes/parameter-type.pipe';
import { PhoneNumberPipe } from '@shared/pipes/phone-number.pipe';
import { SecondsToMinutesPipe } from '@shared/pipes/seconds-to-minutes.pipe';
import { UserContactPipe } from '@shared/pipes/user-contact.pipe';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';
import { UserInfoResolverPipe } from '@shared/pipes/user-info-resolver.pipe';
import { UserRolePipe } from '@shared/pipes/user-role.pipe';

import { AccountStatusPipe } from './account-status.pipe';
import { AccountTypePipe } from './account-type.pipe';
import { ApplicationTypePipe } from './application-type.pipe';
import { BigNumberPipe } from './big-number.pipe';
import { CapitalizeFirstPipe } from './capitalize-first.pipe';
import { CompetentAuthorityPipe } from './competent-authority.pipe';
import { CountryPipe } from './country.pipe';
import { TaskTypeToBreadcrumbPipe } from './task-type-to-breadcrumb.pipe';
import { WorkflowStatusPipe } from './workflow-status.pipe';
import { WorkflowTypePipe } from './workflow-type.pipe';

@NgModule({
  imports: [CompetentAuthorityLocationPipe, CompetentAuthorityPipe, TaskTypeToBreadcrumbPipe],
  declarations: [
    AccountStatusPipe,
    AccountTypePipe,
    ApplicationTypePipe,
    BigNumberPipe,
    CapitalizeFirstPipe,
    CoordinatePipe,
    CountryPipe,
    DefaultIfEmptyPipe,
    IncludesAnyPipe,
    IncludesPipe,
    LegalEntityTypePipe,
    ParameterTypePipe,
    PhoneNumberPipe,
    SecondsToMinutesPipe,
    UserContactPipe,
    UserFullNamePipe,
    UserInfoResolverPipe,
    UserRolePipe,
    WorkflowStatusPipe,
    WorkflowTypePipe,
  ],
  exports: [
    AccountStatusPipe,
    AccountTypePipe,
    ApplicationTypePipe,
    BigNumberPipe,
    CapitalizeFirstPipe,
    CompetentAuthorityLocationPipe,
    CompetentAuthorityPipe,
    CoordinatePipe,
    CountryPipe,
    DefaultIfEmptyPipe,
    IncludesAnyPipe,
    IncludesPipe,
    LegalEntityTypePipe,
    ParameterTypePipe,
    PhoneNumberPipe,
    SecondsToMinutesPipe,
    TaskTypeToBreadcrumbPipe,
    UserContactPipe,
    UserFullNamePipe,
    UserInfoResolverPipe,
    UserRolePipe,
    WorkflowStatusPipe,
    WorkflowTypePipe,
  ],
})
export class PipesModule {}
