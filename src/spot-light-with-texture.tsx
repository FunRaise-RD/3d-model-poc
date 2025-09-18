import { useTexture } from '@react-three/drei'
export const SpotLightWithTexture = () => {
	const texture = useTexture('/cathay_landmark.png')

	return (
		<>
			{/* 彩色投射效果 - 使用半透明平面 */}
			<mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[3.32 * 0.8, 2.33 * 0.8]} />
				<meshStandardMaterial
					map={texture}
					transparent
					opacity={0.7}
					blending={1} // MultiplyBlending 混合模式
				/>
			</mesh>
		</>
	)
}
