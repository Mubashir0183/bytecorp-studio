import * as RAPIER from '@dimforge/rapier3d-compat'

const SVG_NS = 'http://www.w3.org/2000/svg'
const SOURCE = '/assets/figma-feature.svg'
const SHAPE_INDICES = Array.from({ length: 24 }, (_, index) => index + 1)
  .filter((index) => ![3, 11, 16, 19].includes(index))
const UNITS_PER_PIXEL = 1 / 100
const STEP = 1 / 60
const TOTAL_SHAPES = 50

function randomGenerator() {
  let seed = 0x217e5a
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0x100000000
  }
}

async function loadShapes() {
  const response = await fetch(SOURCE)
  if (!response.ok) throw new Error(`Could not load the shape artwork (${response.status})`)
  const markup = await response.text()
  const source = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement
  source.style.position = 'absolute'
  source.style.left = '-10000px'
  source.style.visibility = 'hidden'
  document.body.append(source)

  const definitions = source.querySelector('defs')
  const artwork = source.children[0].children[0]
  const shapes = []

  try {
    for (const index of SHAPE_INDICES) {
      const element = artwork.children[index]
      const box = element.getBBox()
      const svg = document.createElementNS(SVG_NS, 'svg')
      svg.setAttribute('xmlns', SVG_NS)
      svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
      svg.setAttribute('width', `${box.width}`)
      svg.setAttribute('height', `${box.height}`)
      if (definitions) svg.append(definitions.cloneNode(true))
      svg.append(element.cloneNode(true))

      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
      shapes.push({ url, width: box.width, height: box.height })
    }
  } catch (error) {
    for (const shape of shapes) URL.revokeObjectURL(shape.url)
    throw error
  } finally {
    source.remove()
  }

  return shapes
}

