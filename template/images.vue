<!-- 普通业务组件,单文件/组件写法 -->
<template>
	<view>
		<image v-for="item in src" :src="item" class="image"/>
	</view>
</template>

<script>
	export default {
		props: {
			src: []
		},
		data() {
			return {
			}
		}
	}
</script>

<style>
	.image {
		width: 100px;
		height: 100px;
	}
</style>
