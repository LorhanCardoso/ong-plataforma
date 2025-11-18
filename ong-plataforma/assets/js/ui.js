document.addEventListener('DOMContentLoaded', function(){

  const nav = document.querySelector('nav[aria-label="Menu principal"]');
  const toggle = document.querySelector('.nav-toggle');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  const toastArea = document.createElement('div');
  toastArea.className = 'toast-area';
  document.body.appendChild(toastArea);
  window.uiToast = function(message, type='info', timeout=3500){
    const t = document.createElement('div');
    t.className = 'alert alert-' + (type === 'error' ? 'danger' : type);
    t.textContent = message;
    toastArea.appendChild(t);
    setTimeout(()=>{ t.style.opacity = '0'; setTimeout(()=> t.remove(),300); }, timeout);
  };

  document.querySelectorAll('[data-modal-open]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = btn.getAttribute('data-modal-open');
      const modalWrap = document.getElementById(id);
      if(modalWrap) modalWrap.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(back=>{
    back.addEventListener('click', e=>{
      if(e.target === back || e.target.closest('[data-modal-close]')) back.classList.remove('open');
    });
  });

  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit', function(e){
      setTimeout(()=>{ 
        const invalids = form.querySelectorAll(':invalid');
        invalids.forEach(inp=>{
          inp.classList.add('input-error');
          const hint = inp.closest('label') ? inp.closest('label').querySelector('.fielderror') : null;
          if(!hint){
            const msg = document.createElement('div'); msg.className='fielderror'; msg.textContent = inp.validationMessage || 'Campo inválido';
            inp.insertAdjacentElement('afterend', msg);
          }
        });
      }, 10);
    });

    form.addEventListener('input', function(e){
      const t = e.target;
      if(t.checkValidity()){
        t.classList.remove('input-error');
        t.classList.add('input-success');
        const s = t.nextElementSibling;
        if(s && s.classList && s.classList.contains('fielderror')) s.remove();
      } else {
        t.classList.remove('input-success');
      }
    });
  });
});
