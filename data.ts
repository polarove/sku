import { SkuType } from "./enums"

interface ISku {
    id: number,
    name: string,
    parentId: number[],
    specId: number | null,
    type: SkuType
}

export const skus: ISku[] = [
    {
        id: 1,
        name: '品种',
        parentId: [],
        specId: null,
        type: SkuType.Spec
    },
    {
        id: 2,
        name: '狸花',
        parentId: [],
        specId: 1,
        type: SkuType.SKU
    },
    {
        id: 3,
        name: '加菲',
        parentId: [],
        specId: 1,
        type: SkuType.SKU
    },
    {
        id: 4,
        name: '布偶',
        parentId: [],
        specId: 1,
        type: SkuType.SKU
    },
    {
        id: 5,
        name: '美短',
        parentId: [],
        specId: 1,
        type: SkuType.SKU
    },
    /// 体色
    {
        id: 6,
        name: '颜色',
        parentId: [],
        specId: null,
        type: SkuType.Spec
    },
    {
        id: 7,
        name: '灰色',
        parentId: [2, 3],
        specId: 6,
        type: SkuType.SKU
    },
    {
        id: 8,
        name: '白色',
        parentId: [2, 4],
        specId: 6,
        type: SkuType.SKU
    },
    {
        id: 9,
        name: '黑色',
        parentId: [3, 4],
        specId: 6,
        type: SkuType.SKU
    },
    {
        id: 10,
        name: '橘黄色',
        parentId: [2, 5],
        specId: 6,
        type: SkuType.SKU
    },
    /// 生长年龄
    {
        id: 11,
        name: '年龄',
        parentId: [],
        specId: null,
        type: SkuType.Spec
    },
    {
        id: 12,
        name: '1 月龄',
        parentId: [2, 3],
        specId: 11,
        type: SkuType.SKU
    },
    {
        id: 13,
        name: '3 月龄',
        parentId: [2, 4],
        specId: 11,
        type: SkuType.SKU
    },
    {
        id: 14,
        name: '6 月龄',
        parentId: [3, 4],
        specId: 11,
        type: SkuType.SKU
    },
    {
        id: 15,
        name: '9 月龄',
        parentId: [2, 5],
        specId: 11,
        type: SkuType.SKU
    },
    {
        id: 16,
        name: '1 年',
        parentId: [10],
        specId: 11,
        type: SkuType.SKU
    },
    /// 是否有前任主人
    {
        id: 17,
        name: '是否有前任主人',
        parentId: [],
        specId: null,
        type: SkuType.Spec
    },
    {
        id: 18,
        name: '是',
        parentId: [],
        specId: 17,
        type: SkuType.SKU
    },
    {
        id: 19,
        name: '否',
        parentId: [],
        specId: 17,
        type: SkuType.SKU
    }
]