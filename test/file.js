const { Parser } = require('../dist/lib/compile.umd.js');
const template = `
<template>
 <view class="button button_1" :style="getButtonBg()">
    <slot name='button'>
      <view class='button'></view>
    </slot>
  <text class="button_text">{{ "button_text" }}</text>
  <text class="button_text">{{ 'button_text' }}</text>
  <text class="button_text">{{ getText() }}</text>
  <text class="button_text">{{ text }}</text>
 </view>
</template>

<script>
export default {
 name: "component",
 props: {
  button_background_color: '',
  button_text: null,
  number: 1,
  boolean: true,
  string: [
    null,
    {
      number: 1
    },
    ['1', true],
    false
  ],
  array: [1, 2, 3, 4],
  testObj: {
  	a: {
  		b: 1
  	},
  	d: ['string']
  }
 },
 data() {
  return {
   defaultBg: '#008DEA',
   text: "text"
  }
 },
 methods: {
  getButtonBg(bg = '#fff') {
    const color = this.props.button_background_color || this.data.defaultBg || bg;
    return color;
  },
  getText: () => {
    return 'sssss'
  },
 },
   mounted() {
    if(this.props.appInfo.device_platform === 'android') {
      this.methods.setData({
        is_iphone: false
      });
      console.info('安卓下载类, 初始化下载逻辑');
      let open_url = undefined;
      let aid = this.props.appInfo.aid;
      if(this.props.open_url && typeof this.props.open_url === 'string') {
        this.props.open_url.replace('__back_url__', "snssdk"+aid+"%3A%2F%2Fadx");
      }

      const downLoadAppData = Object.assign({open_url, click_track_url_list: this.props.adInfo.track_url_list}, this.props.appData);
      console.info('downLoadAppData', downLoadAppData);
      this.methods.callJSB("subscribe_app_ad", { data: {data: this.props.appData} }, () => {});
    }
  },
  event: {
   app_ad_event(data) {
      console.info('安卓下载数据', data);
      if(data.data) {
        var { current_bytes = 0, total_bytes = 0, status } = data.data;
        var newButtonData = {
          icon: this.data.statusIcon['0'],
          text: this.data.statusText.idleText,
          process: 0,
          isDownloading: false,
          isPaused: false,
          status: 0,
        };
        var progress = +total_bytes > 0 ? Math.ceil((+current_bytes * 100) / +total_bytes) : 0;
        switch (status) {
          case this.data.DOWNLOAD_STATUS.CANCEL:
          case this.data.DOWNLOAD_STATUS.FAIL:
          case this.data.DOWNLOAD_STATUS.IDLE:
          case this.data.DOWNLOAD_STATUS.UNSUBSCRIBED:
            newButtonData.isDownloading = false;
            newButtonData.text = this.data.statusText.idleText;
            newButtonData.icon = this.data.statusIcon['0'];
            newButtonData.status = this.data.DownloadStatus.fail;
            break;
          case this.data.DOWNLOAD_STATUS.DOWNLOADING:
            newButtonData.isDownloading = true;
            newButtonData.isPaused = false;
            newButtonData.process = progress;
            newButtonData.status = this.data.DownloadStatus.ing;
            break;
          case this.data.DOWNLOAD_STATUS.PAUSED:
            newButtonData.isDownloading = true;
            newButtonData.isPaused = true;
            newButtonData.process = progress;
            newButtonData.text = this.data.statusText.pausedText;
            newButtonData.icon = this.data.statusIcon['3'];
            newButtonData.status = this.data.DownloadStatus.paused;
            break;
          case this.data.DOWNLOAD_STATUS.FINISHED:
            newButtonData.isDownloading = false;
            newButtonData.text = this.data.statusText.finishedText;
            newButtonData.icon = this.data.statusIcon['4'];
            newButtonData.status = this.data.DownloadStatus.finished;
            newButtonData.process = progress;
            break;
          case this.data.DOWNLOAD_STATUS.INSTALLED:
            newButtonData.isDownloading = false;
            newButtonData.text = this.data.statusText.installedText;
            newButtonData.icon = this.data.statusIcon['4'];
            newButtonData.status = this.data.DownloadStatus.finished;
            newButtonData.process = progress;
            break;
        }
        console.info('newButtonData', newButtonData);
        this.methods.setData({
          buttonData: newButtonData
        })
      }
    }
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
`;

console.info(new Parser(template).ParsedDSL);
