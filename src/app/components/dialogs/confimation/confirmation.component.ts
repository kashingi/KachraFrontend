import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confimation',
  imports: [MatIconModule, MatToolbarModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.confirmation) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }

}
