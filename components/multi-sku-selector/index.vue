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
                    :class="[selections.includes(tag.id) ? 'color-blue' : '', selections.length < depth ? 'color-gray cursor-not-allowed' : '']">
                    {{ tag.disabled }}{{ tag.labels.join(', ') }}
                </div>
            </div>
            <div class="h-1" style="border-top: 1px solid gray;"></div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>产品</span>
                <span class="color-red">{{ product?.labels.join(' - ') ?? '等待选择' }}</span>
            </div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>最终价格</span>
                <span class="color-red">{{ product ? `￥${product.price}` : '等待选择' }}</span>
            </div>
        </div>
    </section>
</template>

<script lang='ts' setup>
import { type ISpec, type ISKU, type ITag } from './types'

const props = defineProps<{ specs: ISpec[], skus: ISKU[] }>()

const selections = reactive<number[]>([])
const isFullySelected = (item: ISKU, selections: number[], specs: ISpec[]) => { return selections.length === item.parentIds.length && selections.length === specs.length && item.parentIds.every((id, index) => selections[index] === id) }
const product = computed(() => { return props.skus.find(sku => isFullySelected(sku, selections, props.specs)); })

/**
 * @description 设计思路是，即便库存没了 / 商品下架 / 库存小于阈值 / 任何其他因素导致选项本不可选，也认为可选
 * @description 因为选择是选择，下单是下单，到底能不能买，等用户选完后再判断，否则逻辑耦合严重，不利于维护
 * @description 因此仅需要在 UI 上提示用户 “库存不足” 之类的提示
 * @description 为什么这么做呢？是因为考虑到用户分享商品时能够通过 url 中的 query 参数拿到信息，从而实现“立即购买”的功能
 * 
 * @description 1. 若选项只有一层，则根据自身的状态，如 库存 / 阈值 / 地理位置 等等判断是否可选，判断函数可以自定义
 * @description 2. 若两层及以上，每选完一层，对下一层的选项更新可选状态
 * 
 * @param depth 层数
 * @param offset 偏移量
 */
const handleSelection = (depth: number, offset: number) => {

    const option = props.skus[offset]
    // 更新 selections
    if (depth <= selections.length) {
        selections.splice(depth);
    }
    selections.splice(depth, 0, option.id);

    const products = props.skus
        .filter(tag => tag.specId === null)
        .filter(tag => tag.parentIds.slice(0, selections.length).every((id, index) => selections[index] === id))

    const groupedByNext: { next: number, products: ISKU[] }[] = [];
    
    products
        .map(tag => ({ product: tag, next: tag.parentIds[selections.length] }))
        .forEach(item => {
            const group = groupedByNext.find(g => g.next === item.next);
            if (group) { group.products.push(item.product); }
            else {
                groupedByNext.push({ next: item.next, products: [item.product] });
            }
        })

    groupedByNext.forEach((g) => {
        const option = props.skus.find(sku => sku.id === g.next)
        if (option) {
            option.disabled = g.products.every(tag => tag.stock <= (tag.threshold ?? 0));
        }
    })

}

// 初始调用
handleSelection(0, 0);

</script>