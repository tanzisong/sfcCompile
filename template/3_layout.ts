/**
 * 布局三-下载类专用布局
 */

const layout: UniDSL.Legacy.Origin.ComponentDefinition = {
  props: {
    appInfo: {},
    page: '', // 使用该布局的样式名称-发送自定义埋点
  },
  data: {
    /** exchange icon */
    exchange_icon: 'https://sf3-ttcdn-tos.pstatp.com/obj/unity/images/feed-mix-card/exchange.png',
    delayTime: '300ms', // 根据当前设备,设置不同的delay时间
    exchangeTimer: null,

    exchangeShowStyle: {
      transform: 'rotate(-90deg)',
      animationName: 'ExchangeShowAnimate',
      animationDelay: '210ms',
    },
    exchangeHideStyle: {
      transform: 'rotate(0deg)',
      animationName: 'ExchangeHideAnimate',
      animationDelay: '0ms',
    },
    exchangeInitStyle: {
      transform: 'rotate(-90deg)',
    },
    exchangeAnimateStyle: {
      transform: 'rotate(-90deg)',
    },
    /** exchange icon end */
    /** button area start  */
    buttonShowStyle: {
      opacity: '0',
      transform: 'translateY(-22px)',
      animationName: 'ButtonShowAnimate',
      animationDelay: '280ms',
      animationDuration: '500ms',
      animationFillMode: 'forwards',
      animationTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
    },
    buttonHideStyle: {
      opacity: 1,
      transform: 'translateY(0px)',
      animationName: 'ButtonHideAnimate',
      animationDelay: '0ms',
      animationDuration: '500ms',
      animationFillMode: 'forwards',
      animationTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
    },
    buttonInitStyle: {
      opacity: '0',
    },
    buttonAnimateStyle: {
      opacity: '0',
    },
    /** button area end  */
    /** card area start  **/
    cardShowStyle: {
      opacity: '0',
      transform: 'translateY(-22px)',
      animationName: 'CardShowAnimate',
      animationDelay: '210ms',
    },
    cardHideStyle: {
      opacity: 1,
      transform: 'translateY(0)',
      animationName: 'CardHideAnimate',
      animationDelay: '70ms',
    },
    cardInitStyle: {
      opacity: '0',
    },
    cardAnimateStyle: {
      opacity: '0',
    },
    /** card area end   **/
    componentShowTime: '',
  },
  lifetimes: {
    load: {
      __TYPE__: 4,
      code: `function(){
        this.methods.callJSB("cardStatus", {data: {status: 1}}, function(res){console.info('cardStatus', res)});
         var { device_platform } = this.props.appInfo;
        console.info("device_platform", device_platform)
        if(device_platform !== 'android') {
          this.methods.setData({
            delayTime: "210ms"
          });
        }
      }`,
    },
  },
  event: {
    // 端展示事件
    feedButtonStartUnfold: {
      __TYPE__: 4,
      code: `
         function() {
            console.info("feedButtonStartUnfold事件回调");
            this.methods.setData({
              exchangeAnimateStyle: this.data.exchangeShowStyle,
              buttonAnimateStyle: this.data.buttonShowStyle,
              cardAnimateStyle: this.data.cardShowStyle,
              componentShowTime: this.data.componentShowTime ? this.data.componentShowTime : new Date().getTime()
            })
         }
      `,
    },
  },
  methods: {
    onClick: {
      __TYPE__: 4,
      code: `
        function(refer, click_type) {
          if(!click_type) {
            click_type = ''
          }
        
          var _this = this;
           this.methods.callJSB("getVideoShowTime", {}, function (res) {
            var show_time = res.data.show_time;
          
            var click_time = (
              new Date().getTime() - _this.data.componentShowTime
            ).toString();
          
            console.info(
              "show_time, click_time, refer, click_type",
              show_time,
              click_time,
              refer,
              click_type
            );
          
             _this.methods.callJSB(
              "feedLearnMoreButtonClick",
              {
                data: {
                  refer: refer,
                  click_type: click_type,
                  type:
                     _this.data.__globalProps.lynx_raw_data.template_type === 5
                      ? "app"
                      : "business",
                  template_type:  _this.data.__globalProps.lynx_raw_data.template_type,
                  ad_extra_data: {
                    show_time: show_time,
                    click_time: click_time
                  }
                }
              },
              function (res) {}
            );
          });
        }
      `,
    },
    inSightSdkClick: {
      __TYPE__: 4,
      code: `
        function(event) {
            if(this.methods.eventEmitter && this.methods.eventEmitter.emitClickEvent) {
               var { x, y } = event.detail || {};
              console.info('x, y', x, y);
              this.methods.eventEmitter.emitClickEvent({
                x: x,
                y: y,
                clientX: x,
                clientY: y,
              })
            }
        }
      `,
    },
    startHideAnimate: {
      __TYPE__: 4,
      code: `
        function() {
          console.info('隐藏页面->执行隐藏动画');
          this.methods.setData({
            exchangeAnimateStyle: this.data.exchangeHideStyle,
            buttonAnimateStyle: this.data.buttonHideStyle,
            cardAnimateStyle: this.data.cardHideStyle
          });
        }
      `,
    },
  },
  slots: {
    thumb: [
      {
        id: '',
        name: 'view',
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          backgroundColor: '#DDDDDD',
        },
      },
    ],
    title: [
      {
        id: '',
        name: 'view',
        style: {
          width: '100%',
          height: '22px',
          borderRadius: '4px',
          backgroundColor: '#DDDDDD',
        },
      },
    ],
    button: [
      {
        id: '',
        name: 'view',
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          backgroundColor: '#DDDDDD',
        },
      },
    ],
    desc: [
      {
        id: '',
        name: 'view',
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          backgroundColor: '#DDDDDD',
        },
      },
    ],
  },
  content: {
    id: '',
    name: 'view',
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100vw',
      maxWidth: '268px',
      height: '144px',
      margin: '35px 0px 0px 0px',
      overflow: 'visible',
    },
    event: {
      click: {
        __TYPE__: 4,
        code: `
        function(e) {this.methods.onClick.call(this, 'blank'); this.methods.inSightSdkClick.call(this, e)
        this.methods.bridges.sendCustomLog({
            label: "blank",
            extra: {
              page: this.props.page,
            },
          });
        }`,
      },
    },
    props: {
      name: 'nativeNotResponseRootView',
    },
    children: [
      // button
      {
        id: '',
        name: 'view',
        style: {
          __TYPE__: 4,
          code: `Object.assign({display: 'flex', flexDirection: 'row', width: '100%', height: '64px'}, this.data.buttonAnimateStyle)`,
        },
        children: [
          {
            id: '',
            name: 'slot',
            style: {
              flexShrink: 0,
              width: '64px',
              height: '64px',
              overflow: 'hidden',
            },
            event: {
              click: {
                __TYPE__: 4,
                code: `function(e) {this.methods.onClick.call(this, 'photo'); this.methods.inSightSdkClick.call(this, e);
                this.methods.bridges.sendCustomLog({
                  label: "photo",
                  extra: {
                    page: this.props.page,
                  },
                });
                }`,
              },
            },
            props: {
              slotName: 'thumb',
            },
          },
          {
            id: '',
            name: 'view',
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
              width: '0px',
              height: '64px',
              margin: '0px 0px 0px 8px',
              padding: '2px 0px 0px 0px',
            },
            children: [
              {
                id: '',
                name: 'view',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: '22px',
                  overflowY: 'visible',
                },
                children: [
                  {
                    id: '',
                    name: 'slot',
                    style: {
                      flexGrow: 1,
                      width: '0px',
                      height: '22px',
                      overflowY: 'visible',
                    },
                    event: {
                      click: {
                        __TYPE__: 4,
                        code: `function(e) {this.methods.onClick.call(this, 'title'); this.methods.inSightSdkClick.call(this, e);
                        this.methods.bridges.sendCustomLog({
                          label: "title",
                          extra: {
                            page: this.props.page,
                          },
                        });
                        }`,
                      },
                    },
                    props: {
                      slotName: 'title',
                    },
                  },
                  {
                    id: 'view-container',
                    name: 'view',
                    style: {
                      padding: '3px',
                      width: '24px',
                      height: '24px',
                      alignSelf: 'center',
                    },
                    event: {
                      click: {
                        __TYPE__: 4,
                        code: `
                          function click(e) {
                            if (!this.data.exchangeTimer) {
                              var _this = this;
                               var timer =  this.methods.setTimeout(function () {
                                 _this.methods.callJSB(
                                  "startFoldButton",
                                  {
                                    data: {
                                      animate_delay: 460
                                    }
                                  },
                                  function () {
                                     _this.methods.setData({
                                      exchangeTimer: null
                                    });
                                  }
                                );
                              }, 120);

                              
                              console.info('隐藏页面->执行隐藏动画');
                              this.methods.startHideAnimate.call(this);
                              this.methods.bridges.sendAdLog({
                                  data: {
                                    tag: 'draw_ad',
                                    label: 'otherclick',
                                    extParam: {
                                      refer: 'change',
                                    },
                                  }
                                });
                                this.methods.bridges.sendCustomLog({
                                  label: "change",
                                  extra: {
                                    page: this.props.page,
                                  },
                                });
                              
                               this.methods.setTimeout(function () {
                                 _this.methods.setData({
                                  exchangeTimer: timer
                                });
                              }, 0);

                              
                              this.methods.inSightSdkClick.call(this, e);
                            }
                          }
                        `,
                      },
                    },
                    children: [
                      {
                        id: 'image_1',
                        name: 'image',
                        style: {
                          __TYPE__: 4,
                          code: `Object.assign({width: '100%', height: '100%', animationFillMode: 'forwards', animationDuration: '380ms', animationTimingFunction: "cubic-bezier(.4, 0, .2, 1)",}, this.data.exchangeAnimateStyle)`,
                        },
                        props: {
                          src: {
                            __TYPE__: 1,
                            path: ['exchange_icon'],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              // ios button slot
              {
                id: '',
                name: 'slot',
                $if: {
                  __TYPE__: 4,
                  code: `this.props.appInfo.device_platform === 'iphone'`,
                },
                style: {
                  width: '100%',
                  height: '32px',
                },
                event: {
                  click: {
                    __TYPE__: 4,
                    code: `function(e) {this.methods.onClick.call(this, 'button', 'action'); this.methods.inSightSdkClick.call(this, e)
                     this.methods.bridges.sendCustomLog({
                      label: "button",
                      extra: {
                        page: this.props.page,
                      },
                    });
                    }`,
                  },
                },
                props: {
                  slotName: 'button',
                },
              },
              // 安卓button slot
              {
                id: '',
                name: 'slot',
                $if: {
                  __TYPE__: 4,
                  code: `this.props.appInfo.device_platform !== 'iphone'`,
                },
                style: {
                  width: '100%',
                  height: '32px',
                },
                props: {
                  slotName: 'button',
                },
              },
            ],
          },
        ],
      },
      // card
      {
        id: '',
        name: 'view',
        style: {
          __TYPE__: 4,
          code: `Object.assign({width: '100%', height: '72px', padding: '14px 6px', backgroundColor: 'rgba(0, 0, 0, 0.34)', borderRadius: '4px', animationDuration: '500ms', animationTimingFunction: 'cubic-bezier(.4, 0, .2, 1)', animationFillMode: "forwards"}, this.data.cardAnimateStyle)`,
        },
        event: {
          click: {
            __TYPE__: 4,
            code: `function(e) {this.methods.onClick.call(this, 'support_area'); this.methods.inSightSdkClick.call(this, e)
            this.methods.bridges.sendCustomLog({
                label: "support_area",
                extra: {
                  page: this.props.page,
                },
              });
            }`,
          },
        },
        children: [
          {
            id: '',
            name: 'slot',
            style: {
              flexGrow: 1,
              width: '100%',
              height: '48px',
            },
            props: {
              slotName: 'desc',
            },
          },
        ],
      },
    ],
  },
};

export default layout;
