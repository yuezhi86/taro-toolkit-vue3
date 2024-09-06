export function copy() {
  return [
    { from: 'src/libs/vant-custom/wxs', to: 'dist/libs/vant-custom/wxs' },
    {
      from: 'src/libs/vant-custom/common/style',
      to: 'dist/libs/vant-custom/common/style'
    },
    {
      from: 'src/libs/vant-custom/common/index.wxss',
      to: 'dist/libs/vant-custom/common/index.wxss'
    }
  ];
}
