<template>
	<transition-group name="fade">
		<section v-if="visible" class="absolute top-50% left-50% transform"
			style="--un-translate-x: -50%; --un-translate-y: -50%">
			<h1>Sku 选择器</h1>
			<p>😎特性：理论上仅需<strong>一张表</strong>即可支持无限层 SKU 互相嵌套与条件筛选</p>
			<p>😥缺陷：维护相对麻烦，在一张表内使用 id 作为关联上下级的关键字段</p>
			<p>🤗如何优化：将标题和 SKU 分别放在两张表里，也就是取舍的问题</p>
			<div class="bg-#222222 px-8 py-4 rounded">
				<div v-for="spec, index in specs" class="my-4">
					<div class="font-bold mb-2 text-2xl">{{ spec.name }}</div>
					<div 
						v-for="sku of calculateSku(spec.id)" 
						:key="sku.id" 
						class="inline-block mx-4 cursor-pointer text-xl"
						:class="[selections.includes(sku.id) ? 'color-blue' : '', selections.length < index ? 'color-gray cursor-not-allowed' : 'hover:color-blue']"
						@click="() => handleSelect(sku.id, index)">
							{{ sku.name }}
					</div>
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
				<button @click="handleSubmit(false)" class="p-4 text-lg">提交订单（选项不能含空值）</button>
				<button @click="handleSubmit(true)" class="p-4 text-lg mx-4">提交订单（选项允许含空值）</button>
			</div>
		</section>
	</transition-group>
	<div></div>
</template>

<script lang="ts" setup>
import { skus } from './data'
import { SkuType } from './enums';

const visible = ref(false)

setTimeout(() => visible.value = true);


const specs = computed(() => skus.filter(sku => sku.type === SkuType.Spec))
const result = computed(() => selections.map((selection) => skus.find((sku => selection === sku.id))?.name).filter(Boolean).join(' - '))

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


<style>
body {
	background-color: #303030;
	color: #e7e7e7;
}
.fade-enter-active,
.fade-leave-active {
	transition:
		transform 456ms,
		opacity 456ms;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translate3D(-50%, 50%, 0);
}
</style>