import {
  Engine,
  ArcRotateCamera,
  Scene,
  SceneLoader,
  Vector3,
  Mesh,
  Color3,
  HemisphericLight,
  DirectionalLight,
  AbstractMesh,
  Color4
} from '@babylonjs/core'

import {
  VmdLoader,
  MmdRuntime,
  MmdAnimation,
  MmdModel,
  MmdAmmoPhysics,
  MmdAmmoJSPlugin
} from 'babylon-mmd'
import ammo from './ammo/ammo.wasm'

import { charPath, motionPath, showMenuBar, showSettings } from './useStates'

export async function useScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {}, true)

  const scene = new Scene(engine)
  scene.clearColor = new Color4(0.12, 0.1, 0.18, 0)
  scene.ambientColor = new Color3(0.5, 0.5, 0.5)

  const ammoInstance = await ammo()
  const ammoPlugin = new MmdAmmoJSPlugin(true, ammoInstance)
  scene.enablePhysics(new Vector3(0, -1, 0), ammoPlugin)

  const initScene = () => {
    const camera = new ArcRotateCamera('ArcRotateCamera', 0, 0, 45, new Vector3(0, 12, 0), scene)
    camera.setPosition(new Vector3(0, 22, -25))
    camera.attachControl(canvas, false)
    camera.inertia = 0.8
    camera.speed = 10

    const hemisphericLight = new HemisphericLight('HemisphericLight', new Vector3(0, 1, 0), scene)
    hemisphericLight.intensity = 0.4
    hemisphericLight.specular = new Color3(0, 0, 0)
    hemisphericLight.groundColor = new Color3(1, 1, 1)

    const directionalLight = new DirectionalLight(
      'DirectionalLight',
      new Vector3(8, -15, 10),
      scene
    )
    directionalLight.intensity = 0.8
  }

  const vmdLoader = new VmdLoader(scene)
  let mmdRuntime: MmdRuntime, modelMesh: AbstractMesh, mmdModel: MmdModel, motion: MmdAnimation

  const initMMD = async () => {
    mmdRuntime = new MmdRuntime(scene, new MmdAmmoPhysics(scene))
    mmdRuntime.register(scene)

    await loadMesh()
    loadMotion()

    mmdRuntime.onPauseAnimationObservable.add(() => {
      if (mmdRuntime.currentTime == mmdRuntime.animationDuration) {
        mmdRuntime.seekAnimation(0, true)
        mmdRuntime.playAnimation()
      }
    })
  }

  const loadMesh = async () => {
    if (mmdModel != undefined) {
      mmdRuntime.destroyMmdModel(mmdModel)
      modelMesh.dispose()
    }
    if (charPath.value != undefined) {
      modelMesh = await SceneLoader.ImportMeshAsync(
        undefined,
        charPath.value.dir,
        charPath.value.name,
        scene
      ).then((result) => {
        const mesh = result.meshes[0]
        return mesh
      })
      mmdModel = mmdRuntime.createMmdModel(modelMesh as Mesh)
      loadMotion()
    }
  }

  const loadMotion = async () => {
    if (motionPath.value != undefined) {
      motion = await vmdLoader.loadAsync(
        motionPath.value.name,
        motionPath.value.dir + motionPath.value.name
      )
      mmdModel.addAnimation(motion)
      mmdModel.setAnimation(motionPath.value.name)
      mmdRuntime.playAnimation()
    }
  }

  window.electron.ipcRenderer.on('selected-char', (_, file) => {
    charPath.value = file
    loadMesh()
    showMenuBar.value = false
    showSettings.value = false
  })
  window.electron.ipcRenderer.on('selected-motion', (_, file) => {
    motionPath.value = file
    loadMotion()
    showMenuBar.value = false
    showSettings.value = false
  })

  // watch(SelectedMotion, async () => {
  //   if (mmdModel != undefined) {
  //     let exist = false
  //     for (const v of mmdModel.runtimeAnimations) {
  //       if (v.animation != undefined && v.animation.name == SelectedMotion.value) {
  //         exist = true
  //         break
  //       }
  //     }
  //     if (!exist) {
  //       loadMotion()
  //     } else {
  //       mmdModel.setAnimation(`${SelectedMotion.value}`)
  //       mmdRuntime.seekAnimation(0, true)
  //       mmdRuntime.playAnimation()
  //     }
  //   }
  // })

  initScene()
  initMMD()

  engine.runRenderLoop(() => {
    engine.resize()
    scene.render()
  })
}
