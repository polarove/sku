export interface ISpec {
	id: number
	label: string
}

export interface ITag {
	id: number
	specId: number | null
	labels: string[]
	parentIds: number[]
	price: number
	originalPrice: number
	stock: number
	threshold: number
	sales: number
	weight: number
}

export interface ISKU extends ITag {
	disabled?: boolean | undefined
}
