<template>
	<el-card>
		<template #header>
			<div
				class="i-mdi:content-copy cursor-pointer text-2xl hover:color-[--el-color-primary]"
				@click="handleCopy"
			/>
		</template>
		<el-scrollbar max-height="85vh">
			<content-doc :path="path">
				<template #not-found>
					<el-empty />
				</template>
			</content-doc>
		</el-scrollbar>
	</el-card>
</template>

<script setup lang="ts">
defineProps<{ path: string }>()
const handleCopy = async () => {
	// navigator.clipboard.writeText(JSON.stringify(data.value?.body?.children[0].props?.code) ?? '')
	ElMessage.warning('尚未实现')
}
</script>
