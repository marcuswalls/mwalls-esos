import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

@Component({
  selector: 'esos-confirmation',
  templateUrl: './confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  @Input() verificationAccount: string;
  accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));
  constructor(private readonly route: ActivatedRoute) {}
}
