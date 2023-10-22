/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { BaseCommand } from 'app/core/commands/base-command';
import { SelectPointCommand } from 'app/core/commands/select-point-command';
import { SetInspectorCommand } from 'app/core/commands/set-inspector-command';
import { SceneService } from 'app/core/services/scene.service';
import { RoadElevationNode } from 'app/modules/three-js/objects/road-elevation-node';
import { TvElevation } from 'app/modules/tv-map/models/tv-elevation';
import { TvRoad } from 'app/modules/tv-map/models/tv-road.model';
import { DynamicInspectorComponent } from 'app/views/inspectors/dynamic-inspector/dynamic-inspector.component';
import { Vector3 } from 'three';
import { RoadElevationTool } from './road-elevation-tool';
import { MapEvents } from 'app/events/map-events';

export class CreateElevationNodeCommand extends BaseCommand {

	private selectPointCommand: SelectPointCommand;

	private inspectorCommand: SetInspectorCommand;

	constructor ( private tool: RoadElevationTool, private node: RoadElevationNode ) {

		super();

		this.selectPointCommand = new SelectPointCommand( tool, this.node );

		this.inspectorCommand = new SetInspectorCommand( DynamicInspectorComponent, this.node );
	}

	execute (): void {

		this.node.road.addElevationInstance( this.node.elevation );

		SceneService.add( this.node );

		this.selectPointCommand.execute();

		this.inspectorCommand.execute();

		MapEvents.roadUpdated.emit( this.node.road );
	}

	undo (): void {

		this.node.road.removeElevationInstance( this.node.elevation );

		SceneService.remove( this.node );

		this.selectPointCommand.undo();

		this.inspectorCommand.undo();

		MapEvents.roadUpdated.emit( this.node.road );
	}

	redo (): void {

		this.execute();

	}

}
