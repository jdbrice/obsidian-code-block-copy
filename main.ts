import './styles.scss'
import { App, Plugin, PluginManifest, MarkdownView  } from "obsidian";

const excludeLangs = [ 
  "todoist"
];


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
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {

      var pre = codeBlock.parentNode;
      
      // check for excluded langs
      for ( let lang of excludeLangs ){
        if (pre.classList.contains( `language-${lang}` ))
          return;
      }

      // Dont add more than once
      if (pre.parentNode.classList.contains('has-copy-button')) {
        return;
      }
      pre.parentNode.classList.add( 'has-copy-button' );

        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';
  
        button.addEventListener('click', function () {
            clipboard.writeText(codeBlock.innerText).then(function () {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur();
  
                button.innerText = 'copied!';
  
                setTimeout(function () {
                    button.innerText = 'copy';
                }, 2000);
            }, function (error) {
                button.innerText = 'Error';
            });
        });
  
        pre.appendChild(button);
        
    });
  }
  
}