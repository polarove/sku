<template>
	<div
		v-for="(parent, index) in specs?.filter(spec => spec.parentId == null)"
		:key="index"
		class="mb-4 mt-8"
	>
		<h2>
			<el-tag
				closable
				size="large"
				@close="$emit('remove-label', parent)"
			>
				{{ parent.label }}
			</el-tag>
		</h2>
		<div class="grid grid-cols-8 gap-4">
			<el-tag
				v-for="(child, subIndex) in specs?.filter(spec => spec.parentId === parent.id)"
				:key="subIndex"
				closable
				size="large"
				effect="plain"
				round
				@close="$emit('remove-spec', child)"
			>
				{{ child.label }}
			</el-tag>
			<el-input
				v-if="parent.inputVisible"
				v-model="parent.inputValue"
				class="max-w-32"
				@keyup.enter="handleInputConfirm(parent)"
				@blur="handleInputConfirm(parent)"
			/>
			<el-button
				v-else
				class="button-new-tag"
				@click="parent.inputVisible = true"
			>
				+ new spec
			</el-button>
		</div>
	</div>
	<div class="flex justify-evenly w-100% mt-8">
		<el-button
			class="outline-none bg-transparent hover:cursor-pointer flex items-center justify-center flex-1 rounded-md"
			style="height: 48px;"
			type="primary"
			@click="$emit('add-label')"
		>
			<span class="i-mdi:plus color-white text-3xl" />新增标签
		</el-button>
		<el-button
			class="outline-none bg-transparent hover:cursor-pointer flex items-center justify-center flex-1 rounded-md"
			style="height: 48px;"
			@click="$emit('clear-specs')"
		>
			清空选项
		</el-button>
		<el-button
			class="outline-none bg-transparent hover:cursor-pointer flex items-center justify-center flex-1 rounded-md"
			style="height: 48px;"
			@click="$emit('add-default-specs')"
		>
			添加默认标签与选项
		</el-button>
	</div>
</template>

<script lang='ts' setup>
import type { EditableISpec, ISpec } from '~/types/goods'

defineProps<{ specs: EditableISpec[] | null }>()

const emit = defineEmits<{
	(e: 'remove-spec' | 'remove-label', tag: ISpec): void
	(e: 'add-spec', tag: { label: string, parentId: number }): void
	(e: 'add-label' | 'add-default-specs' | 'clear-specs'): void
}>()
const handleInputConfirm = (parent: EditableISpec) => {
	if (parent.inputValue) {
		emit('add-spec', { label: parent.inputValue, parentId: parent.id })
	}
	delete parent.inputValue
	delete parent.inputVisible
}
</script>
