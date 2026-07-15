/* 5th Odisha Mining & Infrastructure International Expo 2027 — shared JS */
(function(){
  'use strict';

  /* mobile nav */
  var burger=document.querySelector('.burger'),links=document.querySelector('.nlinks');
  if(burger&&links){
    burger.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');});});
  }

  /* nav shadow on scroll */
  var nav=document.querySelector('nav.site');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>10);},{passive:true});}

  /* countdown to 07 Jan 2027, 10:00 IST */
  var cd=document.getElementById('cd');
  if(cd){
    var ch=document.getElementById('ch'),cm=document.getElementById('cm'),cs=document.getElementById('cs');
    var target=new Date('2027-01-07T10:00:00+05:30').getTime();
    var tick=function(){
      var d=Math.max(0,target-Date.now());
      var day=Math.floor(d/864e5);d-=day*864e5;
      var h=Math.floor(d/36e5);d-=h*36e5;
      var m=Math.floor(d/6e4);d-=m*6e4;
      var s=Math.floor(d/1e3);
      cd.textContent=String(day).padStart(3,'0');
      ch.textContent=String(h).padStart(2,'0');
      cm.textContent=String(m).padStart(2,'0');
      cs.textContent=String(s).padStart(2,'0');
    };
    tick();setInterval(tick,1000);
  }

  /* duplicate marquee tracks for seamless loop */
  document.querySelectorAll('.logo-track, .ticker-track').forEach(function(t){t.innerHTML+=t.innerHTML;});

  /* animated number counters */
  function animateCount(el){
    var end=parseFloat(el.dataset.count),suffix=el.dataset.suffix||'',dur=1400,t0=null;
    function step(t){
      if(!t0)t0=t;
      var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
      el.textContent=Math.round(end*e).toLocaleString('en-IN')+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* scroll reveal + triggered animations */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.classList.add('in');
      e.target.querySelectorAll('.mbar i').forEach(function(b){b.style.width=b.dataset.w+'%';});
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      if(e.target.hasAttribute('data-count'))animateCount(e.target);
      io.unobserve(e.target);
    });
  },{threshold:.15});
  document.querySelectorAll('.rev').forEach(function(el){io.observe(el);});

  /* toast helper (global) */
  window.showToast=function(msg,ms){
    var t=document.getElementById('toast');
    if(!t)return;
    t.textContent=msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer=setTimeout(function(){t.classList.remove('show');},ms||3200);
  };

  /* contact form -> inline validation + mailto fallback (no backend required) */
  var f=document.getElementById('contactForm');
  if(f){
    var fields=[f.name,f.email,f.message];
    fields.forEach(function(el){
      el.addEventListener('blur',function(){validateField(el);});
    });
    function validateField(el){
      var field=el.closest('.field');
      if(!field)return true;
      var valid=el.checkValidity();
      field.classList.toggle('invalid',!valid);
      return valid;
    }
  f.addEventListener("submit", async function (ev) {
    ev.preventDefault();

    if (f.company_website && f.company_website.value) {
        return;
    }

    var allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
        showToast("Please fill in all fields correctly.");
        return;
    }

    const data = {
        fullName: f.name.value,
        company: f.company ? f.company.value : "",
        email: f.email.value,
        phone: f.phone ? f.phone.value : "",
        designation: f.designation ? f.designation.value : "",
        country: f.country ? f.country.value : "",
        interestType: "Contact Enquiry",
        message: f.message.value
    };

    try {

        showToast("Submitting...");

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showToast("Thank you! Your enquiry has been submitted.");
            f.reset();
        } else {
            showToast(result.message || "Submission failed.");
        }

    } catch (err) {
        console.error(err);
        showToast("Server Error.");
    }
});
  }
})();

