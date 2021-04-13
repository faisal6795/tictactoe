import { Component, Input } from '@angular/core';

export class BlockData {

	public blockValue = TICTACTOE.BLANK;
	public backgroundColor = COLORS.default;
	public isActive = false;

	constructor(public id: number) { }
}

export const TICTACTOE = {
	BLANK: 0,
	CROSS: 1,
	ZERO: 2
}

export const COLORS = {
	default: '#fff',
	gray: '#d9d9d9',
	win: '#00db5b'
}

@Component({
	selector: 'app-block',
	templateUrl: './block.component.html',
	styleUrls: ['./block.component.scss']
})

export class BlockComponent {
	@Input() blockValue: number;
	@Input() backgroundColor: string;
	@Input() isActive: boolean;
}