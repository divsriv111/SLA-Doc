// src/app/shared/components/loader/loader.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../core/services/loading/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loading$: any;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.isLoading$;
  }
}