import {
  Engine,
  ArcRotateCamera,
  Scene,
  SceneLoader,
  Vector3,
  Mesh,
  MeshBuilder,
  Color3,
  HemisphericLight,
  DirectionalLight,
  AbstractMesh,
  Texture,
  BackgroundMaterial,
  SkeletonViewer,
  Color4
} from '@babylonjs/core'

import { VmdLoader, MmdRuntime, MmdPhysics, MmdAnimation, MmdModel } from 'babylon-mmd'

import { watch } from 'vue'
import { PhysicsEnabled, SelectedAnimation, SelectedChar } from './useStates'

export async function useScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {}, true)

  const scene = new Scene(engine)
  scene.clearColor = new Color4(0.12, 0.1, 0.18, 0)

  //   const havokInstance = await havokPhysics()
  //   const havokPlugin = new HavokPlugin(true, havokInstance)
  //   scene.enablePhysics(new Vector3(0, -98, 0), havokPlugin)
  //   let physicsViewer: PhysicsViewer | undefined

  //   const showPhysicsHelper = () => {
  //     if (physicsViewer != undefined) {
  //       physicsViewer.dispose()
  //     }
  //     physicsViewer = new PhysicsViewer(scene)
  //     for (const node of modelMesh.getChildTransformNodes(true)) {
  //       if (node.physicsBody) physicsViewer.showBody(node.physicsBody)
  //     }
  //   }

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
    let physics: MmdPhysics | undefined = undefined
    if (PhysicsEnabled.value) {
      physics = new MmdPhysics(scene)
      physics.angularLimitClampThreshold = (30 * Math.PI) / 180
    }
    mmdRuntime = new MmdRuntime(scene, physics)

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
    modelMesh = await SceneLoader.ImportMeshAsync(
      undefined,
      `/chars/${SelectedChar.value}/`,
      `${SelectedChar.value}.pmx`,
      scene
    ).then((result) => {
      const mesh = result.meshes[0]

      const skeletonViewer = new SkeletonViewer(result.skeletons[0], modelMesh, scene, false)
      skeletonViewer.isEnabled = true
      skeletonViewer.color = new Color3(1, 0, 0)
      return mesh
    })

    mmdModel = mmdRuntime.createMmdModel(modelMesh as Mesh)
  }

  const loadMotion = async () => {
    motion = await vmdLoader.loadAsync(
      `${SelectedAnimation.value}`,
      `/motions/${SelectedAnimation.value}.vmd`
    )
    mmdModel.addAnimation(motion)
    mmdModel.setAnimation(`${SelectedAnimation.value}`)
    mmdRuntime.playAnimation()
  }

  watch(SelectedChar, async () => {
    if (mmdModel != undefined) {
      mmdRuntime.destroyMmdModel(mmdModel)
      mmdModel.dispose()
      modelMesh.dispose()
    }
    await loadMesh()
    loadMotion()
  })

  watch(SelectedAnimation, async () => {
    if (mmdModel != undefined) {
      let exist = false
      for (const v of mmdModel.runtimeAnimations) {
        if (v.animation != undefined && v.animation.name == SelectedAnimation.value) {
          exist = true
          break
        }
      }
      if (!exist) {
        loadMotion()
      } else {
        mmdModel.setAnimation(`${SelectedAnimation.value}`)
        mmdRuntime.seekAnimation(0, true)
        mmdRuntime.playAnimation()
      }
    }
  })

  watch(PhysicsEnabled, () => {
    if (mmdRuntime != undefined) {
      mmdRuntime.dispose(scene)
      modelMesh.dispose()
      mmdModel.dispose()
    }
    initMMD()
  })

  initScene()
  initMMD()

  engine.runRenderLoop(() => {
    engine.resize()
    scene.render()
  })
}
