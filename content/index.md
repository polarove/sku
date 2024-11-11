# Sku 表结构

```c#
 /// <summary>
 /// 商品sku
 /// </summary>
 /// spec ->  品种
 /// sku  ->  加菲猫 狸花猫 美国短毛猫
 public class ShopGoodsSku : BaseShopGoods
 {

     /// <summary>
     /// 规格 id
     /// </summary>
     public int SpecId { get; set; }

     /// <summary>
     /// 属性中文
     /// </summary>
     [DbJson]
     [Newtonsoft.Json.JsonConverter(typeof(JsonDbValue.NewtonsoftJsonDbValueConverter))]
     public string[ ]? Labels { get; set; }

     /// <summary>
     /// 与本 sku 相关的sku id
     /// 不能为空，不能为空数组，默认值应当为 [自己的id]
     /// </summary>
     [DbJson]
     [Newtonsoft.Json.JsonConverter(typeof(JsonDbValue.NewtonsoftJsonDbValueConverter))]
     public long[ ] ParentIds { get; set; } = null!;

     /// <summary>
     /// 缩略图
     /// </summary>
     public string? Image { get; set; }
     /// <summary>
     /// 库存
     /// </summary>
     public int Stock { get; set; }
     /// <summary>
     /// 库存预警的阈值
     /// </summary>
     public int? Threshold { get; set; }
     /// <summary>
     /// 销量
     /// </summary>
     public int Sales { get; set; }
     /// <summary>
     /// 是否隐藏销量
     /// </summary>
     public bool IsHideSales { get; set; }
     /// <summary>
     /// 原价
     /// </summary>
     public decimal? OriginalPrice { get; set; }
     /// <summary>
     /// 价格
     /// </summary>
     public decimal Price { get; set; }
     /// <summary>
     /// 重量
     /// </summary>
     public decimal Weight { get; set; }
     /// <summary>
     /// 图文详情
     /// </summary>
     public string? Content { get; set; }
     /// <summary>
     /// 状态
     /// </summary>
     public EnumShopGoodsStatus Status { get; set; }


     [DbNavigate(DbNavigateType.ManyToOne, nameof(GoodsId))]
     public ShopGoods? Goods { get; set; }

     [DbNavigate(DbNavigateType.ManyToOne, nameof(SpecId))]
     public ShopGoodsSpec? Sepcs { get; set; }

 }
```