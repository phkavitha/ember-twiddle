import Ember from 'ember';
import ResizeMixin from 'ember-twiddle/lib/resize-mixin';

export default Ember.Component.extend(ResizeMixin, {
  iframeId: 'dummy-content-iframe',

  didReceiveAttrs: function() {
    if(!this.element) {
      return;
    }

    if(this.element.firstElementChild) {
      this.element.removeChild(this.element.firstElementChild);
    }

    let ifrm = document.createElement('iframe');
    ifrm.id = this.iframeId;
    let supportsSrcDoc = ('srcdoc' in ifrm);

    if (!Ember.testing && supportsSrcDoc) {
      ifrm.sandbox = 'allow-scripts allow-forms';
      ifrm.srcdoc = this.get('html');
    }

    this.element.appendChild(ifrm);

    if(!supportsSrcDoc && !Ember.testing) {
      ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
      ifrm.document.open();
      ifrm.document.write('<p>Your browser doesn\'t support the <code>srcdoc</code> attribute for iframes. Ember Twiddle needs this to run safely.</p><p>Please use the latest version of Chrome, Safari or Firefox.</p><p>More information: <a href="https://github.com/ember-cli/ember-twiddle#browser-support">https://github.com/ember-cli/ember-twiddle#browser-support</a>');
      ifrm.document.close();
    }

    if (Ember.testing) {
      ifrm = ifrm.contentWindow;
      ifrm.document.open();
      ifrm.document.write(this.get('html'));
      ifrm.document.close();
    }
  },

  didResize: function () {
    let offset = this.$().offset(), width = this.$().width(),
      height = this.$().height();

    Em.$('#demo-app').css({
      top:    offset.top,
      left:   offset.left,
      width:  width,
      height: height
    });
  }.on('didInsertElement')
});
