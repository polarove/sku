<template>
	<div>
		<div class="h-90vh">
			<transition name="down">
				<section class="text-center mt-24" v-if="visible">
					<p>✨特性：一张表，存储每个商品的Sku，同时支持不同商品的 多层sku嵌套与筛选 和 单sku 列表展示</p>
					<p>😥缺陷：由于一张表内存放了一个商品多个 sku 的上下级关系，因此需要设计更直观的后台管理页面和交互，防止变更数据时出错</p>
				</section>
			</transition>
			<div class="flex justify-between items-start mt-12">
				<transition name="left">
					<dynamic-sku-selector v-if="visible" class="w-50vw px-12" />
				</transition>
				<transition name="right">
					<single-sku-selector v-if="visible" class="w-50vw px-12" />
				</transition>
			</div>
		</div>
		<main class="px-128">
			<div class="bg-#222222 px-8 py-2 rounded text-xl mb-24">
				<content-doc path="/enum" />
			</div>
			<div class="bg-#222222 px-8 py-2 rounded text-xl mb-24">
				<content-doc />
			</div>
			<div class="bg-#222222 px-8 py-2 rounded text-xl">
				<content-doc path="/good"/>
			</div>
		</main>
	</div>
</template>

<script lang="ts" setup>
const visible = ref(false)
setTimeout(() => visible.value = true);
</script>


<style>
body {
	background-color: #303030;
	color: #e7e7e7;
}

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