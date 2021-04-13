import { Component } from '@angular/core';
import { BlockData, TICTACTOE, COLORS } from './block/block.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {

	public blockData: BlockData[] = [];
	public moveCount = 0;
	public isWon = false;
	public isPlaying = false;
	public showPopup = false;
	public popupMessage: string;
	public score: number;
	public aiScore: number;

	constructor() {
		this.score = JSON.parse(localStorage.getItem('userScore')) || 0;
		this.aiScore = JSON.parse(localStorage.getItem('aiScore')) || 0;
		this.fillBlockData();
	}

	fillBlockData() {
		for (let index = 0; index < 9; index++) this.blockData.push(new BlockData(index))
	}

	onBlockClick(id: number) {
		if (!this.blockData[id].isActive) {
			if (this.isPlaying) return;
			this.isPlaying = true;
			this.playChance(id);
			setTimeout(() => { this.playAiChance() }, 300);
			setTimeout(() => { this.isPlaying = false }, 500);
		}
	}

	playChance(id: number) {
		if (this.blockData[id] && this.blockData[id].blockValue === TICTACTOE.BLANK && !this.isWon) {
			this.blockData[id].isActive = true;
			this.blockData[id].blockValue = this.getValue();
			this.blockData[id].backgroundColor = COLORS.gray;
			this.moveCount++;
			this.checkForVictory();
		}
	}

	playAiChance() {
		if (!this.showPopup) {
			const winningPattern = [
				[[1, 2], [3, 6], [4, 8]],
				[[0, 2], [4, 7]],
				[[1, 0], [4, 6], [5, 8]],
				[[0, 6], [4, 5]],
				[[6, 2], [3, 5], [1, 7], [0, 8]],
				[[8, 2], [3, 4]],
				[[7, 8], [3, 0], [4, 2]],
				[[1, 4], [6, 8]],
				[[6, 7], [2, 5], [4, 0]]
			];
			const pattern = winningPattern.findIndex((item, index) => this.checkForActive(index, item));
			const blockId = pattern > -1 ? pattern : this.getDefaultPosition();
			this.playChance(blockId);
		}
	}

	checkForActive(selectedBlock: number, blocksToCheck: number[][]) {
		return !this.blockData[selectedBlock].isActive && blocksToCheck.some(block => block.every(item => this.isActive(item)));
	}

	getDefaultPosition(): number {
		return this.blockData.find(item => !item.isActive).id;
	}

	isActive(id: number): boolean {
		return this.blockData[id].isActive && this.blockData[id].blockValue === TICTACTOE.CROSS;
	}

	getValue(): number {
		return this.moveCount % 2 === 0 ? TICTACTOE.CROSS : TICTACTOE.ZERO;
	}

	reset() {
		this.moveCount = 0;
		this.isWon = false;
		this.blockData.forEach(block => {
			block.blockValue = TICTACTOE.BLANK;
			block.backgroundColor = COLORS.default;
			block.isActive = false;
		});
	}

	checkForVictory() {
		const possibleWins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
		possibleWins.forEach(item => {
			if (this.isVictory(item)) {
				let text = 'You Win!';
				this.isWon = true;
				this.changeBackground(item);
				if (this.getValue() === TICTACTOE.ZERO) this.score++;
				else {
					this.aiScore++;
					text = 'AI Wins!';
				}
				localStorage.setItem('userScore', this.score.toString());
				localStorage.setItem('aiScore', this.aiScore.toString());
				this.setPopupText(text);
				return;
			}
		});
		this.checkForDraw();
	}

	checkForDraw() {
		this.blockData.every(block => block.isActive) && !this.isWon && this.setPopupText('It\'s a draw');
	}

	isVictory(listId: number[]): boolean {
		return this.blockData[listId[0]].blockValue === this.blockData[listId[1]].blockValue
			&& this.blockData[listId[1]].blockValue === this.blockData[listId[2]].blockValue
			&& this.blockData[listId[0]].blockValue !== TICTACTOE.BLANK;
	}

	changeBackground(listId: number[]) {
		listId.forEach(item => this.blockData[item].backgroundColor = COLORS.win);
	}

	setPopupText(text: string) {
		setTimeout(() => {
			this.showPopup = true;
			this.popupMessage = text;
		}, 800);
	}

	btnClick() {
		this.showPopup = false;
		this.reset();
	}
}