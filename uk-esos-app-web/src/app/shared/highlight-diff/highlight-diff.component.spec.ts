import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightDiffComponent } from './highlight-diff.component';

describe('HighlightDiffComponent', () => {
  let component: HighlightDiffComponent;
  let fixture: ComponentFixture<HighlightDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighlightDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HighlightDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate difference between 2 html elements', () => {
    const previousDiv = <HTMLDivElement>document.createElement('div');
    previousDiv.innerHTML = '<!-- test comments --><h1>Some other text</h1>';
    component.previous = new ElementRef<HTMLDivElement>(previousDiv);

    const currentDiv = <HTMLDivElement>document.createElement('div');
    currentDiv.innerHTML = '<h1>Some Text</h1>';
    component.current = new ElementRef<HTMLDivElement>(currentDiv);

    component.ngAfterViewInit();
    expect(component.diff).toEqual({
      changingThisBreaksApplicationSecurity:
        '<h1>Some <del class="diffmod">other text</del><ins class="diffmod">Text</ins></h1>',
    });
  });
});
