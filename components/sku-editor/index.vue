<template>
	<el-table
		:data="page.data ?? []"
		:stripe="true"
		:border="true"
	>
		<el-table-column
			:fixed="true"
			label="操作"
			width="200"
			class-name="h-100px"
			align="center"
		>
			<template #default="scope">
				<el-button @click="$emit('reviewSku', scope.row)">
					修改
				</el-button>
				<el-button @click="$emit('removeSku', scope.row)">
					删除
				</el-button>
			</template>
		</el-table-column>
		<el-table-column
			v-for="(col, index) of columns"
			:key="index"
			:prop="col.prop"
			:label="col.label"
			:width="col.width"
			:resizable="true"
			class-name="h-100px"
		/>
	</el-table>
	<el-pagination
		layout="prev, pager, next"
		:total="page.total"
		:current-page="page.pageNo"
		class="justify-center mt-4"
		size="large"
		:background="true"
		@current-change="(e) => handlePageChange(e)"
	/>
</template>

<script lang='ts' setup>
import type { IPage, ISku } from '~/types/goods'

const props = defineProps<{ skus: ISku[] | null }>()

const pageState = reactive({
	pageNo: 1,
	pageSize: 10
})

const page = computed(() => ({
	total: props.skus?.length ?? 0,
	data: props.skus?.slice((pageState.pageNo - 1) * pageState.pageSize, pageState.pageNo * pageState.pageSize) ?? []
} as IPage<ISku[]>))

const handlePageChange = (pageNo: number) => {
	pageState.pageNo = pageNo
}

defineEmits<{
	(e: 'reviewSku' | 'removeSku', row: ISku): void
}>()

const columns = [
	{
		prop: 'id',
		label: 'id',
		width: 100
	},
	{
		prop: 'labels',
		label: '标签',
		width: 300
	},
	{
		prop: 'specIds',
		label: '相关选项',
		width: 200
	},
	{
		prop: 'carousels',
		label: '轮播图',
		width: 200
	},
	{
		prop: 'title',
		label: '标题',
		width: 200
	},
	{
		prop: 'stock',
		label: '库存',
		width: 200
	},
	{
		prop: 'threshold',
		label: '库存阈值',
		width: 200
	},
	{
		prop: 'sales',
		label: '销量',
		width: 200
	},
	{
		prop: 'isShowSales',
		label: '是否显示销量',
		width: 200
	},
	{
		prop: 'favorites',
		label: '喜欢数',
		width: 200
	},
	{
		prop: 'shares',
		label: '分享数',
		width: 200
	},
	{
		prop: 'generalPrice',
		label: '日常价格',
		width: 200
	},
	{
		prop: 'price',
		label: '当前价格',
		width: 200
	},
	{
		prop: 'weight',
		label: '重量',
		width: 200
	},
	{
		prop: 'content',
		label: '图文内容',
		width: 200
	},
	{
		prop: 'status',
		label: '状态',
		width: 200
	}
]
</script>

<style lang='scss' scoped>

</style>
