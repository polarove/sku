import type { ISKU } from './types'

export const specs3 = [
	{
		id: 1,
		label: '品种'
	},
	{
		id: 2,
		label: '毛色'
	},
	{
		id: 3,
		label: '年龄'
	}
]

export const tags3: ISKU[] = [
	{
		id: 1,
		specId: 1,
		labels: ['加菲猫'],
		parentIds: [1],
		price: 200,
		originalPrice: 220,
		stock: 100,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 2,
		specId: 1,
		labels: ['狸花猫'],
		parentIds: [2],
		price: 200,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 3,
		specId: 1,
		labels: ['美国短毛猫'],
		parentIds: [3],
		price: 200,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 4,
		specId: 2,
		labels: ['黑色'],
		parentIds: [4],
		price: 200,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 5,
		specId: 2,
		labels: ['白色'],
		parentIds: [5],
		price: 200,
		originalPrice: 220,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 6,
		specId: 3,
		labels: ['1 月龄'],
		parentIds: [6],
		price: 200,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 7,
		specId: 3,
		labels: ['3 月龄'],
		parentIds: [7],
		price: 200,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	/// 笛卡尔积
	{
		id: 8,
		specId: null,
		labels: ['加菲猫', '黑色', '1 月龄'],
		parentIds: [1, 4, 6],
		price: 2001,
		originalPrice: 2201,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 9,
		specId: null,
		labels: ['加菲猫', '黑色', '3 月龄'],
		parentIds: [1, 4, 7],
		price: 2002,
		originalPrice: 2202,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 8,
		specId: null,
		labels: ['加菲猫', '白色', '1 月龄'],
		parentIds: [1, 5, 6],
		price: 2003,
		originalPrice: 2203,
		stock: 40,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 9,
		specId: null,
		labels: ['加菲猫', '白色', '3 月龄'],
		parentIds: [1, 5, 7],
		price: 2004,
		originalPrice: 2204,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	/// 笛卡尔积
	{
		id: 10,
		specId: null,
		labels: ['狸花猫', '黑色', '1 月龄'],
		parentIds: [2, 4, 6],
		price: 2005,
		originalPrice: 2205,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 11,
		specId: null,
		labels: ['狸花猫', '黑色', '3 月龄'],
		parentIds: [2, 4, 7],
		price: 2006,
		originalPrice: 2206,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 12,
		specId: null,
		labels: ['狸花猫', '白色', '1 月龄'],
		parentIds: [2, 5, 6],
		price: 2007,
		originalPrice: 2207,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 13,
		specId: null,
		labels: ['狸花猫', '白色', '3 月龄'],
		parentIds: [2, 5, 7],
		price: 2008,
		originalPrice: 2208,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	/// 笛卡尔积
	{
		id: 10,
		specId: null,
		labels: ['美国短毛猫', '黑色', '1 月龄'],
		parentIds: [3, 4, 6],
		price: 2009,
		originalPrice: 2209,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 11,
		specId: null,
		labels: ['美国短毛猫', '黑色', '3 月龄'],
		parentIds: [3, 4, 7],
		price: 2010,
		originalPrice: 2200,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 12,
		specId: null,
		labels: ['美国短毛猫', '白色', '1 月龄'],
		parentIds: [3, 5, 6],
		price: 2011,
		originalPrice: 22001,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 13,
		specId: null,
		labels: ['美国短毛猫', '白色', '3 月龄'],
		parentIds: [3, 5, 7],
		price: 2012,
		originalPrice: 22002,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	}
]
