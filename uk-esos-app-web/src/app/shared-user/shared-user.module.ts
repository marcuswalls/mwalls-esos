import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DEFAULT_PSM_OPTIONS } from 'angular-password-strength-meter/zxcvbn';

import { PasswordComponent } from './password/password.component';
import { PasswordService } from './password/password.service';
import { SubmitIfEmptyPipe } from './pipes/submit-if-empty.pipe';

@NgModule({
  declarations: [PasswordComponent, SubmitIfEmptyPipe],
  imports: [PasswordStrengthMeterModule.forRoot(DEFAULT_PSM_OPTIONS), RouterModule, SharedModule],
  providers: [PasswordService],
  exports: [PasswordComponent, PasswordStrengthMeterModule, SubmitIfEmptyPipe],
})
export class SharedUserModule {}
