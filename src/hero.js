import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as RAPIER from '@dimforge/rapier3d-compat'

// Scene tuning: change these values to adjust density, drift, and pointer feel.
const TUNING = {
  instanceCount: 120,       // All 120 marks share one shallow collision layer.
  gridColumns: 15,          // Fifteen columns keep the denser initial layout inside the panel.
  cameraDistance: 19.5,     // Fits the denser cluster in the shallow collision layer.
  cameraFov: 35,
  minScale: 0.5,
  maxScale: 1.3,
  linearDamping: 1.6,      // Water-like drag stops the cluster oscillating.
  angularDamping: 1.2,
  restitution: 0.15,      // Contacts settle rather than bounce.
  friction: 0.4,
  cursorRadius: 0.8,      // Local physical push from the pointer.
  repulsionRadius: 1.8,
  repulsionStrength: 0.006,
  maxRepulsionImpulse: 0.008,
  maxSpeed: 0.55,
  maxAngularSpeed: 0.07,  // About four degrees per second at most.
  returnPull: 0.24,      // Spring back to the settled, centred formation.
  centerPull: 0.003,     // Barely perceptible pull toward the panel centre.
  idleForce: 0.0001,    // Tiny vertical buoyancy; no horizontal sway.
  idleTorque: 0.0001,
  pointerLerp: 0.12,
  pointerFadeMs: 400,
  distortionRadius: 0.55, // Ripple radius in panel UV coordinates.
  distortionStrength: 0.05,
  fixedStep: 1 / 60,
}

const MODEL_NAMES = ['arch', 'asterisk', 'chevron', 'drop', 'leaf', 'quarter', 'rainbow', 'rings']
const BASE_SCALES = [0.78, 0.88, 0.7, 0.59, 0.68, 0.58, 0.72, 0.8]
const CAMERA_HALF_HEIGHT = Math.tan(THREE.MathUtils.degToRad(TUNING.cameraFov / 2)) * TUNING.cameraDistance

let templatesPromise
let rapierPromise

function randomGenerator() {
  let seed = 0x7bc073
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0x100000000
  }
}

function loadTemplates() {
  if (!templatesPromise) {
    const loader = new GLTFLoader()
    templatesPromise = Promise.all(MODEL_NAMES.map(async (name) => {
      const gltf = await loader.loadAsync(`/assets/bytecorp-${name}.glb`)
      const root = gltf.scene
      root.updateMatrixWorld(true)
      const rootInverse = root.matrixWorld.clone().invert()
      const hulls = []

      root.traverse((mesh) => {
        if (!mesh.isMesh) return
        if (!mesh.geometry.getAttribute('color')) {
          throw new Error(`${name}.glb has no vertex colours`)
        }
        if (!mesh.geometry.getAttribute('normal')) mesh.geometry.computeVertexNormals()

        const position = mesh.geometry.getAttribute('position')
        const localMatrix = rootInverse.clone().multiply(mesh.matrixWorld)
        const vertex = new THREE.Vector3()
        const points = new Float32Array(position.count * 3)
        for (let index = 0; index < position.count; index += 1) {
          vertex.fromBufferAttribute(position, index).applyMatrix4(localMatrix)
          points[index * 3] = vertex.x
          points[index * 3 + 1] = vertex.y
          points[index * 3 + 2] = vertex.z
        }
        hulls.push(points)
      })

      if (!hulls.length) throw new Error(`${name}.glb contains no meshes`)
      return { root, hulls }
    }))
  }
  return templatesPromise
}

function initRapier() {
  if (!rapierPromise) rapierPromise = RAPIER.init()
  return rapierPromise
}

function addLighting(scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x525b70, 0.5))
  const lights = [
    [0xffffff, 1.0, 6, 8, 10],
    [0x98baff, 0.3, -7, -5, 6],
    [0xd8e7ff, 0.4, 1, 4, -8],
  ]
  for (const [colour, intensity, x, y, z] of lights) {
    const light = new THREE.DirectionalLight(colour, intensity)
    light.position.set(x, y, z)
    scene.add(light)
  }
}

