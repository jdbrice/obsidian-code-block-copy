import './styles.scss'
import { App, Notice, Plugin, PluginManifest } from "obsidian";

const excludeLangs = [
  "todoist"
];
const copyText = 'Copy'
const copyOver = 'Copied!'
const DEFAULT_LANG = 'language-text'
const CODE_BLOCK_WRAP = 'code-block-wrap'
const LAN_REG = /^language-/
export default class CMSyntaxHighlightPlugin extends Plugin {

  constructor(app: App, pluginManifest: PluginManifest) {
    super(app, pluginManifest);
  }

  async onload () {
    this.registerInterval(
      window.setInterval(this.reloadButtons.bind(this), 1000)
    );

  }
  reloadButtons () {
    document.querySelectorAll('pre > code').forEach(function (code: Element) {
      let lang = 'text'
      let pre: Element = code.parentElement
      const codeClassList = code.classList
      const preClassList = pre.classList
      for (let lang of excludeLangs) {
        if (codeClassList.length === 0) {
          preClassList.add(DEFAULT_LANG)
        }
        if (preClassList.contains(`language-${lang}`))
          return;
      }
      // Ignore already has copy button 
      if (pre.querySelector('button.code-block-copy-button')) {
        return;
      }
      // let pre be position: relative;
      preClassList.add(CODE_BLOCK_WRAP)
      code.classList.forEach((value, key, parent) => {
        if (LAN_REG.test(value)) {
          lang = value.replace('language-', '')
        }
      })
      // create lang tip in left
      let langTip = document.createElement('span')
      langTip.className = 'code-block-lang-tip'
      langTip.innerText = lang
      // create copy button in right
      let copyButton = document.createElement('button');
      copyButton.className = 'code-block-copy-button';
      copyButton.type = 'button';
      copyButton.innerText = copyText;

      copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent).then(function () {
          /* Chrome doesn't seem to blur automatically,
             leaving the button in a focused state. */
          copyButton.blur();
          copyButton.innerText = copyOver;

          setTimeout(function () {
            copyButton.innerText = copyText;
          }, 1500);
        }, function (error: Error) {
          copyButton.innerText = 'Copy Error!';
          new Notice('An error occurred,' + error.message)
        });
      });
      pre.appendChild(copyButton);
      pre.appendChild(langTip)
    })
  }
}