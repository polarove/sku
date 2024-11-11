<template>
    <div class="px-24 pb-24">
        <div>
            <transition name="down">
                <section v-if="visible" class="text-center my-24">
                    <p>✨支持情况：依赖vue，若小程序如果使用 uniapp 开发，可以完美复现，直接ctrl c+v；若使用原生微信小程序，则需要花费一定时间做适配</p>
                    <p>✨特性：一张表，存储每个商品的Sku，同时支持不同商品的 多层sku嵌套与筛选 和 单sku 列表展示</p>
                    <br>
                    <p>😥缺陷：由于一张表内存放了一个商品多个 sku 的上下级关系，因此需要设计更直观的后台管理页面和交互，防止人为误操作导致的脏数据</p>
                </section>
            </transition>
            <transition name="center">
                <div v-if="visible">
                    <div class="grid grid-cols-2 w-20vw ma-auto">
                        <div>
                            <h2>默认状态</h2>
                            <div class="my-2">
                                <div class="w-12px h-12px bg-white inline-block mr-2"/>
                                <div class="inline-block ">商品有货</div>
                            </div>
                            <div>
                                <div class="w-12px h-12px bg-gray inline-block mr-2"/>
                                <div class="inline-block color-gray">商品无货 / 无法选择</div>
                            </div>
                        </div>
                        <div>
                            <h2>选中状态</h2>
                            <div class="my-2">
                                <div class="w-12px h-12px bg-red inline-block mr-2"/>
                                <div class="inline-block color-red">商品无货</div>
                            </div>
                            <div>
                                <div class="w-12px h-12px bg-blue inline-block mr-2"/>
                                <div class="inline-block color-blue">商品有货</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-24">
                        <multi-sku-selector :skus="tags" :specs="specs" />
                        <multi-sku-selector :skus="tags2" :specs="specs2" />
                        <multi-sku-selector :skus="tags3" :specs="specs3"  :border="true" />
                    </div>
                </div>
            </transition>
        </div>
        <main class="px-128 mt-32">
            <div class="mb-8">
               <div class="mb-8">
                    <nuxt-link
to="/a/types" active-class="color-blue!"
                        class="decoration-none color-inherit cursor-pointer">类型声明</nuxt-link>
                    <nuxt-link
to="/a/code" active-class="color-blue!"
                        class="decoration-none color-inherit ml-4 cursor-pointer">前端代码</nuxt-link>
                </div>
                <div>
                    <nuxt-link
to="/a/data" active-class="color-blue!"
                        class="decoration-none color-inherit cursor-pointer">一行spec</nuxt-link>
                    <nuxt-link
to="/a/data/2" active-class="color-blue!"
                        class="decoration-none color-inherit ml-4 cursor-pointer">两行spec</nuxt-link>
                    <nuxt-link
to="/a/data/3" active-class="color-blue!"
                        class="decoration-none color-inherit ml-4 cursor-pointer">三行spec</nuxt-link>
                </div>
            </div>
            <div class="bg-#222222 px-8 py-2 grid grid-cols-2 rounded text-xl mb-24">
                <content-doc path="/interface/data/data3" />
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { tags, specs } from '../../../components/multi-sku-selector/data';
import { tags2, specs2 } from '../../../components/multi-sku-selector/data2';
import { tags3, specs3 } from '../../../components/multi-sku-selector/data3'

const visible = ref(false)
onMounted(() => visible.value = true)

</script>


<style scoped>
.down-enter-active,
.down-leave-active {
    transition:
        transform 456ms,
        opacity 456ms;
}

.down-enter-from,
.down-leave-to {
    opacity: 0;
    transform: translate3D(0, -50%, 0);
}

.center-enter-active,
.center-leave-active {
    transition: opacity 456ms;
}

.center-enter-from,
.center-leave-to {
    opacity: 0;
}
</style>