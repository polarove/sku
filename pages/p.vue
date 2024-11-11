<template>
	<div>
		<div>
			<transition name="down">
				<section v-if="visible" class="text-center mt-24">
					<p>✨支持情况：依赖vue，若小程序如果使用 uniapp 开发，可以完美复现，直接ctrl c+v；若使用原生微信小程序，则需要花费一定时间做适配</p>
					<p>✨特性：一张表，存储每个商品的Sku，同时支持不同商品的 多层sku嵌套与筛选 和 单sku 列表展示</p>
					<br>
					<p>😥缺陷：由于一张表内存放了一个商品多个 sku 的上下级关系，因此需要设计更直观的后台管理页面和交互，防止人为误操作导致的脏数据</p>
				</section>
			</transition>
			<div class="grid grid-cols-3 justify-between items-start mt-12">
				<transition name="left">
					<dynamic-sku-selector v-if="visible" class="w-30vw px-12" />
				</transition>
				<transition name="center">
					<div v-if="visible" class="w-30vw px-12">
						<multi-sku-selector :skus="tags" :specs="specs" />
						<multi-sku-selector :skus="tags2" :specs="specs2" />
						<multi-sku-selector :skus="tags3" :specs="specs3" />
					</div>
				</transition>
				<transition name="right">
					<single-sku-selector v-if="visible" class="w-30vw px-12" />
				</transition>
			</div>
		</div>
		<main class="px-128 mt-64">
			<div class="bg-#222222 px-8 py-2 rounded text-xl mb-24">
				<content-doc path="/class/spec" />
			</div>
			<div class="bg-#222222 px-8 py-2 rounded text-xl mb-24">
				<content-doc path="/class/sku"/>
			</div>
			<div class="bg-#222222 px-8 py-2 rounded text-xl">
				<content-doc path="/class/good" />
			</div>
		</main>
	</div>
</template>

<script lang="ts" setup>
import { tags, specs } from '../components/multi-sku-selector/data';
import { tags2, specs2 } from '../components/multi-sku-selector/data2';
import { tags3, specs3 } from '../components/multi-sku-selector/data3'

const visible = ref(false)
onMounted(() => visible.value = true)

</script>


<style scoped>
.down-enter-active,
.down-leave-active {
	transition:
		transform 456ms,
		opacity 456ms;
}

.down-enter-from,
.down-leave-to {
	opacity: 0;
	transform: translate3D(0, -50%, 0);
}

.left-enter-active,
.left-leave-active {
	transition:
		transform 456ms,
		opacity 456ms;
}

.left-enter-from,
.left-leave-to {
	opacity: 0;
	transform: translate3D(-50%, 0, 0);
}

.center-enter-active,
.center-leave-active {
	transition: opacity 456ms;
}

.center-enter-from,
.center-leave-to {
	opacity: 0;
}


.right-enter-active,
.right-leave-active {
	transition:
		transform 456ms,
		opacity 456ms;
}

.right-enter-from,
.right-leave-to {
	opacity: 0;
	transform: translate3D(50%, 0, 0);
}
</style>