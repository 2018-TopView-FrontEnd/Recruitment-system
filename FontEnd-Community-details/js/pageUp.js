window.onload = function(){
  var oBox = document.getElementById('box');
  var oPag = document.querySelector('#box .pag1');
  var oFront = document.querySelector('#box .pag1 .front');
  var oBack = document.querySelector('#box .pag1 .back');
  var oPag2 = document.querySelector('#box .pag2');

  var iNow=0;
  var bReady=true;
  oBox.onclick = function(){
    if(bReady==false) return;
    bReady=false;

    iNow++;
    oPag.style.transition = '1s all ease';
    oPag.style.transform = 'rotateY(-180deg)';

    oPag.addEventListener('transitionend',function(){
      oPag.style.transition = 'none';
      oPag.style.transform = 'rotateY(0deg)';

      oFront.style.backgroundImage = oBox.style.backgroundImage = 'url(../image/pageUp/'+iNow%5+'.jpg)';  //5有几张banner就%几
      oBack.style.backgroundImage = oPag2.style.backgroundImage = 'url(../image/pageUp/'+(iNow+1)%5+'.jpg)';
      document.querySelector('.shodow li').innerHTML =  document.querySelector('.act' + iNow%5).innerHTML;
      bReady=true;
    },false);
  }
}