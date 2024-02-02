import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Resolve } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchNotFoundRequest, ErrorCode } from '@error/not-found-error';

import { RequestTaskItemDTO, TasksService } from 'esos-api';

import { taskNotFoundError } from '../errors/request-task-error';

@Injectable({ providedIn: 'root' })
export class TaskInfoGuard implements CanActivate, CanDeactivate<any>, Resolve<any> {
  private info: RequestTaskItemDTO;

  constructor(
    private readonly tasksService: TasksService,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.tasksService.getTaskItemInfoById(Number(route.paramMap.get('taskId'))).pipe(
      catchNotFoundRequest(ErrorCode.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      tap((info) => {
        this.info = info;
      }),
      map(() => true),
    );
  }

  canDeactivate(): boolean {
    return true;
  }

  resolve(): RequestTaskItemDTO {
    return this.info;
  }
}
