(function (window, document, $, undefined) {
  'use strict';
  // place entire program inside of this closure

  // Browser Update
  var $buoop = {vs:{i:8,f:15,o:12.1,s:5.1}};
  $buoop.ol = window.onload;
  window.onload=function() {
    try {if ($buoop.ol) $buoop.ol();}catch (e) {}
    var e = document.createElement('script');
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src', '//browser-update.org/update.js');
    document.body.appendChild(e);
  };

// End Document Ready
})(window, document, jQuery);