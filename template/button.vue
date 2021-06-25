<template>
	<view class="button" :style="getButtonBg()">
		<text class="button_text">{{ button_text }}</text>
		<text class="button_text">{{ getText() }}</text>
	</view>
</template>

<script>
export default {
	name: "component",
	props: {
		button_background_color: '',
		button_text: '',
	},
	data() {
		return {
			defaultBg: '#008DEA',
		}
	},
	methods: {
		getButtonBg() {
			return this.props.button_background_color || this.data.defaultBg;
		},
		getText() {
			return 'sssss'
		},
    handleClick: () => {}
	}
}
</script>

<style>
	.button {
		width: 100%;
		height: 100%;
		border-radius: 4px;
		align-items: center;
		justify-content: center;
	}

	.button_text {
		font-weight: 500;
		font-style: normal;
		line-height: 20px;
		font-size: 16px;
		color: rgba(255, 255, 255, 0.9);
	}
</style>