/* v3: quick-contact widget, filters, lightbox nav, venue popovers */
(function(){
  'use strict';

  /* quick-contact floating menu */
  var qc=document.getElementById('qc'),qcToggle=document.getElementById('qcToggle');
  if(qc&&qcToggle){
    qcToggle.addEventListener('click',function(e){
      e.stopPropagation();
      var open=qc.classList.toggle('open');
      qcToggle.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',function(e){
      if(qc.classList.contains('open')&&!qc.contains(e.target)){
        qc.classList.remove('open');qcToggle.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){qc.classList.remove('open');qcToggle.setAttribute('aria-expanded','false');}
    });
  }

  /* generic live filter for checklists / category grids */
  document.querySelectorAll('[data-filter-for]').forEach(function(box){
    var input=box.querySelector('input');
    var targetSel=box.dataset.filterFor;
    var items=Array.prototype.slice.call(document.querySelectorAll(targetSel));
    var countEl=box.querySelector('.count');
    var noRes=document.querySelector(box.dataset.noResults||'');
    function run(){
      var q=input.value.trim().toLowerCase();
      var shown=0;
      items.forEach(function(it){
        var text=(it.textContent||'').toLowerCase();
        var match=!q||text.indexOf(q)>-1;
        it.classList.toggle('hide',!match);
        if(match)shown++;
      });
      if(countEl)countEl.textContent=q?(shown+' / '+items.length):'';
      if(noRes)noRes.classList.toggle('show',shown===0);
    }
    input.addEventListener('input',run);
    run();
  });

  /* FAQ search: filter + auto-expand matches */
  var faqBox=document.getElementById('faqSearch');
  if(faqBox){
    var faqItems=Array.prototype.slice.call(document.querySelectorAll('.faq details'));
    faqBox.addEventListener('input',function(){
      var q=faqBox.value.trim().toLowerCase();
      var shown=0;
      faqItems.forEach(function(d){
        var text=(d.textContent||'').toLowerCase();
        var match=!q||text.indexOf(q)>-1;
        d.style.display=match?'':'none';
        if(match){shown++;if(q)d.open=true;}
      });
      var noRes=document.getElementById('faqNoResults');
      if(noRes)noRes.classList.toggle('show',shown===0);
    });
  }

  /* venue zone popovers */
  var zoneData={
    z1:'Outdoor arena for excavators, dumpers, drills and cranes to run live capability demonstrations for buyers.',
    z2:'Air-conditioned halls housing machinery components, technology providers and processing-equipment stands.',
    z3:'A shaded lounge for refreshments, informal networking and business conversations between meetings.',
    z4:'Pre-scheduled one-to-one meeting tables for exhibitors and serious trade buyers.',
    z5:'Badge printing, visitor registration desks and on-ground helpdesk.'
  };
  var pop=null;
  document.querySelectorAll('.zone').forEach(function(z,i){
    z.setAttribute('tabindex','0');
    z.setAttribute('role','button');
    var key='z'+(i+1);
    z.addEventListener('click',function(){openZonePop(z,zoneData[key]||'');});
    z.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openZonePop(z,zoneData[key]||'');}});
  });
  function openZonePop(anchor,text){
    closeZonePop();
    pop=document.createElement('div');
    pop.className='zone-pop show';
    pop.innerHTML='<button aria-label="Close">&times;</button><h4>'+anchor.querySelector('small').textContent+'</h4><p>'+text+'</p>';
    document.body.appendChild(pop);
    var r=anchor.getBoundingClientRect();
    var top=Math.min(r.bottom+8,window.innerHeight-160);
    var left=Math.min(r.left,window.innerWidth-330);
    pop.style.top=Math.max(8,top)+'px';
    pop.style.left=Math.max(8,left)+'px';
    pop.querySelector('button').addEventListener('click',closeZonePop);
    setTimeout(function(){document.addEventListener('click',outsideZone);},0);
  }
  function outsideZone(e){
    if(pop&&!pop.contains(e.target)&&!e.target.closest('.zone'))closeZonePop();
  }
  function closeZonePop(){
    if(pop){pop.remove();pop=null;}
    document.removeEventListener('click',outsideZone);
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeZonePop();});

  /* gallery lightbox: prev/next + keyboard + counter */
  var lb=document.getElementById('lb');
  if(lb){
    var links=Array.prototype.slice.call(document.querySelectorAll('.ggrid a'));
    if(links.length){
      var im=lb.querySelector('img'),idx=0;
      var prevBtn=document.createElement('button');
      prevBtn.className='lbnav lbprev';prevBtn.setAttribute('aria-label','Previous image');prevBtn.innerHTML='&#8249;';
      var nextBtn=document.createElement('button');
      nextBtn.className='lbnav lbnext';nextBtn.setAttribute('aria-label','Next image');nextBtn.innerHTML='&#8250;';
      var counter=document.createElement('div');
      counter.className='lbcount';
      lb.appendChild(prevBtn);lb.appendChild(nextBtn);lb.appendChild(counter);
      function show(i){
        idx=(i+links.length)%links.length;
        var a=links[idx];
        im.src=a.href;im.alt=a.querySelector('img').alt;
        counter.textContent=(idx+1)+' / '+links.length;
      }
      links.forEach(function(a,i){
        a.addEventListener('click',function(e){
          e.preventDefault();
          show(i);
          lb._trigger=a;
          lb.classList.add('open');document.body.style.overflow='hidden';
          var closeBtn=lb.querySelector('.x');
          if(closeBtn)closeBtn.focus();
        });
      });
      prevBtn.addEventListener('click',function(e){e.stopPropagation();show(idx-1);});
      nextBtn.addEventListener('click',function(e){e.stopPropagation();show(idx+1);});
      document.addEventListener('keydown',function(e){
        if(!lb.classList.contains('open'))return;
        if(e.key==='ArrowLeft')show(idx-1);
        if(e.key==='ArrowRight')show(idx+1);
        if(e.key==='Tab'){
          var focusable=Array.prototype.slice.call(lb.querySelectorAll('button')).filter(function(el){return el.offsetParent!==null;});
          if(!focusable.length)return;
          var first=focusable[0],last=focusable[focusable.length-1];
          if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
          else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
        }
      });
    }
  }
})();

