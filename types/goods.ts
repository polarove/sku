export interface IGoods {
	categoryId: number
	title: string
	thumbnail: string
	views: number
	status: EnumShopGoodsStatus
	sort: number
}

export interface ISpec {
	id: number
	label: string
	parentId?: number
	sort: number
}

export interface EditableISpec extends ISpec {
	parentId: number
	inputValue?: string
	inputVisible?: boolean
}

export enum EnumShopGoodsStatus {
	/**
	 * 上架
	 */
	Up = 1,

	/**
	 * 隐藏
	 */
	Hidden = 2,

	/**
	 * 下架
	 */
	Down = 3
}

export interface ISku {
	id: number
	labels: string[]
	specIds: number[]
	carousels: string[]
	title: string
	stock: number
	threshold: number
	favorites: number
	shares: number
	sales: number
	generalPrice?: number
	price: number
	weight: number
	content?: string
	status: EnumShopGoodsStatus
	isShowSales: boolean
}

export interface IPage<T> {
	total: number
	pageNo: number
	pageSize: number
	data: T
}
