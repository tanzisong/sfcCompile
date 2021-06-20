<template>
	<view class="color_red size_16"
				:style="{
					width,
					height: '100px',
					background: viewBg,
					borderRadius: radius4px ? '4px' : '8px'
				}">
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
		/*	编译成lifetimes:{load}	*/
	}
}
</script>

<style>
.color_red {
	color: red;
}

.size_16 {
	font-size: 16px;
}

.block {
	width: 100px;
	height: 100px;
}
</style>
