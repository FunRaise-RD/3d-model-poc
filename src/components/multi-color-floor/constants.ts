export const FLOOR_USAGE_TYPE = {
	OFFICE: 'office',
	STORE: 'store',
	HOTEL: 'hotel',
	HOUSE: 'house',
	PARKING: 'parking',
	OTHERS: 'others', // 前端自訂
} as const

export const UNIT_STYLE_PALETTE = {
	[FLOOR_USAGE_TYPE.OFFICE]: { light: '#DFF2FE', dark: '#B8E6FE' }, // light: semantic/data-viz/sky/100, dark: semantic/data-viz/sky/200
	[FLOOR_USAGE_TYPE.STORE]: { light: '#FFE4E6', dark: '#FFCCD3' }, // light: semantic/data-viz/rose/100, dark: semantic/data-viz/rose/200
	[FLOOR_USAGE_TYPE.HOTEL]: { light: '#FFEDD4', dark: '#FFD6A8' }, // light: semantic/data-viz/orange/100, dark: semantic/data-viz/orange/200
	[FLOOR_USAGE_TYPE.PARKING]: { light: '#E2E8F0', dark: '#CAD5E2' }, // light: semantic/data-viz/slate/200, dark: semantic/data-viz/slate/300
	[FLOOR_USAGE_TYPE.HOUSE]: { light: '#FEF3C6', dark: '#FEE685' }, // light: semantic/data-viz/amber/100, dark: semantic/data-viz/amber/200
	[FLOOR_USAGE_TYPE.OTHERS]: { light: '#F8FAFC', dark: '#F1F5F9' }, // light: semantic/data-viz/slate/50, dark: semantic/data-viz/slate/100
}
