<template>
	<section class="xl:w-45vw md:w-67vw sm:w-82vw lt-sm:w-82vw p-12 ma-auto">
		<h1>Table of contents</h1>
		<nuxt-link
			v-for="(table, index) of tables "
			:key="index"
			:to="{ path: table.path }"
			class="decoration-none color-inherit hover:color-blue"
		>
			{{ table.name }}
		</nuxt-link>
	</section>
</template>

<script lang="ts" setup>
const tables = [
	{
		name: 'sku 编辑器',
		path: '/sku'
	}
]
</script>
