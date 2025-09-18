import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type React from 'react'
import { useRef } from 'react'
import type { Group } from 'three'

interface DraggableRotatingProps {
	autoRotate: boolean
	children: React.ReactNode
}

// 可拖拽旋轉的組件
export const DraggableRotating = ({
	autoRotate = true,
	children,
}: DraggableRotatingProps) => {
	const groupRef = useRef<Group>(null)
	const isDragging = useRef<boolean>(false)
	const lastMouseX = useRef<number>(0)

	const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
		isDragging.current = true
		lastMouseX.current = e.clientX
		e.stopPropagation()
	}

	const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
		if (!isDragging.current || !groupRef.current) {
			return
		}

		const deltaX = e.clientX - lastMouseX.current
		groupRef.current.rotation.y += deltaX * 0.02
		lastMouseX.current = e.clientX
	}

	const handlePointerUp = () => {
		isDragging.current = false
	}

	useFrame((_state, delta) => {
		if (!autoRotate) {
			return
		}
		if (groupRef.current && !isDragging.current) {
			groupRef.current.rotation.y += delta * 0.5
		}
	})

	return (
		<group
			ref={groupRef}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
		>
			{children}
		</group>
	)
}
