(function(){

  if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ //It's not a phone
    $(window).scroll(function(){

      var scroll = $(this).scrollTop();

      //Navbar effect

      var wHeight = $(window).height();
      if(scroll > wHeight*0.4){
        $('.navbar').addClass('affix');
      }
      else{
        $('.navbar').removeClass('affix');
      }

      //Parallax Header
        $('.header-content').css({
          'transform' : 'translate(0px, '+ scroll/3 + '%)'
        });
    })//End scroll
  }
  //Center the footer
  var footerCentered =function(){
    var footerWidth = $('.footer-content').outerWidth();
    var footerHeight = $('.footer-content').outerHeight();
    $('.footer-content').css({
      'left':'calc(50% - ' + footerWidth/2 + 'px)'
    });
    $('footer').css({
      'height' : footerHeight + 20 + 'px'
    });
  }
  $(window).ready(footerCentered);
  $(window).resize(footerCentered);

})();