/* v2: scroll progress + back-to-top + gallery lightbox */
(function(){
  'use strict';
  var bar=document.getElementById('progress');
  var top=document.getElementById('toTop');
  window.addEventListener('scroll',function(){
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    if(bar&&max>0)bar.style.width=(h.scrollTop/max*100)+'%';
    if(top)top.classList.toggle('show',h.scrollTop>600);
  },{passive:true});
  if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

  var lb=document.getElementById('lb');
  if(lb){
    var close=function(){
      lb.classList.remove('open');document.body.style.overflow='';
      if(lb._trigger&&typeof lb._trigger.focus==='function')lb._trigger.focus();
    };
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    var lbClose=lb.querySelector('.x');
    if(lbClose)lbClose.addEventListener('click',close);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }
})();

/* v4: exhibitor & visitor registration forms -> mailto fallback */
(function(){
  'use strict';

 function setupRegForm(formId, apiUrl, subjectPrefix, fieldDefs) {

    var f = document.getElementById(formId);

    if (!f) return;

    function fieldWrap(el) {
        return el.closest('.field') || el.closest('fieldset') || el.closest('.consent');
    }

    function validateField(el) {

        var wrap = fieldWrap(el);

        var valid = el.checkValidity();

        if (wrap) wrap.classList.toggle('invalid', !valid);

        return valid;

    }

    var requiredEls = Array.prototype.slice.call(
        f.querySelectorAll("[required]")
    );

    requiredEls.forEach(function (el) {

        el.addEventListener("blur", function () {
            validateField(el);
        });

        el.addEventListener("change", function () {
            validateField(el);
        });

    });

    f.addEventListener("submit", async function (ev) {

        ev.preventDefault();

        if (f.company_website && f.company_website.value) {
            return;
        }

        var allValid = requiredEls.map(validateField).every(Boolean);

        if (!allValid) {

            showToast("Please fill in all required fields.");

            var firstInvalid = requiredEls.find(function (el) {
                return !el.checkValidity();
            });

            if (firstInvalid) firstInvalid.focus();

            return;

        }

        var data = {};

        fieldDefs.forEach(function (def) {

            if (def.type === "checkbox-group") {

                data[def.name] = Array.from(
                    f.querySelectorAll(
                        'input[name="' + def.name + '"]:checked'
                    )
                ).map(function (x) {
                    return x.value;
                });

            }

            else if (def.type === "radio-group") {

                var sel = f.querySelector(
                    'input[name="' + def.name + '"]:checked'
                );

                data[def.name] = sel ? sel.value : "";

            }

            else {

                var el = f.elements[def.name];

                data[def.name] = el ? el.value : "";

            }

        });

        try {

            showToast("Submitting...");

            const response = await fetch(apiUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            if (result.success) {

                showToast("Submitted Successfully.");

                f.reset();

            } else {

                showToast(result.message || "Submission failed.");

            }

        }

        catch (err) {

            console.error(err);

            showToast("Server Error.");

        }

    });

}

 setupRegForm(
  'exhibitorForm',
  '/api/exhibitor',
  'Stand Booking Enquiry - OMIIE 2027',
  [
    {name:'company',label:'Company'},
    {name:'name',label:'Contact Person'},
    {name:'designation',label:'Designation'},
    {name:'email',label:'Email'},
    {name:'phone',label:'Phone'},
    {name:'country',label:'Country'},
    {name:'category',label:'Primary Category'},
    {name:'standSize',label:'Stand Preference',type:'radio-group'},
    {name:'message',label:'Requirements'}
  ]
);

setupRegForm(
  'visitorForm',
  '/api/visitor',
  'Visitor Registration - OMIIE 2027',
  [
    {name:'name',label:'Full Name'},
    {name:'designation',label:'Designation'},
    {name:'company',label:'Company / Organisation'},
    {name:'email',label:'Email'},
    {name:'phone',label:'Phone'},
    {name:'city',label:'City / Country'},
    {name:'profile',label:'Visitor Profile'},
    {name:'interest',label:'Areas of Interest',type:'checkbox-group'}
  ]
);
})();

document.querySelectorAll(".nav-toggle").forEach(btn=>{

    btn.addEventListener("click",function(e){

        e.preventDefault();
        e.stopPropagation();

        const parent=this.parentElement;

        document.querySelectorAll(".nav-drop").forEach(item=>{
            if(item!==parent){
                item.classList.remove("active");
            }
        });

        parent.classList.toggle("active");

    });

});