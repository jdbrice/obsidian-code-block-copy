import './styles.scss'
import { App, Plugin, PluginManifest, MarkdownView  } from "obsidian";

const excludeLangs = [ 
  "todoist"
];

const svgCopy = '<svg height="16" width="16" viewBox="0 0 16 16" version="1.1" data-view-component="true" class="copy"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>';
const svgSuccess = '<svg height="16" width="16" viewBox="0 0 16 16" version="1.1" data-view-component="true" class="copy-success"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';

export default class CMSyntaxHighlightPlugin extends Plugin {

  constructor(app: App, pluginManifest: PluginManifest) {
    super(app, pluginManifest);
  }
  // all I need to do is import the modes.
  async onload() {

    this.registerInterval(
      window.setInterval(this.injectButtons.bind(this), 1000)
    );


  }

  injectButtons() {
    this.addCopyButtons(navigator.clipboard);
  }

  addCopyButtons(clipboard:any) {
    document.querySelectorAll('pre > code').forEach(function (codeBlock: HTMLElement) {

      const pre = codeBlock.parentNode as HTMLPreElement;
      
      // check for excluded langs
      for ( let lang of excludeLangs ){
        if (pre.classList.contains(`language-${lang}`))
          return;
      }

      const parent = pre.parentNode as HTMLDivElement;

      // don't add more than once
      if (parent.classList.contains('has-copy-button')) {
        return;
      }

      parent.classList.add('has-copy-button');

      const button = document.createElement('div');
      button.className = 'copy-code-button';
      button.setAttribute('aria-label', 'Copy');
      button.innerHTML = svgCopy;

      button.addEventListener('click', function () {
          clipboard.writeText(codeBlock.innerText).then(function () {
              /* Chrome doesn't seem to blur automatically,
                  leaving the button in a focused state. */
              button.blur();

              button.innerHTML = svgSuccess;

              setTimeout(function () {
                  button.innerHTML = svgCopy;
              }, 2000);
          }, function () {
              button.innerText = 'An error occurred!';
          });
      });
  
        pre.appendChild(button);
        
    });
  }
  
}