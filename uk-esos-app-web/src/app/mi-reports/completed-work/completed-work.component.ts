import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay, Subject, switchMap, tap } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { EsosAccount } from '@core/store/auth';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { AccountTypePipe } from '@shared/pipes/account-type.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { ItemActionTypePipe } from '@shared/pipes/item-action-type.pipe';
import { WorkflowStatusPipe } from '@shared/pipes/workflow-status.pipe';
import { WorkflowTypePipe } from '@shared/pipes/workflow-type.pipe';
import { format, subDays } from 'date-fns';

import { DateInputValidators, GovukTableColumn, GovukValidators } from 'govuk-components';

import {
  CustomMiReportResult,
  ExecutedRequestAction,
  ExecutedRequestActionsMiReportParams,
  ExecutedRequestActionsMiReportResult,
  MiReportsService,
} from 'esos-api';

import { createTableColumns, createTablePage, manipulateResultsAndExportToExcel, pageSize } from '../core/mi-report';

@Component({
  selector: 'esos-completed-work',
  templateUrl: './completed-work.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class CompletedWorkComponent implements OnInit {
  readonly pageSize = pageSize;
  executeClicked = false;
  reportItems$: Observable<ExecutedRequestAction[]>;
  pageItems$: Observable<ExecutedRequestAction[]>;
  totalNumOfItems$: Observable<number>;

  currentPage$ = new BehaviorSubject<number>(1);
  generateReport$ = new Subject<void>();

  reportOptionsForm: FormGroup = this.fb.group({
    option: [null, [GovukValidators.required('Select an option')]],
    year: [
      null,
      [
        GovukValidators.required('Enter a year value'),
        GovukValidators.pattern('[0-9]*', 'Enter a valid year value e.g. 2022'),
        GovukValidators.builder(
          `Enter a valid year value e.g. 2022`,
          DateInputValidators.dateFieldValidator('year', 1900, 2100),
        ),
      ],
    ],
  });

  tableColumns: GovukTableColumn<ExecutedRequestAction>[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly miReportsService: MiReportsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.reportItems$ = this.generateReport$.pipe(
      switchMap(() => this.miReportsService.generateReport(EsosAccount, this.constructRequestBody())),
      tap(
        (miReportResult: ExecutedRequestActionsMiReportResult) =>
          (this.tableColumns = createTableColumns(miReportResult.columnNames)),
      ),
      map((miReportResult) => this.addPipesToResult(miReportResult.results)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.pageItems$ = combineLatest([this.reportItems$, this.currentPage$]).pipe(
      map(([items, currentPage]) => createTablePage(currentPage, this.pageSize, items)),
    );
    this.totalNumOfItems$ = this.reportItems$.pipe(map((items) => items.length));
  }

  onSubmit() {
    if (this.reportOptionsForm.valid) {
      if (this.executeClicked) {
        this.generateReport$.next();
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1 }, queryParamsHandling: 'merge' });
      } else {
        this.miReportsService
          .generateReport(EsosAccount, this.constructRequestBody())
          .pipe(
            map((miReportResult: CustomMiReportResult) =>
              manipulateResultsAndExportToExcel(
                { ...miReportResult, results: this.addPipesToResult(miReportResult.results) },
                'Completed work',
              ),
            ),
          )
          .subscribe();
      }
    }
  }

  addPipesToResult(results: ExecutedRequestActionsMiReportResult['results']) {
    return results.map((completedWork) => {
      const accountTypePipe = new AccountTypePipe();
      const accountStatusPipe = new AccountStatusPipe();
      const workflowTypePipe = new WorkflowTypePipe();
      const workflowStatusPipe = new WorkflowStatusPipe();
      const itemActionTypePipe = new ItemActionTypePipe();
      const govukDatePipe = new GovukDatePipe();

      return {
        ...completedWork,
        'Account type': accountTypePipe.transform(completedWork['Account type']),
        'Account status': accountStatusPipe.transform(completedWork['Account status']),
        'Workflow type': workflowTypePipe.transform(completedWork['Workflow type']),
        'Workflow status': workflowStatusPipe.transform(completedWork['Workflow status']),
        'Timeline event type': itemActionTypePipe.transform(completedWork['Timeline event type']),
        'Timeline event Date Completed': govukDatePipe.transform(completedWork['Timeline event Date Completed']),
      };
    });
  }

  private constructRequestBody(): ExecutedRequestActionsMiReportParams {
    switch (this.reportOptionsForm.get('option').value) {
      case 'LAST_30_DAYS': {
        return {
          reportType: 'COMPLETED_WORK',
          fromDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        };
      }
      case 'ANNUAL': {
        const year = Number(this.reportOptionsForm.get('year').value);
        return {
          reportType: 'COMPLETED_WORK',
          fromDate: format(new Date(year, 0, 1), 'yyyy-MM-dd'),
          toDate: format(new Date(year + 1, 0, 1), 'yyyy-MM-dd'),
        };
      }
    }
  }

  onExecuteClicked(): void {
    this.executeClicked = true;
  }

  onExportClicked(): void {
    this.executeClicked = false;
  }
}
