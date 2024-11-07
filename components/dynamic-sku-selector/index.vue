<template>
    <section>
        <h1>动态多层 Sku 选择器</h1>
        <p>😎特性：理论上仅需<strong>一张表</strong>即可支持多个商品不同 SKU 的按给定条件互相嵌套与条件筛选</p>
        <p>😥缺陷：在一张表内使用 id 作为关联上下级的关键字段，在后台管理系统中的错误操作可能会导致多个商品的 sku 关系崩溃</p>
        <p>😥缺陷：不能信任 Javascript 的数字计算能力，价格应当通过请求发到后端进行计算</p>
        <div class="bg-#222222 px-8 py-2 rounded">
            <div v-for="spec, index in specs" class="my-8">
                <div class="mb-4 flex justify-between items-center w100%">
                    <span class="text-2xl font-bold">{{ spec.name }}</span>
                    <span>{{ prices[index] ? `￥${prices[index]}` : '等待选择' }}</span>
                </div>
                <div v-for="sku of calculateSku(spec.id)" :key="sku.id" class="inline-block mr-4 cursor-pointer text-xl"
                    :class="[selections.includes(sku.id) ? 'color-blue' : '', selections.length < index ? 'color-gray-500 cursor-not-allowed' : 'hover:color-blue']"
                    @click="() => handleSelect(sku.id, index)">
                    {{ sku.name }}
                </div>
            </div>
            <div class="h-1" style="border-top: 1px solid gray;"></div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>最终价格</span>
                <span class="color-red">￥{{ finalPrice }}</span>
            </div>
        </div>
        <h1>当前选择</h1>
        <p>Sku Ids: {{ selections }}</p>
        <p v-if="selections.length === 0">
            等待选择
        </p>
        <p v-else>
            {{ result }}
        </p>
        <div>
            <button @click="handleSubmit(false)" class="p-4 text-lg rounded-md">提交订单（选项不能含空值）</button>
            <button @click="handleSubmit(true)" class="p-4 text-lg mx-4 rounded-md">提交订单（选项允许含空值）</button>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { skus, SkuType } from './data'

const specs = computed(() => skus.filter(sku => sku.type === SkuType.Spec))
const result = computed(() => selections.map((selection) => skus.find((sku => selection === sku.id))?.name).filter(Boolean).join(' - '))
const prices = computed(() => selections.map(s => skus.find(sku => s === sku.id)?.price))
const finalPrice = computed(() => prices.value.reduce((pre, cur) => {
    pre = pre ?? 0
    cur = cur ?? 0
    return pre += cur
}))

const calculateSku = (specId: number) => {
    return skus.filter(e => e.type == SkuType.SKU).filter(f => f.specId == specId).filter(s => s.parentId.length == 0 || s.parentId.some(a => selections.includes(a)))
}

const selections = reactive<number[]>([2])

const handleSelect = (skuId: number, index: number) => {
    if (selections.length < index) return;
    selections.splice(index)
    selections[index] = skuId
}

const handleSubmit = (nullable: boolean) => {
    if (selections.length === 0) {
        return window.alert('请完成选择！');
    }
    if (nullable || selections.length === skus.filter(sku => sku.type === SkuType.Spec).length) {
        return window.alert(`您选择的宠物为: ${result.value}`);
    }
    return window.alert('请完成选择！');
}
</script>