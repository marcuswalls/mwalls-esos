import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';

import { Observable } from 'rxjs';

import { DetailsGuard } from '@accounts/index';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';

import { ApplicationUserDTO, OperatorUserDTO } from 'esos-api';

import { saveNotFoundOperatorError } from '../errors/business-error';

@Injectable({ providedIn: 'root' })
export class DeleteGuard implements CanActivate, Resolve<OperatorUserDTO | ApplicationUserDTO> {
  constructor(
    private readonly operatorDetailsGuard: DetailsGuard,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.operatorDetailsGuard
      .isOperatorActive(route)
      .pipe(
        catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
          this.businessErrorService.showError(saveNotFoundOperatorError(Number(route.paramMap.get('accountId')))),
        ),
      );
  }

  resolve(): OperatorUserDTO | ApplicationUserDTO {
    return this.operatorDetailsGuard.resolve();
  }
}
