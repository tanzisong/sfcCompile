<!-- 布局组件,单文件/组件写法 -->
<template>
	<!-- @vue/compiler-dom	-->
	<div @custom-event="sendLog" @custom-event.success="sendV3Log">
		<custom-component version="2.0.0"/>
		<span class="text-1">{{ variable }}{{ variable1 }}</span>
		<span class="text-2">11111-----{{ variable }}-----11111</span>
		<slot name="header"></slot>
	</div>
</template>

<script lang="ts">
	// TS-parser
	export default {
		name: 'card',
		version: "1.0.0",
		props: {
			src: "default prop value"
		},
		data() {
			return {
				variable: 1,
				variable1: 2
			}
		},
		methods: {
			sendLog(a, b, c) {
				sendAdLog(a,b,c);
			},
			sendV3Log() {
				// do something but only can call other functions, Can't define a variable
			},

			setGlobalData() {

			}
		},
		mounted() {
			this.setGlobalData();
		},
		unmounted() {

		}
	}
</script>

<style>
	// cssom parser
	.text-1 {
		color: red;
	}
	.text-2 {
		color: red;
	}
</style>
