import layout_3 from '../layout/3_layout';
import thumb from '../component/thumb';
import title from '../component/title';
import subSlogan from '../component/slogan';
import downloadButton from '../component/button_download';
import tag from '../component/tag';
import praise from '../component/praise';

const application: UniDSL.Legacy.Origin.Application = {
  id: '1_download_page',
  name: '下载-001',
  components: {
    layout_3,
    thumb,
    title,
    downloadButton,
    tag,
    praise,
    subSlogan,
  },
  data: {},
  methods: {
    ceil: {
      __TYPE__: 4,
      code: `
        function(score) {
          console.info('score', score);
          const length = score.length;
          if(length <= 3) {
            return score;
          }
          const newScore = String(Number(score.slice(0, 3))+0.1).slice(0, 3);
          console.info('return score', newScore)
          return newScore;
        }
      `,
    },
  },
  page: {
    id: '1',
    name: 'layout_3',
    style: {},
    props: {
      appInfo: {
        __TYPE__: 1,
        path: ['appInfo'],
      },
      page: '1_download_page',
    },
    slots: {
      thumb: [
        {
          id: 'thumb',
          name: 'thumb',
          style: {
            width: '100%',
            height: '100%',
          },
          props: {
            src: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'image_url'],
            },
          },
        },
      ],
      title: [
        {
          id: 'title',
          name: 'title',
          style: {
            overflowY: 'visible',
          },
          props: {
            innerText: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'product_name'],
            },
          },
        },
      ],
      button: [
        {
          id: 'action-download-button',
          name: 'downloadButton',
          style: {
            width: '100%',
            height: '100%',
          },
          props: {
            button_background_color: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'button_background_color'],
            },
            button_text: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'button_text'],
            },
            appData: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'app_data'],
            },
            adInfo: {
              __TYPE__: 1,
              path: ['adInfo'],
            },
            open_url: {
              __TYPE__: 1,
              path: ['__globalProps', 'lynx_raw_data', 'open_url'],
            },
            appInfo: {
              __TYPE__: 1,
              path: ['appInfo'],
            },
          },
        },
      ],
      desc: [
        {
          id: 'left-label-view',
          name: 'view',
          style: {
            width: '57px',
            height: '40px',
            justifyContent: 'space-between',
            flexDirection: 'column',
            overflow: 'visible',
          },
          children: [
            {
              id: 'view-text',
              name: 'view',
              style: {
                justifyContent: 'center',
              },
              children: [
                {
                  id: 'pingfen',
                  name: 'text',
                  style: {
                    margin: '0px 2px 4px 0px',
                    fontSize: '10px',
                    fontWeight: 500,
                    lineHeight: '14px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    alignSelf: 'flex-end',
                  },
                  props: {
                    innerText: '评分',
                  },
                },
                {
                  id: 'score',
                  name: 'text',
                  style: {
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: '22px',
                    lineHeight: '26px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                  props: {
                    innerText: {
                      __TYPE__: 4,
                      code: `this.methods.ceil(this.data.__globalProps.lynx_raw_data.mixed_area_info.app_like)`,
                    },
                  },
                },
              ],
            },
            {
              id: 'praise',
              name: 'praise',
              style: {
                overflow: 'visible',
                justifyContent: 'center',
              },
              props: {
                size: 8,
                score: {
                  __TYPE__: 4,
                  code: `this.methods.ceil(this.data.__globalProps.lynx_raw_data.mixed_area_info.app_like)`,
                },
              },
            },
          ],
        },
        {
          id: 'split-line',
          name: 'view',
          style: {
            width: '1px',
            height: '56px',
            margin: '0px 8px 0px 6px',
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 0.01%, rgba(255, 255, 255, 0.3) 51.79%, rgba(255, 255, 255, 0) 100%)',
          },
        },
        // 右边
        {
          id: '',
          name: 'view',
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1,
            width: '0px',
            height: '42px',
          },
          children: [
            {
              id: 'subSlogan',
              name: 'subSlogan',
              style: {
                width: '100%',
                height: '18px',
              },
              props: {
                product_slogan: {
                  __TYPE__: 1,
                  path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'product_slogan'],
                },
              },
            },
            {
              id: 'label-view',
              name: 'tag',
              style: {
                width: '100%',
                height: 'auto',
                minHeight: '16px',
              },
              props: {
                color: 'rgba(255, 255, 255, 0.75)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                size: {
                  __TYPE__: 4,
                  code: `this.data.__globalProps.screenWidth >= 378? 268-84 : 268*this.data.__globalProps.screenWidth/387-84`,
                },
                tags: {
                  __TYPE__: 1,
                  path: ['__globalProps', 'lynx_raw_data', 'mixed_area_info', 'product_tags'],
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default application;
