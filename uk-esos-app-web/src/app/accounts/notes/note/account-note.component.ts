import { HttpEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, filter, first, map, Observable, switchMap } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchTaskReassignedBadRequest } from '@error/business-errors';
import { requestTaskReassignedError } from '@shared/errors/request-task-error';
import { FileUploadService } from '@shared/file-input/file-upload.service';
import { createCommonFileAsyncValidators } from '@shared/file-input/file-validators';

import { GovukValidators } from 'govuk-components';

import { AccountNotesService, FileUuidDTO, NotePayload } from 'esos-api';

@Component({
  selector: 'esos-account-note',
  templateUrl: './account-note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNoteComponent implements OnInit {
  isErrorSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  accountId$ = this.route.paramMap.pipe(map((parameters) => +parameters.get('accountId')));
  noteId$ = this.route.paramMap.pipe(map((parameters) => +parameters.get('noteId')));
  notePayload$: Observable<NotePayload> = this.noteId$.pipe(
    filter((noteId) => !!noteId),
    switchMap((noteId) => this.accountNotesService.getAccountNote(noteId)),
    map((result) => result.payload),
  );

  form = this.fb.group({
    note: [
      '',
      [GovukValidators.required('Enter a note'), GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
    ],
    files: this.fb.control(
      {
        value: [],
        disabled: false,
      },
      {
        asyncValidators: [
          ...createCommonFileAsyncValidators(false),
          this.fileUploadService.uploadMany((file) => this.uploadFile(file)),
        ],
        updateOn: 'change',
      },
    ),
  });

  constructor(
    readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: UntypedFormBuilder,
    private readonly accountNotesService: AccountNotesService,
    private readonly fileUploadService: FileUploadService,
    private readonly businessErrorService: BusinessErrorService,
    readonly pendingRequest: PendingRequestService,
  ) {}

  ngOnInit(): void {
    this.notePayload$.pipe(first()).subscribe((payload) => {
      this.form.patchValue({
        note: payload?.note,
        files: this.transformFiles(payload?.files),
      });
    });
  }

  transformFiles(transformedFiles: NotePayload['files']) {
    return transformedFiles
      ? Object.entries(transformedFiles).map((keyValue) => ({
          uuid: keyValue[0],
          file: {
            name: keyValue[1],
          },
        }))
      : [];
  }

  getDownloadUrl() {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    return `/accounts/${accountId}/file-download/`;
  }

  onSubmit() {
    if (this.form.valid) {
      const note = this.form.get('note').value;
      const files = this.form.get('files').value?.map((file) => file.uuid);

      combineLatest([this.accountId$, this.noteId$])
        .pipe(
          first(),
          switchMap(([accountId, noteId]) => {
            return noteId
              ? this.accountNotesService.updateAccountNote(noteId, { note, files })
              : this.accountNotesService.createAccountNote({ accountId, note, files });
          }),
          this.pendingRequest.trackRequest(),
        )
        .subscribe(() =>
          this.router.navigate([`accounts/${this.route.snapshot.paramMap.get('accountId')}`], {
            fragment: 'notes',
          }),
        );
    } else {
      this.isErrorSummaryDisplayed$.next(true);
    }
  }

  private uploadFile(file: File): Observable<HttpEvent<FileUuidDTO>> {
    return this.accountNotesService
      .uploadAccountNoteFile(+this.route.snapshot.paramMap.get('accountId'), file, 'events', true)
      .pipe(
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      );
  }
}
