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
						@add-default-specs="addDefaultSpecs"
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

const addLabel = () => {
	console.log('add label')
	const name = '标签名'
	let currentId = specs.value && specs.value.length > 0 ? Math.max(...specs.value?.map(spec => spec.id) ?? [0]) + 1 : 0
	const handlePush = (value: string) => {
		specs.value?.push({
			id: currentId++,
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
	let currentId = specs.value && specs.value.length > 0 ? Math.max(...specs.value?.map(spec => spec.id) ?? [0]) + 1 : 0

	handlePush({
		id: currentId++,
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

const bfs = (products: ISpec[][] | undefined): ISpec[][] => {
	if (!products) return []
	let queue: ISpec[][] = [[]]

	for (const productOptions of products) {
		const newQueue: ISpec[][] = []
		while (queue.length > 0) {
			const currentCombination = queue.shift()

			for (const option of productOptions) {
				const newCombination = [...currentCombination ?? [], option]
				newQueue.push(newCombination)
			}
		}

		queue = newQueue
	}

	return queue
}

/**
 * @description 将商品按next分组，方便后续更新可选状态
 */
const groupByParentId = (items: ISpec[] | null): ISpec[][] => {
	if (!items) return []
	const groupedItems = items.reduce((acc, item) => {
		const parentId = item.parentId || 0 // 使用 0 作为默认分组
		if (!acc[parentId]) {
			acc[parentId] = []
		}
		acc[parentId].push(item)
		return acc
	}, {} as { [key: number]: ISpec[] })

	return Object.values(groupedItems)
}

const processSkuCombination = () => {
	const groupedItems = groupByParentId(specs.value?.filter(spec => spec.parentId != null) ?? [])
	skus.value = bfs(groupedItems).map((skuGroup, index) => ({ id: index, labels: skuGroup.map(sku => sku.label), specIds: skuGroup.map(sku => sku.id) } as ISku))
}

const handleTabChange = (tab: TabPaneName) => {
	switch (tab) {
		case '1': processSkuCombination()
			break
		default:
			break
	}
}

const addDefaultSpecs = () => {
	const labels: ISpec[] = [
		{ id: 1, label: '品种', sort: 1 },
		{ id: 2, label: '毛色', sort: 2 },
		{ id: 3, label: '年龄', sort: 3 },
		{ id: 4, label: '性别', sort: 4 },
		{ id: 5, label: '是否绝育', sort: 5 }
	]

	const species = ['加菲猫', '布偶猫', '狸花猫', '暹罗猫', '美国短毛猫', '英国短毛猫', '无毛猫']
	const color = ['白', '黑', '深蓝', '深紫', '黑白斑点']
	const age = ['1 月龄', '2 月龄', '3 月龄', '6 月龄', '9 月龄', '12 月龄']
	const gender = ['公', '母']
	const isCastrated = ['已绝育', '未绝育']

	const categories = [
		{ items: species, parentId: 1 },
		{ items: color, parentId: 2 },
		{ items: age, parentId: 3 },
		{ items: gender, parentId: 4 },
		{ items: isCastrated, parentId: 5 }
	]

	let currentId = Math.max(...labels.map(l => l.id)) + 1
	categories.forEach(category => category.items.forEach(item => labels.push({ id: currentId++, label: item, parentId: category.parentId, sort: 1 })))

	specs.value = labels
}
</script>