export async function mountShapeShower(panel) {
  await RAPIER.init()
  const shapes = await loadShapes()
  const stage = panel.querySelector('.shape-stage')
  const world = new RAPIER.World({ x: 0, y: 35, z: 0 })
  world.timestep = STEP
  world.integrationParameters.numSolverIterations = 16
  world.integrationParameters.maxCcdSubsteps = 4
  const random = randomGenerator()
  const objects = []
  const sequence = Array.from({ length: TOTAL_SHAPES }, (_, index) => shapes[index % shapes.length])
  for (let index = sequence.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    const item = sequence[index]
    sequence[index] = sequence[swap]
    sequence[swap] = item
  }
  let walls = null
  let nextShape = 0
  let timer = 0
  let frameId = 0
  let lastFrame = 0
  let accumulator = 0
  let lastDropAt = 0
  let width = panel.clientWidth
  let height = panel.clientHeight
  const scale = 1
  let destroyed = false
  let pointerActive = false
  const pointerTarget = { x: 0, y: 0 }
  const pointerPosition = { x: 0, y: 0 }
  const pointerBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 10),
  )
  world.createCollider(
    RAPIER.ColliderDesc.ball(0.32).setFriction(3).setRestitution(0),
    pointerBody,
  )

  function createWall(body, x, y, halfWidth, halfHeight) {
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(halfWidth, halfHeight, 0.5)
        .setTranslation(x, y, 0)
        .setFriction(6)
        .setRestitution(0),
      body,
    )
  }

  function rebuildWalls() {
    if (walls) world.removeRigidBody(walls)
    walls = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
    const w = width * UNITS_PER_PIXEL
    const h = height * UNITS_PER_PIXEL
    createWall(walls, -0.5, h / 2, 0.5, h / 2 + 5)
    createWall(walls, w + 0.5, h / 2, 0.5, h / 2 + 5)
    createWall(walls, w / 2, h + 0.5, w / 2 + 5, 0.5)
  }

  function addShape(shape, index) {
    const shapeWidth = shape.width * scale
    const shapeHeight = shape.height * scale
    const radius = Math.hypot(shapeWidth, shapeHeight) / 2
    const space = Math.max(0, width - shapeWidth - 16)
    const x = width < shapeWidth + 16
      ? width / 2
      : shapeWidth / 2 + 8 + ((index * 0.61803398875 + random() * 0.38) % 1) * space
    let y = -radius - 8 - random() * 70
    for (const object of objects) {
      const position = object.body.translation()
      const rotation = object.body.rotation()
      const existingAngle = 2 * Math.atan2(rotation.z, rotation.w)
      const halfWidth = (Math.abs(Math.cos(existingAngle)) * object.width + Math.abs(Math.sin(existingAngle)) * object.height) / 2
      const halfHeight = (Math.abs(Math.sin(existingAngle)) * object.width + Math.abs(Math.cos(existingAngle)) * object.height) / 2
      const otherX = position.x / UNITS_PER_PIXEL
      const otherY = position.y / UNITS_PER_PIXEL
      if (Math.abs(otherX - x) < halfWidth + radius + 12) {
        y = Math.min(y, otherY - halfHeight - radius - 12)
      }
    }
    const angle = shapeWidth > width * 0.7 ? 0 : (random() - 0.5) * 1.1
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x * UNITS_PER_PIXEL, y * UNITS_PER_PIXEL, 0)
        .setRotation({ x: 0, y: 0, z: Math.sin(angle / 2), w: Math.cos(angle / 2) })
        .enabledTranslations(true, true, false)
        .enabledRotations(false, false, true)
        .setCcdEnabled(true)
        .setLinearDamping(1.8)
        .setAngularDamping(5),
    )
    body.setLinvel({ x: (random() - 0.5) * 1.5, y: 2 + random() * 2, z: 0 }, true)
    body.setAngvel({ x: 0, y: 0, z: (random() - 0.5) * 2 }, true)
    const collider = RAPIER.ColliderDesc.cuboid(
      Math.max(0.08, shapeWidth * UNITS_PER_PIXEL * 0.525),
      Math.max(0.08, shapeHeight * UNITS_PER_PIXEL * 0.525),
      0.08,
    )
    collider.setFriction(6).setRestitution(0).setDensity(1)
    world.createCollider(collider, body)

    const image = document.createElement('img')
    image.className = 'falling-shape'
    image.src = shape.url
    image.alt = ''
    image.width = shapeWidth
    image.height = shapeHeight
    image.style.width = `${shapeWidth}px`
    image.style.height = `${shapeHeight}px`
    stage.append(image)
    objects.push({ body, image, width: shapeWidth, height: shapeHeight })
  }

  function render() {
    for (const object of objects) {
      const position = object.body.translation()
      const rotation = object.body.rotation()
      const angle = 2 * Math.atan2(rotation.z, rotation.w)
      const x = position.x / UNITS_PER_PIXEL - object.width / 2
      const y = position.y / UNITS_PER_PIXEL - object.height / 2
      object.image.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`
    }
  }

  function separateShapes() {
    const bodies = objects.map((object) => {
      const position = object.body.translation()
      const rotation = object.body.rotation()
      const angle = 2 * Math.atan2(rotation.z, rotation.w)
      return {
        object,
        x: position.x,
        y: position.y,
        halfWidth: (Math.abs(Math.cos(angle)) * object.width + Math.abs(Math.sin(angle)) * object.height) * UNITS_PER_PIXEL / 2 + 0.02,
        halfHeight: (Math.abs(Math.sin(angle)) * object.width + Math.abs(Math.cos(angle)) * object.height) * UNITS_PER_PIXEL / 2 + 0.02,
        moved: false,
      }
    })

    for (let pass = 0; pass < 5; pass += 1) {
      let changed = false
      for (let first = 0; first < bodies.length; first += 1) {
        const a = bodies[first]
        for (let second = first + 1; second < bodies.length; second += 1) {
          const b = bodies[second]
          const overlapX = a.halfWidth + b.halfWidth - Math.abs(a.x - b.x)
          if (overlapX <= 0) continue
          const overlapY = a.halfHeight + b.halfHeight - Math.abs(a.y - b.y)
          if (overlapY <= 0) continue
          const left = a.x <= b.x ? a : b
          const right = a.x <= b.x ? b : a
          const leftRoom = Math.max(0, left.x - left.halfWidth)
          const rightRoom = Math.max(0, width * UNITS_PER_PIXEL - right.x - right.halfWidth)
          const horizontalShift = overlapX + 0.005
          if (overlapX < overlapY && leftRoom + rightRoom >= horizontalShift) {
            const shiftLeft = Math.min(leftRoom, Math.max(horizontalShift - rightRoom, horizontalShift / 2))
            left.x -= shiftLeft
            right.x += horizontalShift - shiftLeft
            left.moved = true
            right.moved = true
          } else {
            const upper = a.y <= b.y ? a : b
            upper.y -= overlapY + 0.005
            upper.moved = true
          }
          changed = true
        }
      }
      if (!changed) break
    }

    for (const body of bodies) {
      if (!body.moved) continue
      body.object.body.setTranslation({ x: body.x, y: body.y, z: 0 }, true)
      const velocity = body.object.body.linvel()
      if (velocity.y > 0) body.object.body.setLinvel({ x: velocity.x, y: 0, z: 0 }, true)
    }
  }

  function movePointer(event) {
    const bounds = panel.getBoundingClientRect()
    pointerTarget.x = Math.max(0, Math.min(width * UNITS_PER_PIXEL, (event.clientX - bounds.left) * UNITS_PER_PIXEL))
    pointerTarget.y = Math.max(0, Math.min(height * UNITS_PER_PIXEL, (event.clientY - bounds.top) * UNITS_PER_PIXEL))
    if (!pointerActive) {
      pointerPosition.x = pointerTarget.x
      pointerPosition.y = pointerTarget.y
      pointerBody.setTranslation({ x: pointerPosition.x, y: pointerPosition.y, z: 0 }, true)
      pointerActive = true
    }
    if (!frameId) frameId = requestAnimationFrame(animate)
  }

  function leavePointer() {
    pointerActive = false
    pointerBody.setTranslation({ x: 0, y: 0, z: 10 }, true)
  }

  function animate(now) {
    if (destroyed) return
    if (document.hidden) {
      lastFrame = now
      frameId = requestAnimationFrame(animate)
      return
    }
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : STEP
    lastFrame = now
    accumulator = Math.min(accumulator + delta, 0.1)
    while (accumulator >= STEP) {
      if (pointerActive) {
        const dx = pointerTarget.x - pointerPosition.x
        const dy = pointerTarget.y - pointerPosition.y
        const distance = Math.hypot(dx, dy)
        const fraction = Math.min(1, 0.35 / Math.max(distance, 0.0001))
        pointerPosition.x += dx * fraction
        pointerPosition.y += dy * fraction
        pointerBody.setNextKinematicTranslation({ x: pointerPosition.x, y: pointerPosition.y, z: 0 })
      }
      world.step()
      separateShapes()
      for (const object of objects) {
        const position = object.body.translation()
        const rotation = object.body.rotation()
        const angle = 2 * Math.atan2(rotation.z, rotation.w)
        const halfHeight = (Math.abs(Math.sin(angle)) * object.width + Math.abs(Math.cos(angle)) * object.height) / 2
        const velocity = object.body.linvel()
        const maxX = 2
        const maxY = 12
        const clampedX = Math.max(-maxX, Math.min(maxX, velocity.x))
        const clampedY = Math.max(-maxY, Math.min(maxY, velocity.y))
        const nearPointer = pointerActive && Math.hypot(position.x - pointerPosition.x, position.y - pointerPosition.y) < Math.max(object.width, object.height) * UNITS_PER_PIXEL + 0.5
        if (!nearPointer && position.y / UNITS_PER_PIXEL + halfHeight >= height - 3) {
          if (Math.abs(clampedX) > 0.01) object.body.setLinvel({ x: clampedX * 0.08, y: clampedY, z: 0 }, true)
        } else if (clampedX !== velocity.x || clampedY !== velocity.y) {
          object.body.setLinvel({ x: clampedX, y: clampedY, z: 0 }, true)
        }
        const spin = object.body.angvel()
        if (Math.abs(spin.z) > 3) object.body.setAngvel({ x: 0, y: 0, z: Math.sign(spin.z) * 3 }, true)
      }
      accumulator -= STEP
    }
    render()
    if (pointerActive || nextShape < sequence.length || now - lastDropAt < 2500 || objects.some(({ body }) => !body.isSleeping())) {
      frameId = requestAnimationFrame(animate)
    } else {
      frameId = 0
    }
  }

  function dropNext() {
    if (destroyed || nextShape >= sequence.length) return
    addShape(sequence[nextShape], nextShape)
    nextShape += 1
    lastDropAt = performance.now()
    if (!frameId) frameId = requestAnimationFrame(animate)
    if (nextShape < sequence.length) timer = window.setTimeout(dropNext, 20 + random() * 50)
  }

  function resize() {
    const newWidth = Math.max(1, panel.clientWidth)
    const newHeight = Math.max(1, panel.clientHeight)
    if (newWidth === width && newHeight === height) return
    const oldWidth = width
    const oldHeight = height
    width = newWidth
    height = newHeight
    rebuildWalls()
    for (const { body } of objects) {
      const position = body.translation()
      body.setTranslation({
        x: Math.max(0.2, Math.min(width * UNITS_PER_PIXEL - 0.2, position.x * width / oldWidth)),
        y: Math.max(-1, Math.min(height * UNITS_PER_PIXEL - 0.2, position.y + (height - oldHeight) * UNITS_PER_PIXEL)),
        z: 0,
      }, true)
      body.wakeUp()
    }
    if (!frameId) frameId = requestAnimationFrame(animate)
  }

  rebuildWalls()
  const observer = new ResizeObserver(resize)
  observer.observe(panel)
  panel.addEventListener('pointerenter', movePointer)
  panel.addEventListener('pointermove', movePointer)
  panel.addEventListener('pointerleave', leavePointer)
  timer = window.setTimeout(dropNext, 220)

  return () => {
    destroyed = true
    clearTimeout(timer)
    cancelAnimationFrame(frameId)
    observer.disconnect()
    panel.removeEventListener('pointerenter', movePointer)
    panel.removeEventListener('pointermove', movePointer)
    panel.removeEventListener('pointerleave', leavePointer)
    stage.replaceChildren()
    for (const shape of shapes) URL.revokeObjectURL(shape.url)
    world.free()
  }
}
