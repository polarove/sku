<template>
	<div />
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
