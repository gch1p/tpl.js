(function(window) {

function tpl(f, vars, opts) {
  opts = opts || {};

  var html = f.call(f, new ObjectProxy(vars));
  if (opts.asHTML) {
    return html;
  }

  var div = document.createElement('div');
  var frag = document.createDocumentFragment();

  div.innerHTML = html;
  for (var i = 0; i < div.children.length; i++) {
    frag.appendChild(div.children[i]);
  }
  return frag;
}

function ObjectProxy(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      Object.defineProperty(this, prop, {
        get: this.__get.bind(this, prop)
      })
    }
  }
  this.target = obj;
}
ObjectProxy.prototype.__get = function(prop, raw) {
  if (!(prop in this.target)) {
    return undefined
  }

  var value = this.target[prop];
  if (raw) {
    return value;
  }
  if (typeof value == 'object') {
    return new ObjectProxy(value);
  }
  if (typeof value == 'string') {
    return htmlescape(value);
  }
  return value;
};

var HTML_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};
function htmlescape(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function(s) {
    return HTML_ENTITY_MAP[s];
  });
}

window.tpl = tpl;

})(window);
