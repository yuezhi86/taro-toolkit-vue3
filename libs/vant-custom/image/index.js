import { VantComponent } from '../common/component';
import { button } from '../mixins/button';
VantComponent({
  mixins: [button],
  classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],
  props: {
    src: {
      type: String | null,
      observer() {
        this.setData({
          error: false,
          loading: true
        });
        this.setSrc();
      }
    },
    round: Boolean,
    width: null,
    height: null,
    radius: null,
    lazyLoad: Boolean,
    useErrorSlot: Boolean,
    useLoadingSlot: Boolean,
    showMenuByLongpress: Boolean,
    fit: {
      type: String,
      value: 'fill'
    },
    showError: {
      type: Boolean,
      value: true
    },
    showLoading: {
      type: Boolean,
      value: true
    },
    rule: {
      type: String,
      value: 'resize,m_fixed,h_${h},w_${w}'
    },
    defaultImg: {
      type: String,
      value: null
    }
  },
  data: {
    error: false,
    loading: true,
    viewStyle: '',
    imgSrc: ''
  },
  created() {
    if (!this.data.src) {
      this.setData({
        error: true,
        loading: false
      });
    }
  },
  methods: {
    onLoad(event) {
      this.setData({
        loading: false
      });
      this.$emit('load', event.detail);
    },
    onError(event) {
      this.setData({
        loading: false,
        error: true
      });
      this.$emit('error', event.detail);
    },
    onClick(event) {
      this.$emit('click', event.detail);
    },
    setSrc() {
      const { width, height, rule, src, defaultImg } = this.data;

      if (!src && defaultImg) {
        this.setData({
          imgSrc: defaultImg
        });
        return;
      }

      if (width === null || height === null) {
        this.setData({
          imgSrc: src ?? ''
        });
        return;
      }

      const _rule = rule
        .replace(/\${w}/, `${parseInt(width)}`)
        .replace(/\${h}/, `${parseInt(height)}`);
      this.setData({
        imgSrc: src ? `${src}?x-oss-process=image/${_rule}` : ''
      });
    }
  }
});
