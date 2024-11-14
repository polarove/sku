<template>
	<div class="flex">
		<section class="w-50vw px-12">
			<h1 class="text-center">
				Sku 选择器
			</h1>
			<sku-selector
				:specs="specs"
				:skus="skus"
			/>
		</section>
		<section class="w-50vw px-12">
			<el-tabs
				tab-position="top"
				style="--el-font-size-base: 16px; --el-border-color-light: var(--bg-color)"
				@tab-change="handleTabChange"
			>
				<el-tab-pane
					label="编辑选项"
				>
					<spec-editor
						:specs="(specs as EditableISpec[])"
						@add-label="addLabel"
						@add-spec="(tag: Pick<ISpec, 'label' | 'parentId'>) => addSpec(tag)"
						@remove-label="(label) => removeLabel(label)"
						@remove-spec="(spec: ISpec) => removeSpec(spec)"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="编辑sku"
				>
					<sku-editor
						:skus="skus"
						@remove-sku="removeSku"
						@add-sku="addSku"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="查看数据"
				>
					<section>
						<h2>选项</h2>
						{{ specs }}
					</section>
					<section>
						<h2>Skus</h2>
						{{ skus }}
					</section>
				</el-tab-pane>
			</el-tabs>
		</section>
	</div>
</template>

<script lang='ts' setup>
import type { TabPaneName } from 'element-plus'
import type { ISku, ISpec, EditableISpec } from '~/types/goods'

const { data: specs } = await useFetch<ISpec[]>('/api/specs/0-0')
const { data: skus } = await useFetch<ISku[]>('/api/skus/0-0')

const buildPrompt = (name: string) => {
	return {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		inputPattern: /^.+$/,
		inputErrorMessage: `${name}不能为空`
	}
}

const biggestId = (): number => {
	if (specs.value && specs.value.length > 0) {
		return Math.max(...specs.value.map(spec => spec.id))
	}
	return 0
}

const addLabel = () => {
	console.log('add label')
	const name = '标签名'
	const handlePush = (value: string) => {
		specs.value?.push({
			id: biggestId() + 1,
			label: value,
			sort: 1
		})
		return value
	}
	ElMessageBox
		.prompt(`输入${name}`, '提示', buildPrompt(name))
		.then(({ value }) => handlePush(value))
		.then(label => ElMessage({ type: 'success', message: `添加了一个标签: ${label}` }))
		.catch(() => ElMessage({ type: 'warning', message: '取消' }))
}

const removeLabel = (label: ISpec) => {
	console.log('remove label')
	specs.value = specs.value?.filter(spec => spec !== label && spec.parentId !== label.id) as (ISpec[] | null)
}

const addSpec = (tag: Pick<ISpec, 'label' | 'parentId'>) => {
	console.log('add spec', tag)
	const handlePush = (tag: ISpec) => specs.value?.push(tag)
	handlePush({
		id: biggestId() + 1,
		label: tag.label,
		parentId: tag.parentId,
		sort: 1
	})
}

const removeSpec = (spec: ISpec) => {
	console.log('remove spec')
	specs.value?.splice(specs.value.indexOf(spec), 1)
}

const addSku = () => {
	console.log('add sku')
}
const removeSku = () => {
	console.log('remove sku')
}

// const bfs = (products: ISpec[][] | undefined) => {
// 	if (!products) return
// 	let queue: [][] = [[]] // 初始队列，包含一个空的组合

// 	for (const productOptions of products) {
// 		const newQueue: [][] = []

// 		while (queue.length > 0) {
// 			const currentCombination = queue.shift() // 从队列中取出一个组合

// 			for (const option of productOptions) {
// 				const newCombination = [...currentCombination, option] // 生成新的组合
// 				newQueue.push(newCombination) // 将新组合加入新队列
// 			}
// 		}

// 		queue = newQueue // 更新队列为新队列
// 	}

// 	return queue
// }
// bfs([[]])

const handleTabChange = (tab: TabPaneName) => {
	switch (tab) {
		case '1': console.log('编辑sku')
			break
		default:
			break
	}
}
</script>
