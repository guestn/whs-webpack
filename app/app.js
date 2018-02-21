import * as THREE from 'three';
import * as UTILS from './globals';
import * as WHS from 'whs';
//import Ammo from './modules/ammo'
import * as PHYSICS from './modules/physics-module';
import StatsModule from './modules/StatsModule';

const app = new WHS.App([
  new WHS.ElementModule(),
  new WHS.SceneModule(),
  new WHS.DefineModule('camera',
    new WHS.PerspectiveCamera({
      position: new THREE.Vector3(0, 50, 150),
      far: 1000
    })
  ),
  new WHS.RenderingModule(UTILS.appDefaults.rendering, {
    shadow: true
  }),
  new PHYSICS.WorldModule(UTILS.appDefaults.physics),
  new WHS.OrbitControlsModule(),
  new WHS.ResizeModule(),
  new StatsModule()
]);
import {FancyMaterialModule} from './modules/FancyMaterialModule';
import {BasicComponent} from './components/BasicComponent';

const slushySnowMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 50,
  side: THREE.DoubleSide,
  //wireframe: true,
  map: new THREE.TextureLoader().load('assets/snow/diffuse.jpg', map => {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1,1)
  }),
  aoMap: new THREE.TextureLoader().load('assets/snow/ambientocclusion.jpg'),
  aoMapIntensity: 0.5,
  normalMap: new THREE.TextureLoader().load('assets/snow/normal.jpg'),
  normalScale: new THREE.Vector2(1,1),
  specularMap: new THREE.TextureLoader().load('assets/snow/reflectiveocclusion.jpg'),
  bumpMap: new THREE.TextureLoader().load('assets/snow/bump.jpg'),
  bumpScale: 2,
  displacementMap: null,
  displacementScale: 1,
  emissiveMap: null,
  emissiveIntensity: 1,
  lightMap: null,
  lightMapIntensity: 1,
  needsUpdate: true
});

const deepSnowMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 30,
  side: THREE.DoubleSide,
  //wireframe: true,
  normalMap: new THREE.TextureLoader().load('assets/snow-deep/normal.jpg', map => {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(5,5)
  }),
  normalScale: new THREE.Vector2(1,1),
  bumpMap: new THREE.TextureLoader().load('assets/snow-deep/bump.jpg'),
  bumpScale: 2,
  specularMap: new THREE.TextureLoader().load('assets/snow/reflectiveocclusion.jpg', map => {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(5,5)
  }),
  displacementMap: new THREE.TextureLoader().load('assets/snow-deep/bump.jpg'),
  displacementScale: 12,
  emissiveMap: null,
  emissiveIntensity: 1,
  lightMap: null,
  lightMapIntensity: 1,
  needsUpdate: true
});


//UTILS.addBoxPlane(app);

const addBasicLights = (app, intensity = 0.5, position = [0, 10, 10], distance = 150, shadowmap) => {
  const ambient = new WHS.AmbientLight({
    intensity: 0.3,
    color: 0xddddff,
  }).addTo(app);

  const point = new WHS.PointLight({
    intensity,
    distance,
    color: 0xffbb55,

    shadow: Object.assign({
      fov: 90
    }, shadowmap),

    position
  }).addTo(app);
}

addBasicLights(app);

// u, v go 0=>1
const func = (u, v) =>
  //new THREE.Vector3(u * 100, Math.sin(u * 10) * 4, v * 100);
  new THREE.Vector3(u * 200, 120*Math.pow((u-0.5),2)-v*20, v * 200);

const heightSegments = {x:4,y:4}

const scaleX = 1

const terrain = new WHS.Parametric({
  geometry: {
    func,
    slices: heightSegments.x,
    stacks: heightSegments.y,
  },

  scale: new THREE.Vector3(scaleX,1,1),

  shadow: {
    cast: false
  },

  material: deepSnowMat, //slushySnowMat,

  modules: [
    new PHYSICS.HeightfieldModule({
      mass: 0,
      size: new THREE.Vector2(heightSegments.x, heightSegments.y),
      autoAlign: true,
      scale: new THREE.Vector3(scaleX,1,1),
      friction: 0.7
    })
  ]
});

console.log(terrain.geometry.vertices, {terrain})

//terrain.addTo(app);


const sphere = new WHS.Sphere({ // Create sphere comonent.
  geometry: {
    radius: 15,
    widthSegments: 32,
    heightSegments: 32
  },

  modules: [
    new PHYSICS.SphereModule({
      mass: 0,
      restitution: 1
    })
  ],

  material: deepSnowMat,

  position: new THREE.Vector3(8, 20, 0)
});
app.add(sphere)

terrain.addTo(app).then(() => {
  app.start()
})

console.log({app})

document.getElementById('reset').addEventListener('click',()=>{
  app.stop()
  sphere.position.set(9,50,0);
  app.start();
})
