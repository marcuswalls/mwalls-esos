import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import htmldiff from 'html-diff';

@Component({
  selector: 'esos-highlight-diff',
  templateUrl: './highlight-diff.component.html',
  styleUrls: ['./highlight-diff.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightDiffComponent implements AfterViewInit {
  @ViewChild('previous') previous: ElementRef<HTMLDivElement>;
  @ViewChild('current') current: ElementRef<HTMLDivElement>;

  diff: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private router: Router) {}

  ngAfterViewInit(): void {
    const previous = this.stripHtmlComments(this.previous.nativeElement.innerHTML);
    const current = this.stripHtmlComments(this.current.nativeElement.innerHTML);
    const diff = htmldiff(previous, current);

    this.diff = this.sanitizer.bypassSecurityTrustHtml(diff);

    this.cdr.detectChanges();
  }

  onClickDiff(event: MouseEvent | KeyboardEvent) {
    if (event.target instanceof HTMLAnchorElement && event.type === 'click') {
      const anchorTag = event.target as HTMLAnchorElement;

      if (anchorTag.hasAttribute('ng-reflect-router-link')) {
        event.preventDefault();
        const link = anchorTag.getAttribute('href');
        this.router.navigate([link]);
      }
    }
  }

  private stripHtmlComments(html: string) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
  }
}
