/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import * as THREE from 'three';
import { SceneService } from '../../services/scene.service';
import { AbstractShapeEditor } from './abstract-shape-editor';

export class PolygonEditor extends AbstractShapeEditor {

	group: THREE.Group;
	line: any;

	constructor () {

		super();

	}

	public draw () {
		this.drawPolygon();
	}

	public drawPolygon () {

		if ( this.group != null ) SceneService.removeFromMain( this.group );
		if ( this.line != null ) SceneService.removeFromMain( this.line );

		this.group = new THREE.Group();

		var splineShape = new THREE.Shape();

		let v0 = this.vector2ControlPoints[ 0 ];

		splineShape.moveTo( v0.x, v0.y );

		splineShape.splineThru( this.vector2ControlPoints );

		var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

		this.addShape( splineShape, 0xf08000, 0, 0, 0, 0, 0, 0, 1 );

		SceneService.addToMain( this.group );

	}

	addShape ( shape: THREE.Shape, color: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, s: number ) {

		// flat shape with texture
		// note: default UVs generated by THREE.ShapeBufferGeometry are simply the x- and y-coordinates of the vertices
		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'assets/textures/terrain/grasslight-big.jpg' );
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 25, 25 );
		texture.anisotropy = 16;

		// let geometry1 = new BufferGeometry( shape );
		// var mesh = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial( { map: texture } ) );
		// mesh.position.set( x, y, z - 175 );
		// mesh.rotation.set( rx, ry, rz );
		// mesh.scale.set( s, s, s );
		// this.group.add( mesh );

		// // flat shape
		// var geometry2 = new THREE.ShapeBufferGeometry( shape );
		// var mesh = new THREE.Mesh( geometry2, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
		// mesh.position.set( x, y, z - 125 );
		// mesh.rotation.set( rx, ry, rz );
		// mesh.scale.set( s, s, s );
		// this.group.add( mesh );

		// // extruded shape
		// var geometry3 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		// var mesh = new THREE.Mesh( geometry3, new THREE.MeshPhongMaterial( { color: color, opacity: 0.8 } ) );
		// mesh.position.set( x, y, z - 10 );
		// mesh.rotation.set( rx, ry, rz );
		// mesh.scale.set( s, s, s );
		// this.group.add( mesh );

		this.addLineShape( shape, color, x, y, z, rx, ry, rz, s );
	}

	addLineShape ( shape, color, x, y, z, rx, ry, rz, s ) {

		// lines
		shape.autoClose = true;
		var points = shape.getPoints();
		var spacedPoints = shape.getSpacedPoints( 50 );
		var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );

		// solid line
		let line = this.line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color } ) );
		line.position.set( x, y, z - 25 );
		line.rotation.set( rx, ry, rz );
		line.scale.set( s, s, s );
		this.group.add( line );

		// // line from equidistance sampled points
		// var line = new THREE.Line( geometrySpacedPoints, new THREE.LineBasicMaterial( { color: color } ) );
		// line.position.set( x, y, z + 25 );
		// line.rotation.set( rx, ry, rz );
		// line.scale.set( s, s, s );
		// this.group.add( line );

		// // vertices from real points
		// var particles = new THREE.Points( geometryPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
		// particles.position.set( x, y, z + 75 );
		// particles.rotation.set( rx, ry, rz );
		// particles.scale.set( s, s, s );
		// this.group.add( particles );

		// // equidistance sampled points
		// var particles = new THREE.Points( geometrySpacedPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
		// particles.position.set( x, y, z + 125 );
		// particles.rotation.set( rx, ry, rz );
		// particles.scale.set( s, s, s );
		// this.group.add( particles );
	}
}
