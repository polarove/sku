# Sku 类型

```typescript
/**
 * @description 商品 sku
 * spec ->  品种
 * sku  ->  加菲猫 狸花猫 美国短毛猫
 */
export interface IShopSku extends IShopGoods {
    id: number
    specId: number
    labels?: string[]
    /**
     * @description 父级id，指向当前数组中其他sku的id，不能为空，不能为空数组，默认值为
     * @default [自己的id]
     */
    parentIds: number[]
    image?: string
    stock: number
    // 库存预警
    threshold: number
    sales: number
    isShowSales: boolean
    originalPrice: number
    price: number
    weight: number
    // 图文详情
    content: string
    /**
     * @description 商品状态
     * 1.上架 2.隐藏 3.下架
     */
    status: EnumShopGoodsStatus
}
```