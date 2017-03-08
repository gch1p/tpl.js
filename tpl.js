(function(window) {

var NATIVE_PROXY = !('Proxy' in window);

function proxifyObject(obj) {
  if (NATIVE_PROXY) {
    var p = new Proxy(obj, {
      get: function(target, prop, receiver) {
        if (prop === '__target') {
          return target;
        }
        return getter(target, prop);
      }
    });
    p.__target = obj;
    p.__isProxy = true;
    return p;
  } else {
    return new ObjectProxy(obj);
  }
}

function getter(target, prop) {
  if (!(prop in target)) {
    return undefined;
  }

  var value = target[prop];
  if (typeof(value) == 'object') {
    return proxifyObject(value);
  }
  if (typeof(value) == 'string') {
    return htmlescape(value);
  }
  return value;
}

//
// Emulate Proxy in old browsers
//
if (!NATIVE_PROXY) {
  function ObjectProxy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      this.length = obj.length;
      for (var i = 0; i < obj.length; i++) {
        Object.defineProperty(this, i, {
          get: this.__get.bind(this, i)
        })
      }
    } else if (typeof(obj) == 'object') {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          Object.defineProperty(this, prop, {
            get: this.__get.bind(this, prop)
          })
        }
      }
    }
    this.__target = obj;
    this.__isProxy = true;
  }
  ObjectProxy.prototype.__get = function(prop) {
    return getter(this.__target, prop);
  };
  ObjectProxy.prototype.valueOf = function() {
    return this.__target;
  };
}

//
// HTML escaping
//
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

//
// Main function
//
window.tpl = function tpl(f, vars, opts) {
  opts = opts || {};

  var html = f.call(f, !vars.__isProxy ? proxifyObject(vars) : vars);
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
};

})(window);
