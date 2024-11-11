```typescript

import type { ISKU } from "./types"

export const specs = [
    {
        id: 1,
        label: '品种',
    }
]

export const tags: ISKU[] = [
    {
        id: 1,
        specId: 1,
        labels: ["加菲猫"],
        parentIds: [1],
        price: 2001,
        originalPrice: 220,
        stock: 5,
        threshold: 5,
        sales: 20,
        weight: 10.00,
    },
    {
        id: 2,
        specId: 1,
        labels: ["狸花猫"],
        parentIds: [2],
        price: 2002,
        originalPrice: 220,
        stock: 10,
        threshold: 5,
        sales: 20,
        weight: 10.00,
    },
    {
        id: 3,
        specId: 1,
        labels: ["美国短毛猫"],
        parentIds: [3],
        price: 2003,
        originalPrice: 220,
        stock: 0,
        threshold: 5,
        sales: 20,
        weight: 10.00,
    },
]
```