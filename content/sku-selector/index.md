```vue
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
				class="inline-block mr-4 text-2xl cursor-pointer"
				:class="[
					selections.includes(child.id) ? child.disabled ? 'color-red' : 'color-blue' : '',
					(selections.length < depth || child.disabled) ? 'color-gray' : 'hover:color-blue'
				]"
				@click="handleSelect(depth, parent, child)"
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
			<div class="flex justify-between my-4">
				<span class="text-2xl">仅剩</span>
				<span class="text-2xl color-red">{{ productStock }}</span>
			</div>
		</div>
	</div>
	<el-empty v-else />
</template>

<script lang='ts' setup>
import { EnumShopGoodsStatus, type ISku, type ISpec, type ISpecOption } from '~/types/goods'

const props = defineProps<{ specs: ISpecOption[] | null, skus: ISku[] | null }>()
const emits = defineEmits<{
	(e: 'on-mistake', err: string[] | undefined): void
	(e: 'on-error', err: string): void
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
	if (option.disabled) emits('on-mistake', option.hint)
	return Promise.resolve(option.id)
}
/**
 * @description 将选项添加到 selections 数组中
 * @param depth 深度，当前选择的层数，用来判断是新增选择还是删除已选项
 * @param offset 偏移量
 */
const select = async (depth: Depth, id: OptionId): Promise<Depth> => {
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
	return Promise.resolve(depth)
}

/**
 * @description 跟据已选项，找到所有可能的的产品 sku 候选
 * @param nextDepth
 */
const filterSkuCandidates = async (depth: Depth) => {
	const nextDepth = depth + 1
	const candidates = props.skus?.filter(sku => selections.every((id, index) => sku.specIds.slice(0, nextDepth)[index] === id))
	if (candidates) return Promise.resolve({ candidates, nextDepth })
	return Promise.reject('没有找到对应的产品候选')
}

/**
 * @description 获取optionIds下一层中，所有选项的id
 * @param skus 产品候选
 * @param nextDepth 下一层要选的 index 值
 */
const mapOptionIdsAroundNextDepth = async (candidates: ISku[], depth: NextDepth) => {
	const optionIds = Array.from(new Set(candidates.map(sku => sku.specIds[depth]).filter(id => id !== undefined)))
	return Promise.resolve({ candidates, optionIds, depth })
}

/**
 * @description 对下一层中每个id，找到对应的选项，以及该选项所对应的sku
 * @example selections = [1], options = [3,4,5,6]
 * @example return [{1,3}, {1,4}, {1,5}, {1,6}]
 * @param optionIds 下一层选项的id列表
 * @param candidates 产品候选
 * @param depth 下一层要处理的index值
 * @returns skuUnderTheSelection
 */
const mapSkusAroundNextDepth = async (optionIds: OptionId[], candidates: ISku[], depth: NextDepth) => {
	const assemble = (option: OptionId) => ({
		option: props.specs?.find(spec => spec.id === option),
		skus: candidates.filter(sku => sku.specIds[depth] === option)
	})
	const skuUnderTheSelection = optionIds.map(assemble)
	return Promise.resolve(skuUnderTheSelection)
}

/**
 * @description 校验函数
 * @param target 需要校验的选项
 */
const validate = async (target: { option: ISpec | undefined, skus: ISku[] }) => {
	if (!target.option) return
	const hint = []

	if (target.skus.length === 0) hint.push('本选项未设置相应产品')
	if (target.skus.every(sku => sku.status === EnumShopGoodsStatus.Down)) hint.push('本选项下所有商品已下架')
	if (target.skus.every(sku => sku.stock <= 0)) hint.push('本选项下所有商品已售罄')
	if (target.skus.every(sku => sku.stock < sku.threshold)) hint.push('本选项下所有商品库存告急')
	if (target.skus.every(sku => sku.status === EnumShopGoodsStatus.Hidden)) hint.push('本选项下所有商品均为非卖品，仅供展示')

	return Object.assign(target.option, { disabled: hint.length > 0, hint })
}

/**
 * @description 选择包装器
 * @param depth 深度
 * @param labelId 你要在哪个label下进行选择，对该label下的选项进行验证
 * @param offset 元素在数组中的位置，即偏移量
 */
const handleSelect = (depth: number, label: ISpec, option: ISpec) => {
	validateSelection(depth, label.id, props.specs?.indexOf(option))
		.then(offset => select(depth, offset))
		.then(depth => filterSkuCandidates(depth))
		.then(({ candidates, nextDepth }) => mapOptionIdsAroundNextDepth(candidates, nextDepth))
		.then(({ candidates, optionIds, depth }) => mapSkusAroundNextDepth(optionIds, candidates, depth))
		.then(skuUnderTheSelection => skuUnderTheSelection.forEach(validate))
		.catch(err => emits('on-error', err))
}

const product = computed(() => props.skus?.find(sku => sku.specIds.every((id, index) => selections[index] === id)))
const productName = computed(() => product.value ? product.value.labels.join(' - ') : '等待选择')
const productPrice = computed(() => product.value ? `￥${product.value.price.toFixed(2)}` : '等待选择')
const productStock = computed(() => product.value ? `${product.value.stock}件` : '等待选择')
const productGeneralPrice = computed(() => product.value
	? product.value.generalPrice
		? `￥${product.value.generalPrice.toFixed(2)}`
		: `￥${product.value.price.toFixed(2)}`
	: '等待选择')
</script>
```