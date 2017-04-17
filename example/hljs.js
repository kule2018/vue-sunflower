import Hljs from "highlightjs/highlight.pack.min";
import "./code-theme.css";

let hljs = {};
hljs.install = (Vue) => {
  Vue.directive('hljs', {
    bind: el => {
      let blocks = el.querySelectorAll("pre code");
      if (blocks.length > 0) {
        for (let i in blocks) {
          return Hljs.highlightBlock(blocks[i])
        }
      }
    }
  });
};

export default hljs;