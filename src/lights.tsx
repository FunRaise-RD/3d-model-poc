export const Lights = () => (
	<group>
		{/* 環境光 - 提供均勻的基礎照明，增強亮度 */}
		<ambientLight intensity={1.2} color="#ffffff" />

		{/* 主要方向光 - 從正上方照射，增強亮度 */}
		<directionalLight
			position={[15, 15, -10]}
			intensity={1.5}
			color="#ffffff"
			castShadow
			shadow-mapSize-width={1024}
			shadow-mapSize-height={1024}
		/>
	</group>
)
