<template>
    <section>
        <h1>不会变更的sku选择器</h1>
        <p>🧐 每次选择都将检查下一个 spec 中所有 sku 的库存情况 来决定其是否可选</p>
        <p>🧐 虽然会检查，但用户仍然可以选择，检查仅仅是为了提供ui方面的状态更新</p>
        <div class="bg-#222222 px-8 py-4 rounded">
            <div v-for="(spec, depth) in specs" :key="spec.id" class="my-8">
                <div class="mb-4 font-bold text-2xl">
                    {{ spec.label }}
                </div>
                <div v-for="tag in skus.filter(e => e.specId === spec.id)"
                    class="inline-block mr-4 text-xl cursor-pointer" @click="handleSelection(depth, skus.indexOf(tag))"
                    :class="[selections.includes(tag.id) ? tag.disabled ? 'color-red' : 'color-blue' : '', tag.disabled === true ? 'color-gray' : '', selections.length < depth ? 'color-gray cursor-not-allowed' : '']">
                    {{ tag.labels.join(', ') }}
                </div>
            </div>
            <div class="h-1" style="border-top: 1px solid gray;"></div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>产品</span>
                <span :class="[product == null ? 'color-gray' : product.disabled ? 'color-red' : 'color-blue']">
                    {{ product?.labels.join(' - ') ?? '等待选择' }}</span>
            </div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>最终价格</span>
                <span :class="[product == null ? 'color-gray' : product.disabled ? 'color-red' : 'color-blue']">
                    {{ product ? `￥${product.price}` : '等待选择' }}</span>
            </div>
        </div>
    </section>
</template>

<script lang='ts' setup>
import { type ISpec, type ISKU, type ITag } from './types'

interface GroupedByNext { next: number; products: ISKU[]; }

const props = defineProps<{ specs: ISpec[], skus: ISKU[] }>()

const selections = reactive<number[]>([])
const isFullySelected = (item: ISKU, selections: number[], specs: ISpec[]) => { return selections.length === item.parentIds.length && selections.length === specs.length && item.parentIds.every((id, index) => selections[index] === id) }
const product = computed(() => { return props.skus.find(sku => isFullySelected(sku, selections, props.specs)); })

const validate = (tag: ISKU) => {
    return tag.stock <= (tag.threshold ?? 0)
}

/**
 * @description 设计思路是，即便库存没了 / 商品下架 / 库存小于阈值 / 任何其他因素导致选项本不可选，也认为可选
 * @description 因为选择是选择，下单是下单，到底能不能买，等用户选完后再判断，否则逻辑耦合严重，不利于维护
 * @description 因此仅需要在 UI 上提示用户 “库存不足” 之类的即可，选就让他选，选完查一下到底能不能买就完了
 * @description 为什么这么做呢？是因为考虑到用户分享商品时能够通过 url 中的 query 参数拿到信息，从而实现一打开页面就立即选中商品，然后就可以购买的功能
 * 
 * @description 1. 若选项只有一层，则根据自身的状态，如 库存 / 阈值 / 地理位置 等等判断是否可选，判断函数可以自定义，就是上面的 @function validate()
 * @description 2. 若两层及以上，每选完一层，对下一层的选项更新可选状态
 * 
 * @param depth 层数
 * @param offset 偏移量
 */
const handleSelection = async (
    depth: number,
    offset: number,
): Promise<void> => {
    const option = props.skus[offset];
    if (depth > selections.length) {
        return console.error("请按顺序选择");
    }

    select(depth, option.id, selections)

    const groupedByNext = groupProductsByNext(getFilteredProducts(props.specs.length))

    await Promise.all(
        groupedByNext.map(async (group: GroupedByNext) => {
            group.products.every((tag) => tag.disabled = validate(tag))
            const option = props.skus.find((sku) => sku.id === group.next)
            if (option) {
                option.disabled = group.products.every((tag) => validate(tag))
            }
        })
    )
}


const select = (depth: number, id: number, selections: number[]): void => {
    if (depth <= selections.length) {
        selections.splice(depth);
    }
    selections.splice(depth, 0, id);
};


const getFilteredProducts = (
    length: number
): ISKU[] => {
    return length === 1
        ? props.skus.filter((tag) => tag.specId === props.specs[0].id)
        : props.skus
            .filter((tag) => tag.specId === null)
            .filter((tag) =>
                tag.parentIds.slice(0, selections.length).every((id, index) => selections[index] === id)
            )
}

const groupProductsByNext = (products: ISKU[]): GroupedByNext[] => {
    const assemble = (groups: GroupedByNext[], item: { next: number, product: ISKU }) => {
        const group = groups.find(g => g.next === item.next)
        if (group) group.products.push(item.product)
        else groups.push({ next: item.next, products: [item.product] })
        return groups;
    }
    return products
        .map(tag => ({ product: tag, next: tag.parentIds[selections.length] ?? tag.id }))
        .reduce((groups, item) => assemble(groups, item), [] as GroupedByNext[])
}

// 初始调用
handleSelection(0, 0);
</script>