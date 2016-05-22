(function (window, document, $, undefined) {
  'use strict';
  // place entire program inside of this closure

// $('.controls div').click(function() {
//   $(this).hide();
// });

$('.button-download').click(function() {
  var button = $(this);
  $(this).hide();
  $(this).next('.speed').show();
  $(this).parent().siblings('.progress').addClass('in-progress');
  $(this).parent().siblings('.alt-controls').addClass('show');
  setTimeout(function() {
    button.siblings('.speed').html('Complete');
    button.parent().siblings('.alt-controls').remove();
    button.parent().siblings('.progress').addClass('complete');
  }, 3000);
});

$('.button-cog').click(function() {
  var more = $(this).parent().siblings('.more');
  if (more.hasClass('more-show')) {
    more.removeClass('more-show');
  }
  else {
    more.addClass('more-show');
  }
});

// End Document Ready
})(window, document, jQuery);