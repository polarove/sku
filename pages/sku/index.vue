<template>
	<div class="flex h-100vh">
		<section class="w-50vw p-20px">
			<el-tabs style="--el-font-size-base: 20px;">
				<el-tab-pane label="sku 选择器">
					<sku-selector
						:specs="specs"
						:skus="skus"
						@on-mistake="(err?: string[]) => handleMistake(err)"
						@on-error="(err?: string) => handleError(err)"
					/>
				</el-tab-pane>
				<el-tab-pane label="代码">
					<sku-code />
				</el-tab-pane>
			</el-tabs>
		</section>
		<el-card
			class="w-50vw"
			shadow="never"
		>
			<el-tabs
				tab-position="top"
				style="--el-font-size-base: 20px; --el-border-color-light: var(--bg-color)"
			>
				<el-tab-pane
					label="编辑选项"
				>
					<spec-editor
						:specs="(specs as EditableISpec[])"
						@add-label="handleAddLabel"
						@add-spec="(tag: Pick<ISpec, 'label' | 'parentId'>) => handleAddSpec(tag)"
						@remove-label="(label: ISpec) => handleRemoveLabel(label)"
						@remove-spec="(spec: ISpec) => handleRemoveSpecs(spec)"
						@add-default-specs="handleAddDefaultSpecs"
						@clear-specs="handleClearSpecs"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="编辑sku"
				>
					<sku-editor
						:skus="skus"
						@review-sku="(sku: ISku) => reviewSku(sku)"
						@remove-sku="(sku: ISku) => removeSku(sku)"
						@clear-sku="clearSku"
						@generate-sku="generateSkus"
					/>
				</el-tab-pane>
				<el-tab-pane
					label="查看选项"
				>
					<h1>选项</h1>
					<spec-inspector :specs="specs" />
				</el-tab-pane>
				<el-tab-pane
					label="查看 Skus"
				>
					<h1>Skus</h1>
					<sku-inspector :skus="skus" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
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

const handleAddSpec = async (tag: Pick<ISpec, 'label' | 'parentId'>) => {
	const calculateId = async () => {
		let id = 0
		if (specs.value && specs.value.length > 0) {
			id = Math.max(...specs.value.map(spec => spec.id)) + 1
		}
		return Promise.resolve(id)
	}
	const assemble = (nextId: number) => Promise.resolve({ id: nextId, ...tag, sort: 1 })
	const addSpec = async (spec: ISpec) => {
		specs.value?.push(spec)
		return Promise.resolve(spec.label)
	}
	return calculateId().then(assemble).then(addSpec).then(label => label)
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
		.then(({ value }) => handleAddSpec({ label: value, parentId: undefined }))
		.then(label => ElMessage({ type: 'success', message: `添加了一个标签: ${label}` }))
		.catch(() => ElMessage({ type: 'warning', message: '取消' }))
}

const handleRemoveLabel = (label: ISpec) => {
	const removeLabel = async (target: ISpec) => {
		console.log('remove label')
		const temp = specs.value?.filter(spec => spec !== target && spec.parentId !== target.id)
		return Promise.resolve(temp)
	}
	const assign = (survivors: ISpec[] | undefined) => {
		if (!survivors) return Promise.reject(`无法删除标签：${label.label}`)
		specs.value = survivors
		return Promise.resolve()
	}

	removeLabel(label).then(assign).then(generateSkus)
}

const handleRemoveSpecs = async (spec: ISpec) => {
	const removeSpecs = async (target: ISpec) => {
		specs.value?.splice(specs.value.indexOf(target), 1)
		if (!target.parentId) return Promise.reject(`无法删除该选项，因为它不属于任何 Label：${target.label} => parentId为空`)
		return Promise.resolve(target.parentId)
	}

	const shouldRemoveLabel = (parentId: number) => {
		const ally = specs.value?.filter(spec => spec.parentId === parentId)
		const label = specs.value?.find(spec => spec.id === parentId)
		if (ally && ally.length <= 0 && label) return Promise.resolve(label)
		return Promise.reject('无需删除')
	}

	removeSpecs(spec)
		.then(shouldRemoveLabel)
		.then(label => specs.value?.splice(specs.value.indexOf(label), 1))
		.catch(err => ElMessage.warning(err))
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

/**
 * @description 生成所有组合
 */
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
			threshold: 100 * Math.random() / 2,
			title: '测试标题',
			carousels: []
		} as ISku
	}
	skus.value = bfs(groupedItems).map((specGroup, index) => assemble(specGroup, index))
}

const clearSku = () => {
	skus.value?.splice(0, skus.value.length)
}

/**
 * @description 生成默认规格
 */
const handleAddDefaultSpecs = () => {
	/**
 	* @description 生成默认规格
 	*/
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
	const assemble = (labels: ISpec[]) => specs.value = labels
	addDefaultSpecs().then(assemble).then(generateSkus)
}

const handleClearSpecs = () => {
	const clearSpecs = () => {
		if (specs.value && specs.value.length > 0) {
			specs.value = []
		}
		return Promise.resolve()
	}

	clearSpecs().then(generateSkus)
}

const handleMistake = (err?: string[]) => {
	ElMessage.error(err?.join(' | ') ?? '错误的选择')
}

const handleError = (err?: string) => {
	ElMessage.warning(err ?? '错误的选择')
}
</script>
