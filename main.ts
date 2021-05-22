import './styles.scss'
import { App, Plugin, PluginManifest, MarkdownView  } from "obsidian";

const excludeLangs = [ 
  "todoist"
];

const svgCopy = '<svg viewBox="0 0 100 100" width="20" height="20" class="documents"><path fill="currentColor" stroke="currentColor" d="M74,4c-0.1,0-0.2,0-0.3,0H40v11.5l4,4V8h28v20h20v48H64v4h32V26.3c0-0.2,0-0.4,0-0.6v-0.5l-0.4-0.4 c-0.1-0.1-0.2-0.3-0.4-0.4c0,0,0,0,0,0L75.6,4.8c-0.1-0.1-0.2-0.3-0.4-0.4L74.8,4h-0.5C74.2,4,74.1,4,74,4L74,4z M76,10.8L89.2,24 H76V10.8z M38,20c-0.1,0-0.2,0-0.3,0H4v76h56V42.3c0-0.2,0-0.4,0-0.6v-0.5l-0.4-0.4c-0.1-0.1-0.2-0.3-0.4-0.4L39.6,20.7 c-0.1-0.1-0.2-0.3-0.4-0.4L38.8,20h-0.5C38.2,20,38.1,20,38,20z M8,24h28v20h20v48H8L8,24z M40,26.8L53.2,40H40V26.8z M60.5,36 l4,4H84v-4L60.5,36z M64,48v4h12v-4H64z M16,52v4h32v-4H16z M64,60v4h20v-4H64z M16,64v4h24v-4H16z M16,76v4h32v-4H16z"></path></svg>';


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
      button.setAttribute('aria-label', 'Copy code block');
      button.innerHTML = svgCopy;

      button.addEventListener('click', function () {
          clipboard.writeText(codeBlock.innerText).then(function () {
              /* Chrome doesn't seem to blur automatically,
                  leaving the button in a focused state. */
              button.blur();

              button.innerText = 'Code has been copied!';

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