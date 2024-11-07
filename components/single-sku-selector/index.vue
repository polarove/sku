<template>
    <section>
        <h1>单层级 Sku 选择器</h1>
        <p>😎特性：理论上仅需<strong>一张表</strong>即可支持多个商品 单层Sku 的列表展示</p>
        <p>😎特性：数据完全由后端控制</p>
        <p>😥缺陷：将 Sku 的可能的排列全部放在一张表里，单表数据量将会十分庞大</p>
        <div class="bg-#222222 px-8 py-2 rounded">
            <div v-for="item of data" :key="item.id"
                class="b-1 b-solid b-gray-600 p-2 my-4 rounded hover:b-gray cursor-pointer"
                :class="[selection === item.id ? 'b-red' : '']" @click="handleSelection(item.id)">
                <div class="color-red w-8% inline-block">￥{{ item.price }}</div>
                <span>{{ item.title }}</span>
            </div>
            <div class="h-1" style="border-top: 1px solid gray;"></div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>最终价格</span>
                <span class="color-red">￥{{ price }}</span>
            </div>
        </div>
        <div class="my-4">
            <button @click="submit" class="p-4 text-lg rounded-md">提交订单</button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { data } from './data'

const selection = ref()

const price = computed(() => {
    const target = data.find(e => e.id === selection.value)
    return target ? target.price : '等待选择'
})

const handleSelection = (id: number) => {
    selection.value = id
}

const submit = () => {
    if(selection.value === undefined) return
    const target = data.find(e => e.id === selection.value)
    window.alert(`你选择了${target?.title}，需要支付￥${target?.price}`)
}
</script>