<script type="text/babel">
import ajax from './ajax';
import UploadDragger from './upload-dragger.vue';

export default {
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function() {}
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    fileList: Array,
    autoUpload: Boolean,
    listType: String
  },

  data() {
    return {
      mouseover: false
    };
  },

  methods: {
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    handleChange(ev) {
      const files = ev.target.files;

      if (!files) return;
      this.uploadFiles(files);
      this.$refs.input.value = null;
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }

      if (postFiles.length === 0) { return; }

      postFiles.forEach(rawFile => {
        if (!this.thumbnailMode || this.isImage(rawFile.type)) {
          this.onStart(rawFile);
          if (this.autoUpload) this.upload(rawFile);
        }
      });
    },
    upload(rawFile, file) {
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(processedFile => {
          if (Object.prototype.toString.call(processedFile) === '[object File]') {
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          if (file) this.onRemove(file);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        if (file) this.onRemove(file);
      }
    },
    post(rawFile) {
      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          this.onSuccess(res, rawFile);
        },
        onError: err => {
          this.onError(err, rawFile);
        }
      });
    },
    handleClick() {
      this.$refs.input.click();
    }
  },

  render(h) {
    let {
      handleClick,
      drag,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles
    } = this;
    const data = {
      class: {
        's-upload': true
      },
      on: {
        click: handleClick
      }
    };
    data.class[`s-upload--${listType}`] = true;
    return (
      <div {...data}>
        {
          drag
          ? <upload-dragger on-file={uploadFiles}>{this.$slots.default}</upload-dragger>
          : this.$slots.default
        }
        <input class="s-upload__input" type="file" ref="input" on-change={handleChange} multiple={multiple} accept={accept}></input>
      </div>
    );
  }
};
</script>
<style>
  .s-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer
  }

  .s-upload iframe {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    opacity: 0;
    filter: alpha(opacity=0)
  }

  .s-upload__input {
    display: none
  }

  .s-upload__tip {
    font-size: 12px;
    color: #8391a5;
    margin-top: 7px
  }

  .s-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top
  }

  .s-upload--picture-card i {
    font-size: 28px;
    color: #8c939d
  }

  .s-upload--picture-card:hover {
    border-color: #20a0ff;
    color: #20a0ff
  }

  .s-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden
  }

  .s-upload-dragger .s-upload__text {
    color: #97a8be;
    font-size: 14px;
    text-align: center
  }

  .s-upload-dragger .s-upload__text em {
    color: #20a0ff;
    font-style: normal
  }

  .s-upload-dragger .s-icon-upload {
    font-size: 67px;
    color: #97a8be;
    margin: 40px 0 16px;
    line-height: 50px
  }

  .s-upload-dragger+.s-upload__tip {
    text-align: center
  }

  .s-upload-dragger~.s-upload__files {
    border-top: 1px solid rgba(191,203,217,.2);
    margin-top: 7px;
    padding-top: 5px
  }

  .s-upload-dragger:hover {
    border-color: #20a0ff
  }

  .s-upload-dragger.is-dragover {
    background-color: rgba(32,159,255,.06);
    border: 2px dashed #20a0ff
  }

  .s-upload-list {
    margin: 0;
    padding: 0;
    list-style: none
  }

  .s-upload-list__item {
    transition: all .5s cubic-bezier(.55,0,.1,1);
    font-size: 14px;
    color: #48576a;
    line-height: 1.8;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    position: relative
  }

  .s-upload-list__item .s-progress-bar {
    margin-right: 0;
    padding-right: 0
  }

  .s-upload-list__item .s-progress {
    position: absolute;
    bottom: -3px;
    width: 100%
  }

  .s-upload-list__item .s-progress__text {
    position: absolute;
    top: -10px;
    right: 0
  }

  .s-upload-list__item:first-child {
    margin-top: 10px
  }

  .s-upload-list__item:hover {
    background-color: #eef1f6
  }

  .s-upload-list__item.is-success .s-upload-list__item-name:hover {
    color: #20a0ff;
    cursor: pointer
  }

  .s-upload-list__item.is-success .s-icon-close {
    display: none
  }

  .s-upload-list__item.is-success:hover .s-icon-close {
    display: inline-block;
    cursor: pointer;
    opacity: .75;
    transform: scale(.7);
    color: #48576a
  }

  .s-upload-list__item.is-success:hover .s-icon-close:hover {
    opacity: 1
  }

  .s-upload-list__item.is-success:hover .s-icon-check,.s-upload-list__item.is-success:hover .s-icon-circle-check {
    display: none
  }

  .s-upload-list__item-name {
    color: #48576a;
    display: block;
    margin-right: 40px;
    overflow: hidden;
    padding-left: 4px;
    text-overflow: ellipsis;
    transition: color .3s;
    white-space: nowrap
  }

  .s-upload-list__item-name [class^=el-icon] {
    color: #97a8be;
    margin-right: 7px;
    height: 100%;
    line-height: inherit
  }

  .s-upload-list__item-status-label {
    position: absolute;
    right: 10px;
    top: 0;
    line-height: inherit;
    color: #13ce66
  }

  .s-upload-list__item-delete {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    color: #48576a;
    display: none
  }

  .s-upload-list__item-delete:hover {
    color: #20a0ff
  }

  .s-upload-list--picture-card {
    margin: 0;
    display: inline;
    vertical-align: top
  }

  .s-upload-list--picture-card .s-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block
  }

  .s-upload-list--picture-card .s-upload-list__item-name,.s-upload-list--picture-card .s-upload-list__item:hover .s-upload-list__item-status-label {
    display: none
  }

  .s-upload-list--picture-card .s-upload-list__item-thumbnail {
    width: 100%;
    height: 100%
  }

  .s-upload-list--picture-card .s-upload-list__item-status-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2)
  }

  .s-upload-list--picture-card .s-upload-list__item-status-label i {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg) scale(.8);
    color: #fff
  }

  .s-upload-list--picture-card .s-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s
  }

  .s-upload-list--picture-card .s-upload-list__item-actions span {
    display: none;
    cursor: pointer
  }

  .s-upload-list--picture-card .s-upload-list__item-actions span+span {
    margin-left: 15px
  }

  .s-upload-list--picture-card .s-upload-list__item-actions .s-upload-list__item-delete {
    position: static;
    font-size: inherit;
    color: inherit
  }

  .s-upload-list--picture-card .s-upload-list__item-actions:hover {
    opacity: 1
  }

  .s-upload-list--picture-card .s-upload-list__item-actions:hover span {
    display: inline-block
  }

  .s-upload-list--picture-card .s-progress {
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    bottom: auto;
    width: 126px
  }

  .s-upload-list--picture-card .s-progress .s-progress__text {
    top: 50%
  }

  .s-upload-list--picture .s-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px 10px 10px 90px;
    height: 92px
  }

  .s-upload-list--picture .s-upload-list__item:hover .s-upload-list__item-status-label {
    background: transparent;
    box-shadow: none;
    top: -2px;
    right: -12px
  }

  .s-upload-list--picture .s-upload-list__item:hover .s-upload-list__item-status-label .s-icon-close {
    transform: rotate(45deg) scale(.7)
  }

  .s-upload-list--picture .s-upload-list__item.is-success .s-upload-list__item-name {
    line-height: 70px;
    margin-top: 0
  }

  .s-upload-list--picture .s-upload-list__item.is-success .s-upload-list__item-name i {
    display: none
  }

  .s-upload-list--picture .s-upload-list__item-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    float: left;
    margin-left: -80px
  }

  .s-upload-list--picture .s-upload-list__item-name {
    display: block;
    margin-top: 20px
  }

  .s-upload-list--picture .s-upload-list__item-name i {
    font-size: 70px;
    line-height: 1;
    position: absolute;
    left: 9px;
    top: 10px
  }

  .s-upload-list--picture .s-upload-list__item-status-label {
    position: absolute;
    right: -17px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 1px 1px #ccc
  }

  .s-upload-list--picture .s-upload-list__item-status-label i {
    font-size: 12px;
    margin-top: 12px;
    transform: rotate(-45deg) scale(.8);
    color: #fff
  }

  .s-upload-list--picture .s-progress {
    position: static
  }

  .s-upload-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
    cursor: default
  }

  .s-upload-cover img {
    display: block;
    width: 100%;
    height: 100%
  }

  .s-upload-cover+.s-upload__inner {
    opacity: 0;
    position: relative;
    z-index: 1
  }

  .s-upload-cover__label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2)
  }

  .s-upload-cover__label i {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg) scale(.8);
    color: #fff
  }

  .s-upload-cover__progress {
    display: inline-block;
    vertical-align: middle;
    position: static;
    width: 243px
  }

  .s-upload-cover__progress+.s-upload__inner {
    opacity: 0
  }

  .s-upload-cover__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
  }

  .s-upload-cover__interact {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.72);
    text-align: center
  }

  .s-upload-cover__interact .btn {
    display: inline-block;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    vertical-align: middle;
    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
    margin-top: 60px
  }

  .s-upload-cover__interact .btn i {
    margin-top: 0
  }

  .s-upload-cover__interact .btn span {
    opacity: 0;
    transition: opacity .15s linear
  }

  .s-upload-cover__interact .btn:not(:first-child) {
    margin-left: 35px
  }

  .s-upload-cover__interact .btn:hover {
    transform: translateY(-13px)
  }

  .s-upload-cover__interact .btn:hover span {
    opacity: 1
  }

  .s-upload-cover__interact .btn i {
    color: #fff;
    display: block;
    font-size: 24px;
    line-height: inherit;
    margin: 0 auto 5px
  }

  .s-upload-cover__title {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    height: 36px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    text-align: left;
    padding: 0 10px;
    margin: 0;
    line-height: 36px;
    font-size: 14px;
    color: #48576a
  }
</style>
