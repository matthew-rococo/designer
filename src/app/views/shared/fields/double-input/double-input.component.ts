/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maths } from 'app/utils/maths';

@Component( {
	selector: 'app-double-input',
	templateUrl: './double-input.component.html',
	styleUrls: [ './double-input.component.scss' ]
} )
export class DoubleInputComponent implements OnInit {

	@Output() changed = new EventEmitter<number>();

	@Input() value: any;

	@Input() disabled: boolean = false;

	@Input() label: string;

	@Input() min: any = -Infinity;

	@Input() max: any = Infinity;

	@Input() step: number = 0.1;

	inFocus = false;

	sendTimeout: any;

	constructor () {
	}

	static isNumeric ( value: string ): boolean {

		// Allow for a trailing decimal point
		return /^-?\d*\.?\d*\.?$/.test( value );

	}

	ngOnInit () {

		this.min = parseFloat( this.min );
		this.max = parseFloat( this.max );
		this.value = parseFloat( this.value );

	}

	onBlur () {

		this.inFocus = false;

	}

	onFocus () {

		this.inFocus = true;

	}

	onWheel ( $event: WheelEvent ) {

		if ( this.disabled ) return;

		if ( !this.inFocus ) return;

		// presvent default action to stop scrolling
		$event.preventDefault();
		$event.stopPropagation();

		// console.log( $event.deltaX, $event.deltaY );

		if ( $event.deltaY < 0 && this.value < this.max ) {
			this.value += this.step;
		} else if ( $event.deltaY < 0 && this.value >= this.max ) this.value = this.max;

		if ( $event.deltaY > 0 && this.value > this.min ) {
			this.value -= this.step;
		} else if ( $event.deltaY > 0 && this.value <= this.min ) this.value = this.min;

		this.value = +this.value.toFixed( 3 );

		if ( Number.isNaN( this.value ) ) this.value = 0;

		this.value = Maths.clamp( this.value, this.min, this.max );

		// this helps avoid sending update event in every scroll

		if ( this.sendTimeout ) {

			clearTimeout( this.sendTimeout );

		}

		this.sendTimeout = setTimeout( () => {

			this.changed.emit( this.value );

		}, 300 );
	}

	onModelChanged ( $value: any ) {

		if ( this.disabled ) return;

		if ( Number.isNaN( parseFloat( $value ) ) ) {

			setTimeout( () => {
				this.value = this.value;
			}, 100 );

		} else {

			this.value = Maths.clamp( parseFloat( $value ), this.min, this.max );

			this.changed.emit( this.value );

		}
	}

	onKeydown ( $event: KeyboardEvent ) {

		// console.log( 'keydown', $event );

		// console.log( this.value );

		// // `key` holds the character ('1', 'a', '.', etc.) or the action ('ArrowRight', 'Backspace', etc.)
		// const key = $event.key;

		// // Arrow keys should be allowed for navigation
		// const navigationKeys = [ 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete' ];

		// if ( navigationKeys.includes( key ) ) {
		// 	return; // Allow navigation keys
		// }

		// // Check for numeric keys, decimal, or navigation keys
		// const isNumberKey = /^\d$/.test( key );
		// const isDecimalKey = key === '.';

		// // If key is not a number or decimal or it's a second decimal in the number, prevent its input
		// if ( !isNumberKey && !isDecimalKey ) {
		// 	$event.preventDefault();
		// }
	}

	onInput ( $event: any ) {

		// if ( this.disabled ) return;

		// console.log( 'model changed', $event.data, this.value );

		// if ( Number.isNaN( parseFloat( this.value ) ) ) {

		// 	setTimeout( () => { this.value = 0; }, 100 );

		// } else {

		// 	this.value = Maths.clamp( $event.data, this.min, this.max );

		// 	this.changed.emit( this.value );

		// }

		// if ( !DoubleInputComponent.isNumeric( ( $event as InputEvent ).data ) ) {

		// 	console.log( 'input not numeris', $event );

		// 	$event.preventDefault();

		// 	return
		// }

		// console.log( 'input', $event );

		// const inputValue: string = ( $event.target as HTMLInputElement ).value;

		// if ( !DoubleInputComponent.isNumeric( inputValue ) ) {

		// 	this.value = inputValue.replace( /[^\d.]/g, '' );

		// 	if ( inputValue.startsWith( '-' ) ) {
		// 		this.value = '-' + this.value;
		// 	}

		// } else {

		// 	console.log( 'inputValue', inputValue );

		// }
	}

}
