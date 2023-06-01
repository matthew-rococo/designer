/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { AnyControlPoint } from 'app/modules/three-js/objects/control-point';
import { LineType, OdLaneReferenceLineBuilder } from 'app/modules/tv-map/builders/od-lane-reference-line-builder';
import { CommandHistory } from 'app/services/command-history';
import { Vector3 } from 'three';
import { MouseButton, PointerEventData } from '../../events/pointer-event-data';
import { LaneWidthNode } from '../../modules/three-js/objects/lane-width-node';
import { TvLane } from '../../modules/tv-map/models/tv-lane';
import { CreateWidthNodeCommand } from '../commands/create-lane-width-command';
import { SelectLaneForLaneWidthCommand } from '../commands/select-lane-for-lane-width-command';
import { SelectLaneWidthNodeCommand } from '../commands/select-lane-width-node-command';
import { UnselectLaneForLaneWidthCommand } from '../commands/unselect-lane-for-lane-width-command';
import { UnselectLaneWidthNodeCommand } from '../commands/unselect-lane-width-node-command';
import { UpdateWidthNodePositionCommand } from '../commands/update-width-node-position-command';
import { NodeFactoryService } from '../factories/node-factory.service';
import { KeyboardInput } from '../input';
import { ToolType } from '../models/tool-types.enum';
import { PickingHelper } from '../services/picking-helper.service';
import { BaseTool } from './base-tool';

export class LaneWidthTool extends BaseTool {

	public name: string = 'LaneWidth';
	public toolType = ToolType.LaneWidth;

	private laneWidthChanged: boolean = false;
	private pointerDown: boolean = false;
	private pointerDownAt: Vector3;

	public lane: TvLane;
	public controlPoint: AnyControlPoint;
	public node: LaneWidthNode;

	public laneHelper = new OdLaneReferenceLineBuilder( null, LineType.DASHED );

	constructor () {

		super();

	}

	init () {

		this.setHint( 'Click on a road to show lane width nodes' );

	}

	enable () {

		super.enable();

	}

	disable () {

		super.disable();

		this.laneHelper.clear();

		this.map.getRoads().forEach( road => road.hideWidthNodes() );
	}

	public onPointerDown ( e: PointerEventData ) {

		if ( e.button === MouseButton.RIGHT || e.button === MouseButton.MIDDLE ) return;

		this.pointerDown = true;
		this.pointerDownAt = e.point;

		const shiftKeyDown = KeyboardInput.isShiftKeyDown;

		if ( !shiftKeyDown && this.checkNodePointInteraction( e ) ) return;

		if ( !shiftKeyDown && this.checkLaneObjectInteraction( e ) ) return;

		if ( shiftKeyDown && e.point != null ) {

			const lane = PickingHelper.checkLaneObjectInteraction( e );

			if ( !lane ) return false;

			CommandHistory.execute( new CreateWidthNodeCommand( this, lane, e.point ) );

			this.setHint( 'Click and drag on the lane width node to change its position' );


		} else if ( this.lane ) {

			CommandHistory.execute( new UnselectLaneForLaneWidthCommand( this, this.lane ) );

		}
	}

	public onPointerUp ( e ) {

		if ( this.laneWidthChanged && this.node ) {

			const newPosition = this.node.point.position.clone();

			const oldPosition = this.pointerDownAt.clone();

			CommandHistory.execute( new UpdateWidthNodePositionCommand( this.node, newPosition, oldPosition, this.laneHelper ) );

		}

		this.pointerDown = false;

		this.pointerDownAt = null;

		this.laneWidthChanged = false;
	}

	public onPointerMoved ( e: PointerEventData ) {

		if ( this.pointerDown && this.node ) {

			this.laneWidthChanged = true;

			NodeFactoryService.updateLaneWidthNode( this.node, e.point );

			this.node.updateLaneWidthValues();

			// this.updateLaneWidth( this.pointerObject.parent as LaneWidthNode );

			// if ( this.lane ) this.laneHelper.redraw( LineType.DASHED );

		}

		// else if ( this.pointerDown && this.pointerObject && this.pointerObject[ 'tag' ] == LaneWidthNode.lineTag ) {

		//     this.laneWidthChanged = true;

		//     NodeFactoryService.updateLaneWidthNode( this.pointerObject.parent as LaneWidthNode, e.point );

		//     this.updateLaneWidth( this.pointerObject.parent as LaneWidthNode );

		//     if ( this.lane ) this.laneHelper.redraw( LineType.DASHED );

		// }
	}

	// private checkReferenceLineInteraction ( e: PointerEventData ) {

	//     let hasInteracted = false;

	//     this.checkIntersection( this.laneHelper.tag, e.intersections, ( obj ) => {

	//         hasInteracted = true;

	//         this.laneHelper.onLineSelected( obj as Line );

	//     } );

	//     return hasInteracted;
	// }

	private checkNodePointInteraction ( e: PointerEventData ): boolean {

		// Check for control point interactions
		const interactedPoint = PickingHelper.checkControlPointInteraction( e, LaneWidthNode.pointTag );

		// If there's no control point interaction,
		// reset controlPoint if needed and return false
		if ( !interactedPoint ) {
			return false;
		}

		// Ensure the controlPoint has a parent before proceeding
		if ( !interactedPoint.parent ) {
			return false;
		}

		const newNode = interactedPoint.parent as LaneWidthNode;

		if ( !this.node || this.node.uuid !== newNode.uuid ) {

			CommandHistory.execute( new SelectLaneWidthNodeCommand( this, newNode ) );

		}

		// const commands = [];

		// Check if controlPoint or widthNode are different before pushing commands
		// if ( this.controlPoint !== interactedPoint ) {
		// 	commands.push( new SetValueCommand( this, 'controlPoint', interactedPoint ) );
		// }
		//
		// if ( this.node !== laneWidthNode ) {
		// 	commands.push( new SetValueCommand( this, 'node', laneWidthNode ) );
		// }
		//
		// if ( this.controlPoint !== interactedPoint || this.node !== laneWidthNode ) {
		// 	commands.push( new SetInspectorCommand( LaneWidthInspector, { node: laneWidthNode } ) );
		// }
		// if ( commands.length > 0 ) CommandHistory.executeMany( ...commands );

		return true;
	}

	private checkLaneObjectInteraction ( e: PointerEventData ): boolean {

		const newLane = PickingHelper.checkLaneObjectInteraction( e );

		if ( !newLane ) return false;

		if ( !this.lane || this.lane.roadId !== newLane.roadId ) {

			CommandHistory.execute( new SelectLaneForLaneWidthCommand( this, newLane ) );

		} else if ( this.node ) {

			CommandHistory.execute( new UnselectLaneWidthNodeCommand( this, this.node ) );

		}

		return true;
	}
}
