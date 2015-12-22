import THREE from 'three';
import ArenaLight from 'client/lights/arena';
import BallMesh from 'client/meshes/ball';
import CAMERA from 'client/cameras/main';
import FloorMesh from 'client/meshes/floor';
import WorldLight from 'client/lights/world';

export default class {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());
    this.scene.add(FloorMesh());
    this.ball = BallMesh();
    this.scene.add(this.ball);
  }
}
