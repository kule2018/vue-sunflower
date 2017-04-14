import Hljs from "highlightjs/highlight.pack.min"
let hljs = {};
hljs.install = (Vue) => {
  Vue.directive('hljs', {
    bind: el => {
      let blocks = el.querySelectorAll("pre code");
      for (let i in blocks) {
        return Hljs.highlightBlock(blocks[i])
      }
    }
  });
};

export default hljs;