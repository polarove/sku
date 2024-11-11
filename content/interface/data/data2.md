```typescript
import type { ISKU } from './types'

export const specs2 = [
	{
		id: 1,
		label: '品种'
	},
	{
		id: 2,
		label: '毛色'
	}
]

export const tags2: ISKU[] = [
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
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 3,
		specId: 2,
		labels: ['黑色'],
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
		labels: ['白色'],
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
		specId: null,
		labels: ['加菲猫', '黑色'],
		parentIds: [1, 3],
		price: 2001,
		originalPrice: 220,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 6,
		specId: null,
		labels: ['加菲猫', '白色'],
		parentIds: [1, 4],
		price: 2002,
		originalPrice: 220,
		stock: 10,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 7,
		specId: null,
		labels: ['狸花猫', '黑色'],
		parentIds: [2, 3],
		price: 2003,
		originalPrice: 220,
		stock: 20,
		threshold: 5,
		sales: 20,
		weight: 10.00
	},
	{
		id: 8,
		specId: null,
		labels: ['狸花猫', '白色'],
		parentIds: [2, 4],
		price: 2004,
		originalPrice: 220,
		stock: 0,
		threshold: 5,
		sales: 20,
		weight: 10.00
	}
]
```