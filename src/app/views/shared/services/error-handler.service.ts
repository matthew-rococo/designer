/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { ApplicationRef, ChangeDetectorRef, ErrorHandler, Injectable, Injector } from '@angular/core';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { SentryService } from 'app/core/analytics/sentry.service';
import { SnackBar } from '../../../services/snack-bar.service';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {

	errorCount = 0;

	constructor ( protected injector: Injector, private analytics: AnalyticsService ) {
		super();
	}

	// https://github.com/angular/angular/issues/17010
	handleError ( error: Error ) {

		SnackBar.error( error?.message );

		console.error( error );

		SentryService.captureException( error );

		let increment = 5;
		let max = 50;

		// Prevents change detection
		let debugCtx = error[ 'ngDebugContext' ];
		let changeDetectorRef = debugCtx && debugCtx.injector.get( ChangeDetectorRef );
		if ( changeDetectorRef ) changeDetectorRef.detach();

		this.errorCount = this.errorCount + 1;
		if ( this.errorCount % increment === 0 ) {
			super.handleError( error );

			if ( this.errorCount === max ) {

				let appRef = this.injector.get( ApplicationRef );
				appRef.tick();
			}
		} else if ( this.errorCount === 1 ) {
			super.handleError( error );
		}
	}
}