function createDistortionPass(renderer) {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: true,
    samples: 2,
  })
  target.texture.colorSpace = THREE.LinearSRGBColorSpace
  const uniforms = {
    uScene: { value: target.texture },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: new THREE.Vector2() },
    uEnergy: { value: 0 },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uRadius: { value: TUNING.distortionRadius },
    uStrength: { value: TUNING.distortionStrength },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uScene;
      uniform vec2 uPointer;
      uniform vec2 uVelocity;
      uniform float uEnergy;
      uniform float uTime;
      uniform float uAspect;
      uniform float uRadius;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        vec2 delta = vUv - uPointer;
        delta.x *= uAspect;
        float distanceFromPointer = length(delta);
        float envelope = exp(-1.5 * pow(distanceFromPointer / uRadius, 2.0));
        float wave = sin(distanceFromPointer * 38.0 - uTime * 5.0);
        vec2 radial = delta / max(distanceFromPointer, 0.0001);
        radial.x /= uAspect;
        vec2 offset = radial * wave * envelope * uStrength * uEnergy;
        offset += uVelocity * envelope * uEnergy * 0.65;

        vec4 colour = texture2D(uScene, clamp(vUv + offset, 0.0, 1.0));
        float glint = envelope * (0.5 + 0.5 * wave) * uEnergy * 0.12;
        colour.rgb += vec3(0.24, 0.34, 0.45) * glint;
        colour.a = max(colour.a, glint * 0.3);
        gl_FragColor = colour;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  const postScene = new THREE.Scene()
  postScene.add(quad)
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  return {
    uniforms,
    resize(width, height) {
      const pixelRatio = renderer.getPixelRatio()
      target.setSize(Math.max(1, Math.floor(width * pixelRatio)), Math.max(1, Math.floor(height * pixelRatio)))
      uniforms.uAspect.value = width / height
    },
    render(scene, camera) {
      renderer.setRenderTarget(target)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(postScene, postCamera)
    },
    dispose() {
      quad.geometry.dispose()
      material.dispose()
      target.dispose()
    },
  }
}

