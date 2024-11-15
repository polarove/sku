<template>
	<el-scrollbar
		v-if="skus && skus.length > 0"
		max-height="85vh"
	>
		<p
			v-for="(spec, index) of skus"
			:key="index"
		>
			{{ spec }}
		</p>
	</el-scrollbar>
	<el-empty v-else />
</template>

<script lang="ts" setup>
import type { ISku } from '~/types/goods'

defineProps<{ skus: ISku[] | null }>()
</script>
