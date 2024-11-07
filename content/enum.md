# Sku 枚举类

```c#
/// <summary>
///  商品的 Sku 的枚举类，把 sku 分为两种，一种是有价格可购买的，一种是没有价格，用作父级标题用的。
/// </summary>
/// <example>
/// EnumSkuType = Spec 👉  品种
/// EnumSkuType = Sku 👉   狸花   加菲    布偶
/// </example>
public enum EnumSkuType {
    /// 规格标题
    Spec = 0,

    /// 商品SKU，真正的含有价格的规格
    Sku = 1
}
```