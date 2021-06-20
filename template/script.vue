<!-- 普通业务组件,单文件/组件写法 -->
<template>
  <view>
    <text>{{ changeText('-自定义text') }}</text>
  </view>
</template>

<script>
export default {
  name: "component",
  props: {
    src: [],
    innerText: "默认值",
  },
  data() {
    return {

    }
  },
  methods: {
    changeText(text) {
      return this.props.innerText + text;
    }
  }
}
</script>
