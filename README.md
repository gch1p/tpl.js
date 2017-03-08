# tpl.js

Tiny client-side JavaScript template library with transparent string escaping. 

Define your template as a function that accepts an object with a data you want to render and returns HTML markup:

```
function myTemplate(data) {
  return '<div>'+data.unsafeFoo+'</div>';
}
```

Then use `tpl` function, that returns a `DocumentFragment`.
```
var frag = tpl(myTemplate, {
  unsafeFoo: '<script>alert("bar!")</script>'
});
```

You can also ask `tpl` function to return HTML markup by providing `asHTML` option: 
```
var html = tpl(myTemplate, { /* your data */ }, { asHTML: true });
```

All input is transparently escaped by default, but you can access original unescaped object in templates this way:

```
function myTemplate(data) {
  return '<div>'+data.__target.unsafeFoo+'</div>';
}
