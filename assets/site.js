(function(){
  var d=document, b=d.body;
  // Header shadow
  var h=d.querySelector('.site-header');
  function onS(){ if(h) h.classList.toggle('scrolled', window.scrollY>8); }
  window.addEventListener('scroll',onS,{passive:true}); onS();
  // Mobile nav
  var t=d.querySelector('.nav-toggle');
  if(t) t.addEventListener('click',function(){ var o=b.classList.toggle('nav-open'); t.setAttribute('aria-expanded',o?'true':'false'); });
  d.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('nav-open');});});
  // Reveal
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });},{rootMargin:'0px 0px -8% 0px'});
    d.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else d.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  // YouTube: erst nach Klick laden (Datenschutz)
  d.querySelectorAll('.video button[data-yt]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var id=btn.getAttribute('data-yt'), f=d.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1';
      f.title=btn.getAttribute('aria-label')||'Video';
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen=true;
      btn.parentNode.replaceChild(f,btn);
    });
  });
  // Modals
  d.querySelectorAll('[data-modal]').forEach(function(a){
    a.addEventListener('click',function(e){
      var m=d.getElementById(a.getAttribute('data-modal'));
      if(m && m.showModal){ e.preventDefault(); m.showModal(); var i=m.querySelector('input[type=email]'); if(i) setTimeout(function(){i.focus();},60); }
    });
  });
  d.querySelectorAll('dialog.modal').forEach(function(m){
    m.addEventListener('click',function(e){ if(e.target===m) m.close(); });
    var x=m.querySelector('.x'); if(x) x.addEventListener('click',function(){m.close();});
  });
  // Formulare
  var CFG=window.FORMS||{};
  d.querySelectorAll('form[data-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      var key=f.getAttribute('data-form'), c=CFG[key], msg=f.querySelector('.form-msg');
      if(f.querySelector('.hp input') && f.querySelector('.hp input').value){ e.preventDefault(); return; }
      if(!c || !c.action){
        e.preventDefault();
        if(msg){ msg.innerHTML='Die Online-Anmeldung ist in Kürze wieder verfügbar. Schreib uns gern direkt an <a href="mailto:service@founder.de">service@founder.de</a>.'; msg.classList.add('show'); }
        return;
      }
      if(c.type==='mailto'){
        e.preventDefault();
        if(!f.reportValidity()) return;
        var lines=[]; f.querySelectorAll('input,textarea').forEach(function(i){ if(i.name && i.name!=='website' && i.value) lines.push((i.closest('label')?i.closest('label').firstChild.textContent.trim():i.name)+': '+i.value); });
        location.href='mailto:'+c.action+'?subject='+encodeURIComponent(c.subject||'Anfrage über founder.de')+'&body='+encodeURIComponent(lines.join('\n'));
        if(msg){ msg.innerHTML='Dein E-Mail-Programm öffnet sich mit deiner Anfrage. Bitte dort auf „Senden“ klicken. Alternativ: <a href="mailto:'+c.action+'">'+c.action+'</a>'; msg.classList.add('show'); }
        return;
      }
      if(c.type==='post'){ f.action=c.action; f.method='post'; return; }
      if(c.type==='redirect'){ e.preventDefault(); location.href=c.action; }
    });
  });
})();
