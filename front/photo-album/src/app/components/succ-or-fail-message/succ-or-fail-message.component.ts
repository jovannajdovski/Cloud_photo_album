import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-succ-or-fail-message',
  templateUrl: './succ-or-fail-message.component.html',
  styleUrls: ['./succ-or-fail-message.component.scss']
})
export class SuccOrFailMessageComponent implements OnInit {

  @Input() message: string = '';
  @Output() modalCLose = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  modalCLoseCLicked() {
    this.modalCLose.emit(true);
  }

}
