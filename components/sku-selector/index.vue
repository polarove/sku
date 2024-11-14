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
				{{ child.label }}{{ child.id }}
			</div>
		</section>
		<el-divider />
		<div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">已选商品</span>
				<span class="text-2xl color-red">{{ product ? product.labels.join(' - ') : '等待选择' }}</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">原价</span>
				<span class="text-2xl color-red">已选商品</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">优惠价</span>
				<span class="text-2xl color-red">已选商品</span>
			</div>
		</div>
	</div>
	<el-empty v-else />
</template>

<script lang='ts' setup>
import type { ISku, ISpec } from '~/types/goods'

const props = defineProps<{ specs: ISpec[] | null, skus: ISku[] | null }>()

const selections = reactive<number[]>([])

const labels = computed(() => props.specs?.filter(spec => spec.parentId == null))

/**
 * @description 对选择进行验证
 * @param depth 深度
 * @param labelId 你要在哪个label下进行选择，对该label下的选项进行验证
 * @param offset 元素在数组中的位置，即偏移量
 */
const validateSelection = (depth: number, labelId: number, offset: number | undefined) => {
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
const select = (depth: number, id: number): number => {
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
	return depth + 1
}

/**
 * @description 更新下一层选项的可选状态
 */
const updateOptionState = (nextDepth: number) => {
	console.log('next depth', nextDepth)
}

const findProduct = () => {
	console.log('find my product', selections)
	console.log(props.skus?.find(sku => sku.specIds.every((id, index) => selections[index] === id)))
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
		.then(nextDepth => updateOptionState(nextDepth))
		.then(() => findProduct())
}

const product = computed(() => props.skus?.find(sku => sku.specIds.every((id, index) => selections[index] === id)))
</script>
