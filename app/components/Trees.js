import * as THREE from 'three';
import * as WHS from 'whs';
import * as PHYSICS from '../modules/physics-module';


const Trees = () => {
  // const textureMap = new THREE.TextureLoader().load('./assets/textures/UV_Grid_Sm.png', texture => {
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set( 1, 1 );
  // })

  const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});
  const materialWHS = material.clone();


  const tree = new WHS.Importer({
    loader: new THREE.JSONLoader(),
    url: './assets/tree.json',
    modules: [
      new PHYSICS.ConcaveModule({
        friction: 0.9,
        mass: 0,
        restitution: 0.5,
        //path: `${process.assetsPath}/models/teapot/utah-teapot-light.json`,
        //scale: new THREE.Vector3(1,1,1)
        //scale: new THREE.Vector3(scaleX,scaleX,scaleZ),
      }),
      // new WHS.TextureModule({
      //   url: './assets/textures/UV_Grid_Sm.png',
      //   repeat: new THREE.Vector2(10,10),
      //   // wrapS: THREE.ClampToEdgeWrapping,
      //   // wrapT: THREE.ClampToEdgeWrapping,
      // })
    ],
    //material,
    // material: new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   //flatShading: false,
    //   side: THREE.DoubleSide,
    //   //wireframe: false,
    //   shininess: 80,
    //   //specular: 0x999999,
    //   //map: textureMap,
    // }),
    shadow: {
      cast: true,
      receive: true
    },    //material: materialWHS,
    position: {
      x: -80,
      y: -100,
      z: -500
    },
    rotation: [0, 0, Math.PI/100],
    //scale: [scaleX,scaleX,scaleZ]
  })

  //terrain.receiveShadow = true;
  console.log({tree})
  
  //terrain.native.name = "terrain"

  return tree;
};
  

export default Trees;