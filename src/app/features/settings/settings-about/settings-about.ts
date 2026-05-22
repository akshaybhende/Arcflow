import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.html',
  styleUrl: './settings-about.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAbout {
  readonly version = '1.0.0';
  readonly buildDate = 'May 22, 2026';
  readonly repoUrl = 'https://github.com/arcflow/arcflow';
}