export async function mountHero(panel) {
  const host = panel.querySelector('.scene-canvas-host')
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true })
  if (!context) return null

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = false
  const distortionPass = createDistortionPass(renderer)

  let templates
  try {
    await initRapier()
    templates = await loadTemplates()
  } catch (error) {
    distortionPass.dispose()
    renderer.dispose()
    throw error
  }

  const scene = new THREE.Scene()
  addLighting(scene)
  const camera = new THREE.PerspectiveCamera(TUNING.cameraFov, 1, 0.1, 100)
  camera.position.set(0, 0, TUNING.cameraDistance)
  camera.lookAt(0, 0, 0)
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.4,
    metalness: 0,
    side: THREE.DoubleSide,
  })

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 })
  world.timestep = TUNING.fixedStep
  world.integrationParameters.numSolverIterations = 8
  world.integrationParameters.maxCcdSubsteps = 2
  const random = randomGenerator()
  const objects = []
  let wallBody = null
  let halfWidth = CAMERA_HALF_HEIGHT * (panel.clientWidth / Math.max(1, panel.clientHeight))
  let halfHeight = CAMERA_HALF_HEIGHT

  function addWall(body, size, at) {
    const collider = RAPIER.ColliderDesc.cuboid(...size)
      .setTranslation(...at)
      .setRestitution(TUNING.restitution)
      .setFriction(TUNING.friction)
    world.createCollider(collider, body)
  }

  function rebuildWalls() {
    if (wallBody) world.removeRigidBody(wallBody)
    wallBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
    const thickness = 0.5
    // Keep bodies in the scene while allowing their edges to crop at the panel.
    const x = halfWidth + 0.55 + thickness
    const y = halfHeight + 0.55 + thickness
    addWall(wallBody, [thickness, halfHeight + 2, 3], [-x, 0, 0])
    addWall(wallBody, [thickness, halfHeight + 2, 3], [x, 0, 0])
    addWall(wallBody, [halfWidth + 2, thickness, 3], [0, -y, 0])
    addWall(wallBody, [halfWidth + 2, thickness, 3], [0, y, 0])
    addWall(wallBody, [halfWidth + 2, halfHeight + 2, thickness], [0, 0, -0.7])
    addWall(wallBody, [halfWidth + 2, halfHeight + 2, thickness], [0, 0, 0.7])
  }

  const gridRows = Math.ceil(TUNING.instanceCount / TUNING.gridColumns)
  for (let index = 0; index < TUNING.instanceCount; index += 1) {
    const modelIndex = (index + Math.floor(index / 8) * 3) % templates.length
    const template = templates[modelIndex]
    const scale = THREE.MathUtils.clamp(BASE_SCALES[modelIndex] + (random() - 0.5) * 0.24, TUNING.minScale, TUNING.maxScale)
    const visual = template.root.clone(true)
    visual.scale.setScalar(scale)
    visual.traverse((mesh) => {
      if (mesh.isMesh) mesh.material = material
    })

    const column = index % TUNING.gridColumns
    const row = Math.floor(index / TUNING.gridColumns)
    const startX = ((column + 0.5) / TUNING.gridColumns) * 2 - 1 + (row % 2 ? 0.06 : 0) + (random() - 0.5) * 0.1
    const startY = 1 - ((row + 0.5) / gridRows) * 2 + (random() - 0.5) * 0.08
    const x = startX * (halfWidth + 0.1)
    const y = startY * (halfHeight + 0.1)
    const angle = (random() - 0.5) * 0.5
    const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      (random() - 0.5) * 0.08,
      (random() - 0.5) * 0.08,
      angle,
    ))
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, y, (random() - 0.5) * 0.03)
        .setRotation({ x: tilt.x, y: tilt.y, z: tilt.z, w: tilt.w })
        .enabledTranslations(true, true, false)
        .enabledRotations(false, false, true)
        .setCcdEnabled(true)
        .setLinearDamping(TUNING.linearDamping)
        .setAngularDamping(TUNING.angularDamping),
    )

    for (const hull of template.hulls) {
      const scaled = new Float32Array(hull.length)
      for (let vertex = 0; vertex < hull.length; vertex += 1) scaled[vertex] = hull[vertex] * scale
      const collider = RAPIER.ColliderDesc.convexHull(scaled)
      if (!collider) throw new Error('Could not build a convex hull for a GLB mesh')
      collider.setRestitution(TUNING.restitution).setFriction(TUNING.friction)
      world.createCollider(collider, body)
    }

    body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.setAngvel({ x: 0, y: 0, z: 0 }, true)
    scene.add(visual)
    objects.push({ body, visual, phase: random() * Math.PI * 2, home: { x, y } })
  }

  const pointerBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 50),
  )
  world.createCollider(RAPIER.ColliderDesc.ball(TUNING.cursorRadius), pointerBody)

  const raycaster = new THREE.Raycaster()
  const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const pointerNdc = new THREE.Vector2()
  const pointerRaw = new THREE.Vector3()
  const pointerSmooth = new THREE.Vector3()
  const pointerUv = new THREE.Vector2(0.5, 0.5)
  const distortionPointer = new THREE.Vector2(0.5, 0.5)
  const distortionVelocity = new THREE.Vector2()
  let distortionEnergy = 0
  let pointerActive = false
  let pointerWarm = false
  let pointerLeftAt = -Infinity

  function movePointer(event) {
    const bounds = canvas.getBoundingClientRect()
    const u = (event.clientX - bounds.left) / bounds.width
    const v = 1 - (event.clientY - bounds.top) / bounds.height
    pointerNdc.set(u * 2 - 1, v * 2 - 1)
    raycaster.setFromCamera(pointerNdc, camera)
    raycaster.ray.intersectPlane(pointerPlane, pointerRaw)
    if (!pointerWarm) {
      pointerSmooth.copy(pointerRaw)
      pointerBody.setTranslation({ x: pointerRaw.x, y: pointerRaw.y, z: 0 }, true)
      pointerUv.set(u, v)
      distortionPointer.set(u, v)
      distortionVelocity.set(0, 0)
      distortionEnergy = 0.35
      pointerWarm = true
    } else {
      const movement = new THREE.Vector2(u, v).sub(pointerUv)
      distortionVelocity.add(movement).clampLength(0, 0.07)
      distortionEnergy = Math.min(1, Math.max(distortionEnergy, movement.length() * 10))
      pointerUv.set(u, v)
    }
    pointerActive = true
  }

  function leavePointer() {
    pointerActive = false
    pointerLeftAt = performance.now()
  }

  function resize() {
    const width = Math.max(1, panel.clientWidth)
    const height = Math.max(1, panel.clientHeight)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    distortionPass.resize(width, height)
    halfHeight = CAMERA_HALF_HEIGHT
    halfWidth = halfHeight * camera.aspect
    rebuildWalls()
    for (const { body } of objects) {
      const position = body.translation()
      const x = THREE.MathUtils.clamp(position.x, -halfWidth - 0.15, halfWidth + 0.15)
      const y = THREE.MathUtils.clamp(position.y, -halfHeight - 0.15, halfHeight + 0.15)
      if (x !== position.x || y !== position.y) {
        body.setTranslation({ x, y, z: position.z }, true)
        body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    }
  }

  function syncVisuals() {
    for (const { body, visual } of objects) {
      const position = body.translation()
      const rotation = body.rotation()
      visual.position.set(position.x, position.y, position.z)
      visual.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
    }
  }

  function stepPhysics(time, cursorStrength) {
    if (cursorStrength > 0) {
      pointerBody.setNextKinematicTranslation({ x: pointerSmooth.x, y: pointerSmooth.y, z: 0 })
    } else if (pointerWarm) {
      pointerBody.setTranslation({ x: 0, y: 0, z: 50 }, true)
      pointerWarm = false
    }

    for (const { body, phase, home } of objects) {
      const position = body.translation()
      const mass = body.mass()
      const buoyancy = Math.sin(time * 0.28 + phase) * TUNING.idleForce
      body.addForce({
        x: mass * ((home.x - position.x) * TUNING.returnPull - position.x * TUNING.centerPull),
        y: mass * ((home.y - position.y) * TUNING.returnPull - position.y * TUNING.centerPull + buoyancy),
        z: 0,
      }, true)
      body.addTorque({
        x: 0,
        y: 0,
        z: mass * TUNING.idleTorque * Math.sin(phase),
      }, true)

      if (cursorStrength > 0) {
        const dx = position.x - pointerSmooth.x
        const dy = position.y - pointerSmooth.y
        const distanceSq = dx * dx + dy * dy
        if (distanceSq < TUNING.repulsionRadius ** 2) {
          const distance = Math.sqrt(distanceSq)
          const impulse = Math.min(
            TUNING.maxRepulsionImpulse,
            TUNING.repulsionStrength / (distanceSq + 0.35),
          ) * cursorStrength * mass
          body.applyImpulse({
            x: (dx / Math.max(distance, 0.01)) * impulse,
            y: (dy / Math.max(distance, 0.01)) * impulse,
            z: 0,
          }, true)
        }
      }
    }

    world.step()
    for (const { body } of objects) {
      const velocity = body.linvel()
      const speed = Math.hypot(velocity.x, velocity.y, velocity.z)
      if (speed > TUNING.maxSpeed) {
        const factor = TUNING.maxSpeed / speed
        body.setLinvel({ x: velocity.x * factor, y: velocity.y * factor, z: velocity.z * factor }, true)
      }
      const spin = body.angvel()
      const angularSpeed = Math.hypot(spin.x, spin.y, spin.z)
      if (angularSpeed > TUNING.maxAngularSpeed) {
        const factor = TUNING.maxAngularSpeed / angularSpeed
        body.setAngvel({ x: spin.x * factor, y: spin.y * factor, z: spin.z * factor }, true)
      }
    }
  }

  let animationFrame = 0
  let lastFrame = 0
  let accumulator = 0
  let visible = false
  let destroyed = false

  function frame(now) {
    animationFrame = 0
    if (destroyed || !visible || document.hidden) return
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : TUNING.fixedStep
    lastFrame = now
    accumulator = Math.min(accumulator + delta, 0.1)

    if (pointerActive) {
      const lerp = 1 - Math.pow(1 - TUNING.pointerLerp, delta / TUNING.fixedStep)
      const next = pointerRaw.clone().sub(pointerSmooth).multiplyScalar(lerp)
      next.clampLength(0, 0.08)
      pointerSmooth.add(next)
    }
    distortionPointer.lerp(pointerUv, 1 - Math.exp(-delta * 9))
    distortionVelocity.multiplyScalar(Math.exp(-delta * 7))
    distortionEnergy *= Math.exp(-delta * 2.2)
    distortionPass.uniforms.uPointer.value.copy(distortionPointer)
    distortionPass.uniforms.uVelocity.value.copy(distortionVelocity)
    distortionPass.uniforms.uEnergy.value = distortionEnergy
    distortionPass.uniforms.uTime.value = now / 1000
    const cursorStrength = pointerActive
      ? 1
      : Math.max(0, 1 - (now - pointerLeftAt) / TUNING.pointerFadeMs)

    while (accumulator >= TUNING.fixedStep) {
      stepPhysics(now / 1000, cursorStrength)
      accumulator -= TUNING.fixedStep
    }
    syncVisuals()
    distortionPass.render(scene, camera)
    animationFrame = requestAnimationFrame(frame)
  }

  function updateRunning() {
    if (visible && !document.hidden && !destroyed && !animationFrame) {
      lastFrame = 0
      accumulator = 0
      animationFrame = requestAnimationFrame(frame)
    } else if ((!visible || document.hidden) && animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      distortionEnergy = 0
    }
  }

  resize()
  for (let step = 0; step < 90; step += 1) stepPhysics(0, 0)
  for (const object of objects) {
    const position = object.body.translation()
    object.home.x = position.x
    object.home.y = position.y
    object.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    object.body.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }
  syncVisuals()
  distortionPass.render(scene, camera)
  host.appendChild(canvas)
  canvas.addEventListener('pointerenter', movePointer)
  canvas.addEventListener('pointermove', movePointer)
  canvas.addEventListener('pointerleave', leavePointer)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(panel)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    updateRunning()
  })
  intersectionObserver.observe(panel)
  document.addEventListener('visibilitychange', updateRunning)

  return () => {
    destroyed = true
    if (animationFrame) cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', updateRunning)
    canvas.removeEventListener('pointerenter', movePointer)
    canvas.removeEventListener('pointermove', movePointer)
    canvas.removeEventListener('pointerleave', leavePointer)
    canvas.remove()
    material.dispose()
    world.free()
    distortionPass.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
}
