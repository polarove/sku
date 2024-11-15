<template>
	<el-scrollbar
		v-if="specs && specs.length > 0"
		max-height="75vh"
	>
		<p
			v-for="(spec, index) of specs"
			:key="index"
		>
			{{ spec }}
		</p>
	</el-scrollbar>
	<el-empty v-else />
</template>

<script lang="ts" setup>
import type { ISpec } from '~/types/goods'

defineProps<{ specs: ISpec[] | null }>()
</script>
