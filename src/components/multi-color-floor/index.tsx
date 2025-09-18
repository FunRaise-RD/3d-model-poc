import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { BufferAttribute, CanvasTexture, ExtrudeGeometry, RepeatWrapping, Shape } from 'three'
import { FLOOR_USAGE_TYPE } from './constants'

interface MultiColorFloorProps {
  floorShapeArgs: [number, number, number]
  floorColorSegments: { light: string; dark: string; type?: string }[]
  isSelected?: boolean
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
  curvedSide?: 'front' | 'back' | 'left' | 'right' | 'none'
  curveAmount?: number
}

export const MultiColorFloor = ({
  floorShapeArgs,
  floorColorSegments,
  isSelected = false,
  onClick,
  onPointerOver,
  onPointerOut,
  curvedSide = 'none',
  curveAmount = 0.3,
}: MultiColorFloorProps) => {
  // 創建自訂幾何體並修正 UV 映射
  const geometry = useMemo(() => {
    const [width, height, depth] = floorShapeArgs

    if (curvedSide === 'none') {
      return null
    }

    const shape = new Shape()
    const halfWidth = width / 2
    const halfDepth = depth / 2

    // 圓弧細分數量（越高越平滑）
    const curveSegments = 20

    // 根據不同的圓弧面繪製形狀
    switch (curvedSide) {
      case 'front':
        shape.moveTo(-halfWidth, -halfDepth)
        shape.lineTo(halfWidth, -halfDepth)
        shape.lineTo(halfWidth, halfDepth)

        // 使用 bezierCurveTo 創建更平滑的圓弧
        shape.bezierCurveTo(
          halfWidth - width * 0.2, // 控制點1 X
          halfDepth + depth * curveAmount, // 控制點1 Z
          -halfWidth + width * 0.2, // 控制點2 X
          halfDepth + depth * curveAmount, // 控制點2 Z
          -halfWidth, // 終點 X
          halfDepth, // 終點 Z
        )
        shape.closePath()
        break

      case 'back':
        shape.moveTo(-halfWidth, halfDepth)
        shape.lineTo(halfWidth, halfDepth)
        shape.lineTo(halfWidth, -halfDepth)

        shape.bezierCurveTo(
          halfWidth - width * 0.2,
          -halfDepth - depth * curveAmount,
          -halfWidth + width * 0.2,
          -halfDepth - depth * curveAmount,
          -halfWidth,
          -halfDepth,
        )
        shape.closePath()
        break

      case 'right':
        shape.moveTo(-halfWidth, -halfDepth)
        shape.lineTo(-halfWidth, halfDepth)
        shape.lineTo(halfWidth, halfDepth)

        shape.bezierCurveTo(
          halfWidth + width * curveAmount,
          halfDepth - depth * 0.2,
          halfWidth + width * curveAmount,
          -halfDepth + depth * 0.2,
          halfWidth,
          -halfDepth,
        )
        shape.lineTo(-halfWidth, -halfDepth)
        break

      case 'left':
        shape.moveTo(halfWidth, -halfDepth)
        shape.lineTo(halfWidth, halfDepth)
        shape.lineTo(-halfWidth, halfDepth)

        shape.bezierCurveTo(
          -halfWidth - width * curveAmount,
          halfDepth - depth * 0.2,
          -halfWidth - width * curveAmount,
          -halfDepth + depth * 0.2,
          -halfWidth,
          -halfDepth,
        )
        shape.lineTo(halfWidth, -halfDepth)
        break
    }

    const extrudeSettings = {
      depth: height,
      bevelEnabled: false,
      steps: 1,
      curveSegments: curveSegments,
    }

    const extrudeGeometry = new ExtrudeGeometry(shape, extrudeSettings)

    // 旋轉幾何體使其正確對齊
    extrudeGeometry.rotateX(-Math.PI / 2)
    extrudeGeometry.center()

    // 取得法線以判斷面的方向
    const positions = extrudeGeometry.attributes.position
    const normals = extrudeGeometry.attributes.normal
    const newUvs = []

    // 遍歷所有頂點，重新計算 UV
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)

      const z = positions.getZ(i)
      const nx = normals.getX(i)
      const ny = normals.getY(i)
      const nz = normals.getZ(i)

      let u = 0
      let v = 0

      // 判斷是哪個面
      if (Math.abs(ny) > 0.9) {
        // 頂面或底面 (Y 方向法線)
        u = (x + halfWidth) / width
        v = (z + halfDepth) / depth
      } else if (Math.abs(nx) > 0.7) {
        // 左右側面 (X 方向法線) - 這裡是關鍵修正
        // 側面應該顯示完整的紋理（三格）
        u = (z + halfDepth) / depth // Z 軸位置映射到 U（0-1）
        v = 0.5 // 垂直居中，只取紋理的中間橫條
      } else if (Math.abs(nz) > 0.7) {
        // 前後側面 (Z 方向法線)
        u = (x + halfWidth) / width // X 軸位置映射到 U（0-1）
        v = 0.5 // 垂直居中
      } else {
        // 圓弧面或斜面
        if (curvedSide === 'front' || curvedSide === 'back') {
          // 前後圓弧：使用 X 作為 U
          u = (x + halfWidth) / width
          v = 0.5
        } else if (curvedSide === 'left' || curvedSide === 'right') {
          // 左右圓弧：使用 Z 作為 U
          u = (z + halfDepth) / depth
          v = 0.5
        }
      }

      // 確保 UV 在 0-1 範圍內
      u = Math.max(0, Math.min(1, u))
      v = Math.max(0, Math.min(1, v))

      newUvs.push(u, v)
    }

    // 更新 UV 屬性
    extrudeGeometry.setAttribute('uv', new BufferAttribute(new Float32Array(newUvs), 2))

    // 計算法線
    extrudeGeometry.computeVertexNormals()

    return extrudeGeometry
  }, [floorShapeArgs, curvedSide, curveAmount])

  // Texture 創建邏輯保持不變
  const { baseTexture, activeTexture, baseTextureFlipped, activeTextureFlipped } = useMemo(() => {
    if (floorColorSegments.length > 0) {
      const createBySegments = (useActive: boolean) => {
        const canvas = document.createElement('canvas')
        canvas.width = floorColorSegments.length * 100
        canvas.height = 100
        const ctx = canvas.getContext('2d')!

        const stripWidth = canvas.width / floorColorSegments.length
        floorColorSegments.forEach((seg, index) => {
          ctx.fillStyle = useActive ? seg.dark : seg.light
          ctx.fillRect(index * stripWidth, 0, stripWidth, canvas.height)

          if (seg.type === FLOOR_USAGE_TYPE.OTHERS) {
            ctx.save()
            ctx.beginPath()
            ctx.rect(index * stripWidth, 0, stripWidth, canvas.height)
            ctx.clip()

            ctx.strokeStyle = '#E2E8F0'
            ctx.lineWidth = 1.5
            const lineSpacing = 12

            for (let i = -canvas.height; i < stripWidth + canvas.height; i += lineSpacing) {
              ctx.beginPath()
              ctx.moveTo(index * stripWidth + stripWidth + i, 0)
              ctx.lineTo(index * stripWidth + i, canvas.height)
              ctx.stroke()
            }
            ctx.restore()
          }
        })

        const texture = new CanvasTexture(canvas)
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        return texture
      }

      const base = createBySegments(false)
      const active = createBySegments(true)

      const baseFlipped = base.clone()
      baseFlipped.repeat.set(-1, 1)
      baseFlipped.offset.set(1, 0)
      baseFlipped.needsUpdate = true

      const activeFlipped = active.clone()
      activeFlipped.repeat.set(-1, 1)
      activeFlipped.offset.set(1, 0)
      activeFlipped.needsUpdate = true

      return {
        baseTexture: base,
        activeTexture: active,
        baseTextureFlipped: baseFlipped,
        activeTextureFlipped: activeFlipped,
      }
    }

    // 中性顏色
    const createNeutral = (useActive: boolean) => {
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = useActive ? '#CBD5E1' : '#E2E8F0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const texture = new CanvasTexture(canvas)
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      return texture
    }

    const base = createNeutral(false)
    const active = createNeutral(true)

    const baseFlipped = base.clone()
    baseFlipped.repeat.set(-1, 1)
    baseFlipped.offset.set(1, 0)
    baseFlipped.needsUpdate = true

    const activeFlipped = active.clone()
    activeFlipped.repeat.set(-1, 1)
    activeFlipped.offset.set(1, 0)
    activeFlipped.needsUpdate = true

    return {
      baseTexture: base,
      activeTexture: active,
      baseTextureFlipped: baseFlipped,
      activeTextureFlipped: activeFlipped,
    }
  }, [floorColorSegments])

  const multiColorTexture = isSelected ? activeTexture : baseTexture
  const multiColorTextureFlipped = isSelected ? activeTextureFlipped : baseTextureFlipped

  return (
    <group>
      <mesh
        onClick={onClick}
        onPointerOut={onPointerOut}
        onPointerOver={onPointerOver}
        castShadow // 投射陰影 - 這個物體會產生陰影
        receiveShadow // 接收陰影 - 這個物體會顯示陰影（其他物體投射過來的陰影）
      >
        {geometry ? (
          <>
            <primitive object={geometry} />
            <meshLambertMaterial map={multiColorTexture} />
          </>
        ) : (
          <>
            <boxGeometry args={floorShapeArgs} />
            <meshLambertMaterial attach="material-0" map={multiColorTextureFlipped} />
            <meshLambertMaterial attach="material-1" map={multiColorTextureFlipped} />
            <meshLambertMaterial attach="material-2" map={multiColorTexture} />
            <meshLambertMaterial attach="material-3" map={multiColorTexture} />
            <meshLambertMaterial attach="material-4" map={multiColorTexture} />
            <meshLambertMaterial attach="material-5" map={multiColorTexture} />
          </>
        )}

        <Edges color={isSelected ? '#16A4C0' : '#99A1AF'} lineWidth={isSelected ? 3 : 1} opacity={1} />
      </mesh>
    </group>
  )
}
