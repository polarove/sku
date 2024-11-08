# Sku 表结构

```c#
/// <summary>
///  商品Sku表，存放了每个商品的 Sku 信息，多层级 SKU 信息，比如：颜色、尺码等 和单层级 SKU 信息
/// </summary>
public class ShopGoodSku : BaseShopGoods 
{
    /// <summary>
    /// 规格标题 id，其实就是当前商品下 EnumSkuType 为 Spec 的 sku 的 id
    /// </summary>
    public int SpecId { get; set; }

    /// <summary>
    /// 商品主图
    /// </summary>
    public string Image { get; set; } = !null;

    /// <summary>
    /// 标签
    /// </summary>
    public string[] Labels { get; set; }

    /// <summary>
    /// 与本 sku 相关的sku id
    /// 不能为空，不能为空数组，默认值为[自己的id]
    /// </summary>
    [DbJson]
    [Newtonsoft.Json.JsonConverter(typeof(JsonDbValue.NewtonsoftJsonDbValueConverter))]
    public long[] ParentIds { get; set; }
    
    /// <summary>
    /// 售价
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// 面价
    /// </summary>
    public decimal OriginalPrice { get; set; }

    /// <summary>
    /// 库存
    /// </summary>
    public int Stock { get; set; }

    /// <summary>
    /// 库存阈值 库存告警值 小于该值就要做点什么
    /// </summary>
    public int Threshold { get; set; }

    /// <summary>
    /// 销量
    /// </summary>
    public int Sales { get; set; }

    /// <summary>
    /// 销量是否对用户可见
    /// </summary>
    public bool IsSalesVisible { get; set; }

    /// <summary>
    /// 重量
    /// </summary>
    public decimal Weight { get; set; }

}
```