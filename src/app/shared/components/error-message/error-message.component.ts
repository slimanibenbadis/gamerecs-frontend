import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <small 
      *ngIf="show" 
      class="block mt-1 text-red-500 dark:text-red-400 text-sm font-medium"
      [attr.id]="id"
      role="alert"
    >
      <i class="pi pi-exclamation-circle mr-1"></i>
      {{ message }}
    </small>
  `
})
export class ErrorMessageComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Input() id?: string;
} 