<template>
	<div class="flex justify-between items-start mt-32">
		<transition name="left">
			<dynamic-sku-selector v-if="visible" class="w-50vw px-12" />
		</transition>
		<transition name="right">
			<single-sku-selector v-if="visible" class="w-50vw px-12" />
		</transition>
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

.left-enter-active,
.left-leave-active {
	transition:
		transform 456ms,
		opacity 456ms;
}

.left-enter-from,
.left-leave-to {
	opacity: 0;
	transform: translate3D(0, 50%, 0);
}
</style>