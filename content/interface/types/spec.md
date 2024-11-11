# Spec 类型

```typescript
/**
 * @description 商品规格
 * spec ->  品种
 * sku  ->  加菲猫 狸花猫 美国短毛猫
 */
export interface ISpec extends IShopGoods {
    label: string
    sort: number
}
```