<style lang="scss" scoped>

</style>

<template>
    <!-- 原生标签 -->
    <Draggable :options="{groupName:'main'}" v-model="component.children">
        <!-- <component
            :is="component.componentName"
            :class="[...component.class,
                    activeId == component.id ? 'active':null,
                    component.children.length == 0 ? 'has-placeholder': null ]"
            :style="component.style"
            @click="activeId = component.id"
        > -->
        <component
            :is="component.componentName"
            :class="[...component.class]"
            :style="component.style"
        >
            <Item v-for="subComponent in component.children" :key="subComponent.id" :component="subComponent"></Item>
        </component>
    </Draggable>
</template>

<script>
import Draggable from "./Draggable";

export default {
    name:'Item',
    components:{
        Draggable
    },
    props:{
        component:{
            type:Object
        }
    }
}
</script>