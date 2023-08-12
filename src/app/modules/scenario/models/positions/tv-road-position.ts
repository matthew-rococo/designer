/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Vector3 } from 'three';
import { TvMapQueries } from '../../../tv-map/queries/tv-map-queries';
import { Position } from '../position';
import { PositionType } from '../tv-enums';
import { Orientation } from '../tv-orientation';

export class RoadPosition extends Position {

	public readonly label: string = 'Road Position';
	public readonly type = PositionType.Road;
	public readonly isDependent: boolean = false;

	constructor (
		public roadId = 0,
		public sValue = 0,
		public tValue = 0,
		orientation: Orientation = null
	) {

		super( null, orientation );

		this.orientation = orientation;

	}

	exportXml () {
		throw new Error( 'Method not implemented.' );
	}

	getVectorPosition (): Vector3 {
		return TvMapQueries.getRoadPosition( this.roadId, this.sValue, this.tValue ).toVector3();
	}

	getRoad () {
		return TvMapQueries.findRoadById( this.roadId );
	}

}
