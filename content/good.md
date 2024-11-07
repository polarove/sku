# 商品类
```c#
namespace Tukun.GT.Archive.Model.Tables.Shop
{
    /// <summary>
    /// 商品
    /// </summary>
    public partial class ShopGoods : BaseShopStore, IDataTokenEntity
    {
        /// <summary>
        /// 分类id
        /// </summary>
        public long CategoryId { get; set; }

        /// <summary>
        /// 所属分类
        /// </summary>
        public string CategoryIds { get; set; } = null!;

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; } = null!;
        
        /// <summary>
        /// 标题
        /// </summary>
        public string? Title { get; set; }

        /// <summary>
        /// 商品主图
        /// </summary>
        public string? Image { get; set; }

        /// <summary>
        /// 轮播图
        /// </summary>
        [DbJson]
        [Newtonsoft.Json.JsonConverter(typeof(JsonDbValue.NewtonsoftJsonDbValueConverter))]
        public string[]? Images { get; set; }
        
        /// <summary>
        /// 参数详情
        /// </summary>
        public JsonDbValue? Params { get; set; }

        /// <summary>
        /// 图文详情
        /// </summary>
        public string? Content { get; set; }

        /// <summary>
        /// 原价，此处为用于展示的价格，并非用户实际支付的价格
        /// </summary>
        public decimal? OriginalPrice { get; set; }

        /// <summary>
        /// 售价，此处为用于展示的价格，并非用户实际支付的价格
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// 是否多规格
        /// </summary>
        public bool IsSku { get; set; }

        /// <summary>
        /// 收藏人数
        /// </summary>
        public int Favorites { get; set; }
        /// <summary>
        /// 浏览人数
        /// </summary>
        public int Views { get; set; }
        /// <summary>
        /// 销量
        /// </summary>
        public int Sales { get; set; }
        /// <summary>
        /// 显示销量
        /// </summary>
        public bool IsShowSales { get; set; }
        /// <summary>
        /// 商品状态
        /// </summary>
        public EnumShopGoodStatus Status { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }


        public string DataToken { get; set; } = null!;

        [DbNavigate(DbNavigateType.ManyToOne, nameof(CategoryId))]
        public ShopCategory? Category { get; set; }
       
    }
}
```