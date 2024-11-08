<template>
    <section>
        <h1>不会变更的sku选择器</h1>
        <p>🧐 每次选择都将检查下一个 spec 中所有 sku 的库存情况 来决定其是否可选</p>
        <p>🧐</p>
        <div class="bg-#222222 px-8 py-4 rounded">
            <div v-for="(spec, depth) in specs" :key="spec.id" class="my-8">
                <div class="mb-4 font-bold text-2xl">
                    {{ spec.label }}
                </div>
                <div v-for="tag in tags.filter(e => e.specId === spec.id)"
                    class="inline-block mr-4 text-xl cursor-pointer"
                    @click="handleSelection(depth, tag.id, tag.disabled)"
                    :class="[selections.length >= depth ? '' : 'color-gray cursor-not-allowed', tag.disabled ? 'color-gray cursor-not-allowed' : '', selections.includes(tag.id) ? 'color-blue' : '']">
                    {{ tag.labels.join(', ') }}
                </div>
            </div>
            <div class="h-1" style="border-top: 1px solid gray;"></div>
            <div class="my-4 text-2xl flex justify-between items-center">
                <span>最终价格</span>
                <span class="color-red">{{ product?.labels.join(', ') }}￥{{ product ? product.price : '等待选择' }}</span>
            </div>
        </div>
    </section>
</template>

<script lang='ts' setup>
import { specs, tags, type Tags } from './data'

const selections = reactive<number[]>([])
const product = ref<Tags | undefined>(undefined)


const handleSelection = (depth: number, id: number, disabled: boolean | undefined) => {
    if (!disabled) {
        if (depth > selections.length) {
            console.error('Depth exceeds the length of selections');
            return;
        }
        if (selections.length >= depth) {
            selections.splice(depth);
            product.value = undefined;
        }
        selections.splice(depth, 0, id);
    }

    let newProduct: Tags | undefined;

    const expose = (tag: Tags, next: number | undefined) => {
        const { stock, threshold } = tag;

        // 查找需要修改 disabled 状态的选项
        const option = next ? tags.find((tag) => tag.id === next) : undefined;

        if (option) {
            // 验证下一层中所有可选的 SKU 是否有库存，是否满足阈值
            option.disabled = stock <= (threshold ?? 0);
            return option;
        } else {
            // 根据 selections 中的 ids 查找选择的 SKU，显示商品信息
            const isSelected = tag.parentIds.every((id, index) => selections[index] === id) && selections.length === tag.parentIds.length;
            if (isSelected) {
                newProduct = tag;
                return newProduct;
            }
        }
    };

    const filteredTags = tags.filter((tag) => tag.parentIds.slice(0, selections.length).every((id, index) => selections[index] === id));
    filteredTags.map((t) => ({ product: t, next: t.parentIds[selections.length] })).forEach((f) => expose(f.product, f.next));

    if (newProduct) {
        product.value = newProduct;
    }
}










// const checkStock = (stock: number, threshold: number) => {
//     if (stock >= 0 && (threshold && (stock >= threshold))) {
//         return true
//     }
//     return false
// }

// const isAvailable = (depth: number, stock: number, threshold: number) => {
//     if (!checkStock(stock, threshold) || depth > selections.length) {
//         return false
//     }
//     return true
// }

// const handleSelection = (depth: number, id: number, stock: number, threshold: number) => {
//     if (isAvailable(depth, stock, threshold)) {
//         return selections[depth] = id
//     }
//     return
// }

// const isSelected = (id: number) => {
//     return selections.includes(id) ? 'color-blue' : ''
// }

// const options = Array.from(new Set(tags.map((f) => f.specId).filter(Boolean))).map((e) => tags.filter((g) => g.specId === e).map((t) => t.id))


// function dfs(options:number[][], path: number[], index: number, result: number[][]) {
//     if (index === options.length) {
//         result.push([...path]);
//         return;
//     }

//     for (const option of options[index]) {
//         path.push(option);
//         dfs(options, path, index + 1, result);
//         path.pop();
//     }
// }

// function getAllCombinations(specs:number[][]) {
//     const result: number[][] = [];
//     dfs(specs, [], 0, result);
//     return result;
// }


// const combinations = getAllCombinations(options);

// // 打印所有组合
// combinations.forEach(combo => console.log(combo));

</script>