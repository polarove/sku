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
			>
				<el-tab-pane
					label="编辑选项"
				>
					<spec-editor
						:specs="(specs as EditableISpec[])"
						@add-label="handleAddLabel"
						@add-spec="(tag: Pick<ISpec, 'label' | 'parentId'>) => addSpec(tag)"
						@remove-label="(label) => removeLabel(label)"
						@remove-spec="(spec: ISpec) => removeSpec(spec)"
						@add-default-specs="handleAddDefaultSpecs"
						@clear-specs="clearSpecs"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="编辑sku"
				>
					<sku-editor
						:skus="skus"
						@review-sku="(sku: ISku) => reviewSku(sku)"
						@remove-sku="(sku: ISku) => removeSku(sku)"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="查看选项"
				>
					<h1>选项</h1>
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
				</el-tab-pane>
				<el-tab-pane
					label="查看 Skus"
				>
					<h1>Skus</h1>
					<el-scrollbar
						v-if="skus && skus.length > 0"
						max-height="85vh"
					>
						<p
							v-for="(sku, index) of skus"
							:key="index"
						>
							{{ sku }}
						</p>
					</el-scrollbar>
					<el-empty v-else />
				</el-tab-pane>
			</el-tabs>
		</section>
		<el-dialog v-model="skuReviewState.visible">
			<template #header>
				{{ skuReviewState.data?.title }}
			</template>
			<div>{{ skuReviewState.data }}</div>
		</el-dialog>
	</div>
</template>

<script lang='ts' setup>
import { type ISku, type ISpec, type EditableISpec, EnumShopGoodsStatus } from '~/types/goods'

const skuReviewState = reactive<{ data: ISku | null, visible: boolean }>({
	data: null,
	visible: false
})

const { data: specs } = await useFetch<ISpec[] | null>('/api/specs/0-0')
const { data: skus } = await useFetch<ISku[] | null>('/api/skus/0-0')

const addSpec = (tag: Pick<ISpec, 'label' | 'parentId'>) => {
	let currentId = specs.value && specs.value.length > 0 ? Math.max(...specs.value?.map(spec => spec.id) ?? [0]) + 1 : 0
	specs.value?.push({
		id: currentId++,
		label: tag.label,
		parentId: tag.parentId,
		sort: 1
	})
	return tag.label
}

const handleAddLabel = () => {
	console.log('add label')
	const name = '标签名'
	const buildPrompt = (name: string) => {
		return {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			inputPattern: /^.+$/,
			inputErrorMessage: `${name}不能为空`
		}
	}

	ElMessageBox
		.prompt(`输入${name}`, '提示', buildPrompt(name))
		.then(({ value }) => addSpec({ label: value, parentId: undefined }))
		.then(label => ElMessage({ type: 'success', message: `添加了一个标签: ${label}` }))
		.catch(() => ElMessage({ type: 'warning', message: '取消' }))
}

const removeLabel = (label: ISpec) => {
	console.log('remove label')
	specs.value = specs.value?.filter(spec => spec !== label && spec.parentId !== label.id) as (ISpec[] | null)
}

const removeSpec = (spec: ISpec) => {
	console.log('remove spec')
	specs.value?.splice(specs.value.indexOf(spec), 1)
	const label = specs.value?.find(label => label.id === spec.parentId)
	if (label) {
		const hasOption = specs.value?.some(option => option.parentId === label.id)
		if (!hasOption) specs.value?.splice(specs.value.indexOf(label), 1)
	}
	skus.value?.filter(sku => sku.specIds.includes(spec.id)).forEach(sku => removeSku(sku))
}

const reviewSku = (sku: ISku) => {
	console.log('add sku')
	skuReviewState.visible = true
	skuReviewState.data = sku
}
const removeSku = (sku: ISku) => {
	console.log('remove sku')
	skus.value?.splice(skus.value.indexOf(sku), 1)
}

/**
 * @description 获取所有组合
 * @param products 商品规格
 */
const bfs = (products: ISpec[][] | null): ISpec[][] => {
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
 * @description 将商品按 ParentId 分组，方便后续更新可选状态
 */
const groupByParentId = (items: ISpec[] | null): ISpec[][] | null => {
	if (!items) return []
	const groupedItems = items.reduce((acc, item) => {
		const parentId = item.parentId || 0 // 使用 0 作为默认分组
		if (!acc[parentId]) {
			acc[parentId] = []
		}
		acc[parentId].push(item)
		return acc
	}, {} as { [key: number]: ISpec[] })

	return Object.keys(groupedItems).length <= 0 ? null : Object.values(groupedItems)
}

const generateSkus = async () => {
	console.log('生成sku')

	const groupedItems = groupByParentId(specs.value?.filter(spec => spec.parentId != null) ?? [])
	function getRandomEnumValueByKey<T extends object>(enumObj: T): T[keyof T] {
		const enumKeys = Object.keys(enumObj).filter(key => isNaN(Number(key)))
		const randomKey = enumKeys[Math.floor(Math.random() * enumKeys.length)] as keyof T
		return enumObj[randomKey]
	}
	const assemble = (specGroup: ISpec[], index: number) => {
		return {
			id: index,
			labels: specGroup.map(sku => sku.label),
			specIds: specGroup.map(sku => sku.id),
			generalPrice: 1000 * Math.random(),
			price: 1000 * Math.random() / 2,
			favorites: 1000 * Math.random(),
			sales: 1000 * Math.random(),
			shares: 1000 * Math.random(),
			isShowSales: index * Math.random() * 10 % 2 == 1,
			weight: 100 * Math.random(),
			status: getRandomEnumValueByKey(EnumShopGoodsStatus),
			stock: 1000 * Math.random(),
			threshold: 1000 * Math.random(),
			title: '测试标题',
			carousels: []
		} as ISku
	}
	skus.value = bfs(groupedItems).map((specGroup, index) => assemble(specGroup, index))
}

const addDefaultSpecs = (): Promise<ISpec[]> => {
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

	return Promise.resolve(labels)
}

const handleAddDefaultSpecs = () => {
	addDefaultSpecs().then(labels => specs.value = labels)
}

watch(() => specs.value, () => generateSkus(), { deep: true })

const clearSpecs = () => {
	if (specs.value && specs.value.length > 0) {
		specs.value = []
	}
}
</script>
