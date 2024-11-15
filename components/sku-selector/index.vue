<template>
	<div
		v-if="specs && specs.length > 0"
	>
		<section
			v-for="(parent, depth) in labels"
			:key="depth"
		>
			<h2 class="text-3xl color-red">
				{{ parent.label }}{{ parent.id }}
			</h2>
			<div
				v-for="(child, subIndex) in specs.filter(spec => spec.parentId === parent.id)"
				:key="subIndex"
				class="inline-block mr-4 text-2xl"
				:class="[
					selections.includes(child.id) ? 'color-blue' : '',
					selections.length < depth ? 'color-gray cursor-not-allowed' : 'hover:color-blue cursor-pointer'
				]"
				@click="wrapSelect(depth, parent, child)"
			>
				{{ child.label }}
			</div>
		</section>
		<el-divider />
		<div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">已选商品</span>
				<span class="text-2xl color-red">{{ productName }}</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">原价</span>
				<span
					class="text-2xl color-red"
					:class="[product && 'decoration-line-through']"
				>{{ productGeneralPrice }}</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">优惠价</span>
				<span class="text-2xl color-red">{{ productPrice }}</span>
			</div>
		</div>
	</div>
	<el-empty v-else />
</template>

<script lang='ts' setup>
import type { ISku, ISpec } from '~/types/goods'

const props = defineProps<{ specs: ISpec[] | null, skus: ISku[] | null }>()
const emits = defineEmits<{
	(e: 'on-complete', sku: ISku | undefined, specIds: OptionId[]): void
}>()
const selections = reactive<number[]>([])

const labels = computed(() => props.specs?.filter(spec => spec.parentId == null))

declare type OptionId = number
declare type Depth = number
declare type LabelId = number
declare type SpecId = number
declare type NextDepth = number

/**
 * @description 对选择进行验证
 * @param depth 深度
 * @param labelId 你要在哪个label下进行选择，对该label下的选项进行验证
 * @param offset 元素在数组中的位置，即偏移量
 */
const validateSelection = async (depth: Depth, labelId: LabelId, offset: SpecId | undefined): Promise<OptionId> => {
	const row = depth + 1
	if (!props.specs) return Promise.reject('没有可选项，无法选择')
	if (!props.specs.find(spec => spec.parentId != null)) return Promise.reject('可选项为空，无法选择')
	if (!offset) return Promise.reject(`无效的选择：第 ${offset} 个`)
	const option = props.specs[offset]
	if (!option) return Promise.reject(`选项不存在：第 ${row} 行第 ${offset} 个`)
	if (option.parentId !== labelId) return Promise.reject(`错误的选择：第 ${row} 行第 ${offset} 个`)
	if (depth > selections.length) return Promise.reject('请按顺序选择')
	return Promise.resolve(option.id)
}
/**
 * @description 将选项添加到 selections 数组中
 * @param depth 深度，当前选择的层数，用来判断是新增选择还是删除已选项
 * @param offset 偏移量
 */
const select = async (depth: Depth, id: OptionId): Promise<NextDepth> => {
	if (depth < selections.length) {
		if (selections[depth] === id) {
			selections.splice(depth)
		}
		else {
			selections.splice(depth)
			selections.splice(depth, 0, id)
		}
	}
	else selections.splice(depth, 0, id)
	return Promise.resolve(depth + 1)
}

/**
 * @description 找到对应的产品候选
 * @param nextDepth
 */
const filterCandidates = (nextDepth: NextDepth) => {
	console.log('next depth', nextDepth)
	const candidate = props.skus?.filter(sku => selections.every((id, index) => sku.specIds.slice(0, selections.length)[index] === id))
	if (candidate) return Promise.resolve({ skus: candidate, nextDepth })
	return Promise.reject('没有找到对应的产品候选')
}

/**
 * @description 获取下一层中，所有选项的id
 * @param skus 产品候选
 * @param nextDepth 下一层要选的 index 值
 */
const popOptionIdsAroundGivenDepth = (candidates: ISku[], nextDepth: NextDepth) => {
	const optionIdsAroundDepth = Array.from(new Set(candidates.map(sku => sku.specIds[nextDepth]).filter(id => id !== undefined)))
	console.log('获取下一层可选项的id', optionIdsAroundDepth)
	if (optionIdsAroundDepth.length === 0) {
		console.log('用户已经选完所有可选项')
		emits('on-complete', product.value, selections)
	}
	return Promise.resolve(optionIdsAroundDepth)
}

const adfs = (optionIds: OptionId[]) => {
	console.log(optionIds)
}

/**
 * @description 选择包装器
 * @param depth 深度
 * @param labelId 你要在哪个label下进行选择，对该label下的选项进行验证
 * @param offset 元素在数组中的位置，即偏移量
 */
const wrapSelect = (depth: number, label: ISpec, option: ISpec) => {
	validateSelection(depth, label.id, props.specs?.indexOf(option))
		.then(offset => select(depth, offset))
		.then(nextDepth => filterCandidates(nextDepth))
		.then(({ skus, nextDepth }) => popOptionIdsAroundGivenDepth(skus, nextDepth))
		.then(optionIds => adfs(optionIds))
		.catch(err => ElMessage.warning(err))
}

const product = computed(() => props.skus?.find(sku => sku.specIds.every((id, index) => selections[index] === id)))
const productName = computed(() => product.value ? product.value.labels.join(' - ') : '等待选择')
const productGeneralPrice = computed(() => product.value ? product.value.generalPrice ? `￥${product.value.generalPrice.toFixed(2)}` : `￥${product.value.price.toFixed(2)}` : '等待选择')
const productPrice = computed(() => product.value ? `￥${product.value.price.toFixed(2)}` : '等待选择')
</script>
