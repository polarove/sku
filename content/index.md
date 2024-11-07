# Sku 表结构

```c#
/// <summary>
///  商品Sku表，存放了每个商品的 Sku 信息，多层级 SKU 信息，比如：颜色、尺码等 和单层级 SKU 信息
/// </summary>
public class ShopGoodSku {

    public int Id { get; set; }

    public int GoodsId { get; set; }

    public string Name { get; set; }

    /// <summary>
    /// 与本 sku 相关的sku id
    /// </summary>
    [DbJson]
    [Newtonsoft.Json.JsonConverter(typeof(JsonDbValue.NewtonsoftJsonDbValueConverter))]
    public long[] ParentIds { get; set; }

    /// <summary>
    /// 规格标题 id，其实就是当前商品下 EnumSkuType 为 Spec 的 sku 的 id
    /// </summary>
    public int? SpecId { get; set; }

    /// <summary>
    /// Sku 类型，分为标题和具体的规格两种，标题不可购买，不可选中，没有价格；具体的规格有价格，可选中，可购买
    /// </summary>
    public EnumSkuType Type { get; set; }
    
    public decimal Price { get; set; }
}
```