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
				<span class="text-2xl">已选商品</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">原价</span>
				<span class="text-2xl">已选商品</span>
			</div>
			<div class="flex justify-between my-4">
				<span class="text-2xl">优惠价</span>
				<span class="text-2xl">已选商品</span>
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
 *
 * @param depth 深度，当前选择的层数，用来判断是新增选择还是删除已选项
 * @param labelId 标签id，你要选择的是哪个标签下的选项
 * @param offset 偏移量
 */
const handleSelect = async (depth: number, labelId: number, offset: number | undefined): Promise<void> => {
	const layer = depth + 1
	if (!props.specs) return Promise.reject('没有可选项，无法选择')
	if (!props.specs.find(spec => spec.parentId != null)) return Promise.reject('可选项为空，无法选择')
	if (!offset) return Promise.reject(`无效的选择：第 ${layer} 行第 ${offset} 个`)
	const option = props.specs[offset]
	if (!option) return Promise.reject(`选项不存在：第 ${layer} 行第 ${offset} 个`)
	if (option.parentId !== labelId) return Promise.reject(`错误的选择：第 ${layer} 行第 ${offset} 个`)
	if (depth > selections.length) return Promise.reject('请按顺序选择')
	select(depth, option.id)
}

/**
 * @description 将选项添加到 selections 数组中
 */
const select = (depth: number, id: number): void => {
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
}

const wrapSelect = (depth: number, label: ISpec, option: ISpec) => {
	handleSelect(depth, label.id, props.specs?.indexOf(option))
		.catch(err => ElMessage.warning(err))
}
</script>
