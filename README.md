## sfc-compile
### Project objectives
```text
    将vue2.x sfc语法编译成特定格式的json
```
#### example

Change
```vue
<template>
  <div>
    text
    <image src="xxx"/>
    <text>{{ variable }}</text>
    <div :style="{background: bgColor}"></div>
  </div>
</template>
<script lang="js">
  export default {
    name: "component",
    props: {},
    data(){
      return {
        variable: "",
        bgColor: "red"
      }
    },
    methods: {},
    mounted() {},
    unmounted() {},
    created() {}
  }
</script>

<style lang="css">
  .box {
    width: 100px;
    height: 100px;
    background: green;
  }
</style>
```
to
```json5
{
  // todo
}
```
