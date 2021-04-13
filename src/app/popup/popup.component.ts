import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.scss']
})

export class PopupComponent {

	@Input() message: string;
	@Output() btnClick: EventEmitter<any> = new EventEmitter();
	public btnText = "Play Again";

	setMessage(text: string) {
		this.message = text;
	}

	onBtnClick() {
		this.btnClick.emit();
	}
}