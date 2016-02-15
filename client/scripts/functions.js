(function (){

  if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ //It's not a phone
    $(window).scroll(function(){

      var scroll = $(this).scrollTop();

      var headerHeight = $('header').outerHeight();

      //Navbar effect
      if(scroll){
        $('.navbar').addClass('affix');
      }
      else{
        $('.navbar').removeClass('affix');
      }

      // Parallax Header
         $('.header-content').css({
           'transform' : 'translate(0px, '+ scroll/5 + '%)'
         });
    }) //End scroll
  }
})();
