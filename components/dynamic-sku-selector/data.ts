export enum SkuType {
    Spec,
    SKU
}

interface ISku {
    id: number
    name: string
    parentId: number[]
    specId: number | null
    type: SkuType
    price: number
}

export const skus: ISku[] = [
    {
        id: 1,
        name: '品种',
        parentId: [],
        specId: null,
        type: SkuType.Spec,
        price: 0
    },
    {
        id: 2,
        name: '狸花',
        parentId: [],
        specId: 1,
        type: SkuType.SKU,
        price: 299.00
    },
    {
        id: 3,
        name: '加菲',
        parentId: [],
        specId: 1,
        type: SkuType.SKU,
        price: 299.00
    },
    {
        id: 4,
        name: '布偶',
        parentId: [],
        specId: 1,
        type: SkuType.SKU,
        price: 299.00
    },
    {
        id: 5,
        name: '美短',
        parentId: [],
        specId: 1,
        type: SkuType.SKU,
        price: 299.00
    },
    /// 体色
    {
        id: 6,
        name: '颜色',
        parentId: [],
        specId: null,
        type: SkuType.Spec,
        price: 0
    },
    {
        id: 7,
        name: '灰色',
        parentId: [2, 3],
        specId: 6,
        type: SkuType.SKU,
        price: 9.90
    },
    {
        id: 8,
        name: '白色',
        parentId: [2, 4],
        specId: 6,
        type: SkuType.SKU,
        price: 399.33
    },
    {
        id: 9,
        name: '黑色',
        parentId: [3, 4],
        specId: 6,
        type: SkuType.SKU,
        price: 99.00
    },
    {
        id: 10,
        name: '橘黄色',
        parentId: [2, 5],
        specId: 6,
        type: SkuType.SKU,
        price: 99.00
    },
    /// 生长年龄
    {
        id: 11,
        name: '年龄',
        parentId: [],
        specId: null,
        type: SkuType.Spec,
        price: 0
    },
    {
        id: 12,
        name: '1 月龄',
        parentId: [2, 3],
        specId: 11,
        type: SkuType.SKU,
        price: 87.55
    },
    {
        id: 13,
        name: '3 月龄',
        parentId: [2, 4],
        specId: 11,
        type: SkuType.SKU,
        price: 66.74
    },
    {
        id: 14,
        name: '6 月龄',
        parentId: [3, 4],
        specId: 11,
        type: SkuType.SKU,
        price: 166.74
    },
    {
        id: 15,
        name: '9 月龄',
        parentId: [2, 5],
        specId: 11,
        type: SkuType.SKU,
        price: 0.00
    },
    {
        id: 16,
        name: '1 年',
        parentId: [10],
        specId: 11,
        type: SkuType.SKU,
        price: -20.00
    },
    /// 是否有前任主人
    {
        id: 17,
        name: '是否有前任主人',
        parentId: [],
        specId: null,
        type: SkuType.Spec,
        price: 0.00
    },
    {
        id: 18,
        name: '是',
        parentId: [],
        specId: 17,
        type: SkuType.SKU,
        price: -10.00
    },
    {
        id: 19,
        name: '否',
        parentId: [],
        specId: 17,
        type: SkuType.SKU,
        price: 10.00
    }
]
