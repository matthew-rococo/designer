/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { LaneWidthNode } from '../../modules/three-js/objects/lane-width-node';
import { LaneWidthInspector } from '../../views/inspectors/lane-width-inspector/lane-width-inspector.component';
import { BaseCommand } from '../../commands/base-command';
import { SetInspectorCommand } from '../../commands/set-inspector-command';
import { LaneWidthTool } from './lane-width-tool';

export class SelectLaneWidthNodeCommand extends BaseCommand {

	private readonly oldNode: LaneWidthNode;

	private inspectorCommand: any;

	constructor (
		private tool: LaneWidthTool,
		private newNode: LaneWidthNode,
	) {

		super();

		this.oldNode = this.tool.node;

		this.inspectorCommand = new SetInspectorCommand( LaneWidthInspector, newNode.laneWidth );

	}

	execute (): void {

		this.oldNode?.unselect();

		this.tool.node = this.newNode;

		this.newNode?.select();

		this.inspectorCommand.execute();

	}

	undo (): void {

		this.newNode?.unselect();

		this.tool.node = this.oldNode;

		this.oldNode?.select();

		this.inspectorCommand.undo();

	}

	redo (): void {

		this.execute();

	}
}
