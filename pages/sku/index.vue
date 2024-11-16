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
				@tab-change="handleTabChange"
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
import type { TabPaneName } from 'element-plus'
import { type ISku, type ISpec, type EditableISpec, EnumShopGoodsStatus } from '~/types/goods'

useHead({
	htmlAttrs: {
		lang: 'zh-CN'
	},
	link: [
		{
			rel: 'icon',
			type: 'image/png',
			href: '/favicon.png'
		}
	]
})

useSeoMeta({
	title: 'sku selector | Polarove',
	author: 'Polarove aka 刘棋',
	description: 'A interactive demo of sku selector',
	ogTitle: 'sku selector | Polarove',
	ogDescription: 'A interactive demo of sku selector',
	ogImage: 'https://avatars.githubusercontent.com/u/95893742?v=4',
	ogUrl: 'https://polarove.github.io/polar/sku',
	twitterTitle: 'sku selector | Polarove',
	twitterDescription: 'A interactive demo of sku selector',
	twitterImage: 'https://avatars.githubusercontent.com/u/95893742?v=4',
	twitterCard: 'summary'
})

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
	return calculateId().then(assemble).then(addSpec).then(label => label).then(generateSkus)
}

const handleAddLabel = () => {
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
		return Promise.resolve(undefined)
	}

	const tryToRemoveLabel = (label: ISpec | undefined): Promise<string | null> => {
		if (!specs.value) return Promise.reject('[tryToRemoveLabel]：可选项为空，无法执行删除操作')
		if (label) {
			specs.value.splice(specs.value.indexOf(label), 1)
			return Promise.resolve(`[tryToRemoveLabel]：由于该Label下已无子选项，移除Label | ${label.label}`)
		}
		return Promise.resolve(null)
	}

	removeSpecs(spec)
		.then(shouldRemoveLabel)
		.then(tryToRemoveLabel)
		.then(msg => msg && ElMessage.success(msg))
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

declare type OptionGroups = { [key: number]: ISpec[] }

/**
* @description 将商品按 ParentId 分组，方便后续更新可选状态
*/
const groupByParentId = async (items: ISpec[] | null): Promise<OptionGroups> => {
	if (!items) return Promise.reject('[groupByParentId]: 在按照parentId对数组进行整理时，传入的数组为空')
	if (items.length === 0) return Promise.reject('[groupByParentId]: 在按照parentId对数组进行整理时，传入的数组为空')

	const process = (acc: OptionGroups, item: ISpec) => {
		const parentId = item.parentId || 0 // 使用 0 作为默认分组
		if (!acc[parentId]) {
			acc[parentId] = []
		}
		acc[parentId].push(item)
		return acc
	}

	const groupedItems = items.reduce((acc, item) => process(acc, item), {} as OptionGroups)
	return Promise.resolve(groupedItems)
}

/**
 * @description 生成随机数
 * @param multiplier 倍率
 */
const randomNumber = (multiplier: number): number => Math.random() * multiplier

/**
 * @description 从枚举类中获取随机的值
 * @param enumObj 枚举类
 */
const getRandomEnumValueByKey = <T extends object>(enumObj: T): T[keyof T] => {
	const enumKeys = Object.keys(enumObj).filter(key => isNaN(Number(key)))
	const randomKey = enumKeys[Math.floor(Math.random() * enumKeys.length)] as keyof T
	return enumObj[randomKey]
}

/**
 * @description 生成所有组合
 */
const generateSkus = async () => {
	const validate = (groups: OptionGroups) => Object.values(groups)

	/**
 	* @description 获取所有组合
 	* @param products 商品规格
 	*/
	const bfs = async (products: ISpec[][] | null): Promise<ISpec[][]> => {
		if (!products) return Promise.reject('[bfs]: 产品为空')
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

		return Promise.resolve(queue)
	}

	const assemble = async (combinations: ISpec[][]) => {
		const skus = combinations.map((group, index) => ({
			id: index,
			labels: group.map(sku => sku.label),
			specIds: group.map(sku => sku.id),
			generalPrice: 1000 * Math.random(),
			price: randomNumber(1000) / 2,
			favorites: randomNumber(1000),
			sales: randomNumber(1000),
			shares: randomNumber(1000),
			isShowSales: index * randomNumber(10) % 2 == 1,
			weight: randomNumber(100),
			status: getRandomEnumValueByKey(EnumShopGoodsStatus),
			stock: randomNumber(1000),
			threshold: randomNumber(100) / 2,
			title: '测试标题',
			carousels: []
		}))
		return Promise.resolve(skus)
	}

	groupByParentId(specs.value?.filter(spec => spec.parentId != null) ?? [])
		.then(validate)
		.then(bfs)
		.then(assemble)
		.then(res => skus.value = res)
		.catch(err => console.info(err))
}

const clearSku = () => {
	skus.value?.splice(0, skus.value.length)
}

/**
 * @description 生成默认规格
 */
const handleAddDefaultSpecs = async () => {
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

	addDefaultSpecs()
		.then(assemble)
		.then(generateSkus)
		.catch(err => ElMessage.warning(err))
}

handleAddDefaultSpecs()

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

const handleTabChange = (tab: TabPaneName) => {
	tab = parseInt(tab.toString())
	switch (tab) {
		case 1: generateSkus()
			break
		case 3: generateSkus()
			break
		default: break
	}
}
</script>
