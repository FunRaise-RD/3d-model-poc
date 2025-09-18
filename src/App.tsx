import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { DraggableRotating } from './components/draggable-rotating/index.tsx'
import { UNIT_STYLE_PALETTE } from './components/multi-color-floor/constants.ts'
import { MultiColorFloor } from './components/multi-color-floor/index.tsx'
import { Lights } from './lights'
import { SpotLightWithTexture } from './spot-light-with-texture'

export const ShadowGround = () => (
	<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
		<planeGeometry args={[20, 20]} />
		<meshLambertMaterial color="#fff" transparent opacity={0.8} />
	</mesh>
)

// const adText = `文字：國泰置地廣場（英語：Cathay Landmark）是臺灣臺北市的一幢摩天大樓，位於臺北市信義區忠孝東路五段68號。由國泰人壽投資興建，大元聯合建築師事務所設計，國泰建設與日商華大成營造合作營造工程[2]，三大聯合建築師事務所監造。樓高212公尺，共地上46層（最高樓為47樓，但沒有44樓，參見四的禁忌）、地下6層，2013年7月17日舉行上梁典禮，2015年落成。目前為台北市第六高的建築物，也是台灣第九高的建築物[3]。該建築物本身和臺北捷運板南線市政府站共構。`; // TODO: re-enable if used

const BoxWithAxes = () => (
	<group>
		<axesHelper args={[3]} />
		{/* 紅線 = X軸 (右) */}
		{/* 綠線 = Y軸 (上) */}
		{/* 藍線 = Z軸 (前) */}
	</group>
)

function App() {
	const floorShapeArgs: [number, number, number] = [3, 1, 3]
	const floorColorSegments = [
		{
			...UNIT_STYLE_PALETTE.parking,
			type: 'parking',
		},
		{
			...UNIT_STYLE_PALETTE.house,
			type: 'house',
		},
		{
			...UNIT_STYLE_PALETTE.others,
			type: 'others',
		},
	]

	return (
		<div>
			<div style={{ width: '100vw', height: '100vh' }}>
				<Canvas shadows camera={{ position: [10, 5, 10], fov: 50 }}>
					{/* 光源 */}
					<Lights />

					{/* 陰影接收地面 */}
					<ShadowGround />

					{/* 拖拽控制 */}
					<OrbitControls
						enablePan={true}
						enableZoom={true}
						enableRotate={false}
					/>

					{/* 坐標軸輔助線 */}
					<BoxWithAxes />

					<group position={[0, 0.5, 0]}>
						{/* 自動旋轉的多色地板組件 */}
						<DraggableRotating autoRotate={false}>
							<SpotLightWithTexture />
							<MultiColorFloor
								floorShapeArgs={floorShapeArgs}
								floorColorSegments={floorColorSegments}
								curvedSide={'front'}
								curveAmount={0.5}
							/>
						</DraggableRotating>
					</group>
				</Canvas>
			</div>
		</div>
	)
}

export default App
