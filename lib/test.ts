export const template = `
<template>
 <view class="color_red size_16">
  <text textMaxLine="1">
   文字
  </text>
  <slot name="button">
   <!--默认的slot-->
   <view class="block"></view>
  </slot>
 </view>
</template>

<script>
export default {
 name: "component",
 props: {
  prop1: "default value",
  prop2: "default value",
  viewBg: "rgba(0,0,0,.2)",
  radius4px: true
 },
 data() {
  return {
   data_string: "1",
   data_number: 1,
   width: ""
  }
 },
 methods: {
  methodsName1: () => {
  	const b= 1;
  	const a = {
  		b
  	};
  	return a;
  },
  methodsName2: () => {
  },
 },
 event: {
  eventName1: () => {
  },
  eventName2: () => {
  },
 },
 mounted() {
  /* 编译成lifetimes:{load} */
 }
}
</script>

<style>
/* 注释 */
.color_red_1,
.color_red_2 {
 color: red;
 line-height: 1;
}

.size_16 {
 font-size: 16px;
 animation: ExchangeShowAnimate 480ms cubic-bezier(.4,0,0.2,1) 210ms 1 normal;
}

.block {
	/* 注释 */
 width: 100px;
 height: 100px;
}
</style>
`;
