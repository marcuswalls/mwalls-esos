import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { CsvWizardStepComponent } from '@shared/csv-wizard-step/csv-wizard-step.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import { organisationStructureCSVMapper } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';
import Papa from 'papaparse';

import { ButtonDirective, DetailsComponent, LinkDirective } from 'govuk-components';

import { OrganisationAssociatedWithRU } from 'esos-api';

import { addOrganisationRUGroup, UploadCSVFormModel, uploadCsvFormProvider } from './upload-csv-form.provider';

@Component({
  selector: 'esos-upload-csv',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    CsvWizardStepComponent,
    ButtonDirective,
    NgIf,
    LinkDirective,
    DetailsComponent,
    NgForOf,
  ],
  templateUrl: './upload-csv.component.html',
  providers: [uploadCsvFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  @ViewChild(CsvWizardStepComponent) wizardStep: CsvWizardStepComponent;

  organisationsRUCtrl = this.form.controls.organisationsRU;
  columnsCtrl = this.form.controls.columns;
  fileCtrl = this.form.controls.file;
  parsedData: WritableSignal<OrganisationAssociatedWithRU[] | null> = signal(null);
  uploadedFile: File;

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup<UploadCSVFormModel>,
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
  ) {}

  onFileSelect(event: any) {
    this.wizardStep.isSummaryDisplayedSubject.next(false);
    this.uploadedFile = event.target.files[0];
    this.fileCtrl.setValue(this.uploadedFile);

    if (this.fileCtrl.invalid) {
      this.displayFileErrors();
    } else {
      Papa.parse(this.uploadedFile, {
        header: true,
        transform: this.booleanTransformer,
        skipEmptyLines: true,
        complete: (result) => this.processCSVData(result),
      });
    }

    event.target.value = '';
  }

  private processCSVData(result: Papa.ParseResult<unknown>) {
    const processedData = organisationStructureCSVMapper(result.data);

    this.columnsCtrl.setValue(result.meta.fields);
    this.organisationsRUCtrl.clear();
    processedData?.map((organisationAssociatedWithRU) =>
      this.organisationsRUCtrl.push(addOrganisationRUGroup(organisationAssociatedWithRU)),
    );

    if (this.organisationsRUCtrl.valid) {
      this.parsedData.update(() => processedData);
    } else {
      this.wizardStep.isSummaryDisplayedSubject.next(true);
      this.parsedData.update(() => null);
    }
  }

  /**
   * Since Upload File errors should appear alone, set temporarily other formControl errors to null
   */
  private displayFileErrors() {
    this.columnsCtrl.setErrors(null);
    this.organisationsRUCtrl.setErrors(null);
    this.wizardStep.isSummaryDisplayedSubject.next(true);
    this.parsedData.update(() => null);
  }

  /**
   * Transforms a CSV value of 'Yes', 'YES', 'NO' etc. to true or false
   */
  private booleanTransformer(value?: string) {
    if (value?.toLowerCase() === 'yes') return true;
    if (value?.toLowerCase() === 'no') return false;
    return value?.length > 0 ? value : undefined;
  }

  onSubmit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.UPLOAD_CSV,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure.organisationsAssociatedWithRU = this.organisationsRUCtrl
          .value as OrganisationAssociatedWithRU[];
      }),
    });
  }
}
