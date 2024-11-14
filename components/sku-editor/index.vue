<template>
	<div
		v-for="(sku, index) of skus"
		:key="index"
	>
		{{ sku.labels.join(', ') }}{{ skus?.length }}
	</div>
</template>

<script lang='ts' setup>
import type { ISku } from '~/types/goods'

defineProps<{ skus: ISku[] | null }>()

defineEmits<{
	(e: 'addSku' | 'removeSku'): void
}>()
</script>

<style lang='scss' scoped>

</style>
