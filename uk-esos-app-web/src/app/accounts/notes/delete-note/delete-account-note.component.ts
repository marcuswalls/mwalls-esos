import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, switchMap } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';

import { AccountNotesService } from 'esos-api';

@Component({
  selector: 'esos-delete-account-note',
  templateUrl: './delete-account-note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountNoteComponent {
  accountId$ = this.route.paramMap.pipe(map((parameters) => +parameters.get('accountId')));

  constructor(
    readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly accountNotesService: AccountNotesService,
    readonly pendingRequest: PendingRequestService,
  ) {}

  onDelete() {
    this.route.paramMap
      .pipe(
        first(),
        map((parameters) => +parameters.get('noteId')),
        switchMap((noteId) => this.accountNotesService.deleteAccountNote(noteId)),
        this.pendingRequest.trackRequest(),
      )
      .subscribe(() =>
        this.router.navigate([`accounts/${this.route.snapshot.paramMap.get('accountId')}`], {
          fragment: 'notes',
        }),
      );
  }
}
