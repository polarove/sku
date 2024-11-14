<template>
	<div
		v-if="specs && specs.length > 0"
		class="bg-red"
	>
		<div
			v-for="(parent, index) in specs.filter(spec => spec.parentId == null)"
			:key="index"
		>
			<div>{{ parent.label }}</div>
			<div
				v-for="(child, subIndex) in specs.filter(spec => spec.parentId === parent.id)"
				:key="subIndex"
			>
				{{ child.label }}
			</div>
		</div>
	</div>
	<div v-else>
		空
	</div>
</template>

<script lang='ts' setup>
import type { ISku, ISpec } from '~/types/goods'

defineProps<{ specs: ISpec[] | null, skus: ISku[] | null }>()
</script>
