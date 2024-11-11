# Spec 表结构

```c#
 /// <summary>
 /// 商品规格
 /// </summary>
 /// spec ->  品种
 /// sku  ->  加菲猫 狸花猫 美国短毛猫
 public class ShopGoodsSpec : BaseShopGoods, ISort
 {
     /// <summary>
     /// 标签
     /// </summary>
     public string Label { get; set; } = null!;
     /// <summary>
     /// 排序
     /// </summary>
     public int Sort { get; set; }

     [DbNavigate(DbNavigateType.ManyToOne, nameof(GoodsId))]
     public ShopGoods? Goods { get; set; }

 }
```