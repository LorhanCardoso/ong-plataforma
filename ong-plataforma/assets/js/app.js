(function(){
  const Templates = {
    home: function(){ return document.querySelector('main').innerHTML },
    projetos: function(){ 
      return `<section class="card" aria-labelledby="projetos-title">
  <h2 id="projetos-title">Projetos em andamento</h2>
  <div class="projects-grid grid" style="margin-bottom:12px">
    <article class="card" aria-labelledby="p1">
      <figure>
        <img src="assets/images/projeto1.jpg" alt="Crianças em sala de aula" />
        <figcaption class="small">Projeto Educação Viva — aulas complementares.</figcaption>
      </figure>
      <div class="mt-1">
        <h3 id="p1" class="card-title">Educação Viva <span class="badge">Educação</span></h3>
        <p>Atividades extracurriculares para crianças e adolescentes, com foco em leitura e cidadania.</p>
        <p><strong>Como participar:</strong> clique em <a href="cadastro.html" data-link>cadastro</a> e inscreva-se como voluntário.</p>
      </div>
    </article>
    <article class="card" aria-labelledby="p2">
      <figure>
        <img src="assets/images/voluntariado.jpg" alt="Grupo de voluntários plantando árvores" />
        <figcaption class="small">Mutirões ambientais e capacitações.</figcaption>
      </figure>
      <div class="mt-1">
        <h3 id="p2" class="card-title">Verde e Cidadania <span class="badge">Meio ambiente</span></h3>
        <p>Mutirões e oficinas voltadas para sustentabilidade local.</p>
        <p><strong>Doações:</strong> apoio com materiais e recursos financeiros para organizar atividades.</p>
      </div>
    </article>
  </div>
</section>
<aside class="card" style="margin-top:12px" aria-labelledby="como-doar">
  <h2 id="como-doar">Como doar</h2>
  <p>As doações podem ser via transferência ou plataforma de pagamento. Enviamos relatórios trimestrais de aplicação dos recursos.</p>
</aside>` },
    cadastro: function(){ 
      return document.querySelector('main').innerHTML;
    }
  };

  const Utils = {
    qs: (s, ctx=document) => ctx.querySelector(s),
    qsa: (s, ctx=document) => Array.from(ctx.querySelectorAll(s)),
    renderString: function(template, data){
      return String(template).replace(/\{\{(.*?)\}\}/g, function(_,key){ return data[key.trim()] || '' });
    },
    validateCPF: function(cpf){
      if(!cpf) return false;
      const s = cpf.replace(/\D/g,'');
      if(s.length !== 11) return false;
      if(/^(\d)\1+$/.test(s)) return false;
      let sum = 0;
      for(let i=0;i<9;i++) sum += parseInt(s.charAt(i)) * (10 - i);
      let rev = 11 - (sum % 11);
      if(rev === 10 || rev === 11) rev = 0;
      if(rev !== parseInt(s.charAt(9))) return false;
      sum = 0;
      for(let i=0;i<10;i++) sum += parseInt(s.charAt(i)) * (11 - i);
      rev = 11 - (sum % 11);
      if(rev === 10 || rev === 11) rev = 0;
      if(rev !== parseInt(s.charAt(10))) return false;
      return true;
    },
    calcAge: function(dob){
      if(!dob) return null;
      const d = new Date(dob);
      if(isNaN(d)) return null;
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if(m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      return age;
    },
    throttle: function(fn, wait){
      let t = null;
      return function(...a){
        if(t) clearTimeout(t);
        t = setTimeout(()=>{ fn.apply(this,a); t = null }, wait);
      }
    }
  };

  const Storage = {
    key: 'ong-cidadania-cadastro-draft',
    save: function(obj){ localStorage.setItem(this.key, JSON.stringify(obj)) },
    load: function(){ const v = localStorage.getItem(this.key); return v ? JSON.parse(v) : null },
    clear: function(){ localStorage.removeItem(this.key) }
  };

  const SPA = {
    init: function(){
      this.bindLinks();
      window.addEventListener('popstate', ()=> this.handleLocation(location.pathname));
      this.handleLocation(location.pathname);
    },
    bindLinks: function(){
      document.body.addEventListener('click', e=>{
        const a = e.target.closest('a[data-link]');
        if(a){
          e.preventDefault();
          const href = a.getAttribute('href');
          history.pushState({},'',href);
          this.handleLocation(href);
          document.querySelector('nav')?.classList.remove('open');
        }
      });
    },
    handleLocation: function(path){
      const page = this.resolvePage(path);
      this.render(page);
    },
    resolvePage: function(path){
      if(path.includes('projetos')) return 'projetos';
      if(path.includes('cadastro')) return 'cadastro';
      return 'home';
    },
    render: function(page){
      const main = document.getElementById('main');
      if(!main) return;
      if(page === 'home'){
        const content = Templates.home();
        main.innerHTML = content;
      } else if(page === 'projetos'){
        main.innerHTML = Templates.projetos();
      } else if(page === 'cadastro'){
        const content = Templates.cadastro();
        main.innerHTML = content;
        FormHandler.bind();
      }
      this.updateActiveNav(page);
    },
    updateActiveNav: function(page){
      document.querySelectorAll('nav a').forEach(a=> a.classList.remove('active'));
      if(page === 'home') document.querySelector('nav a[href="index.html"]')?.classList.add('active');
      if(page === 'projetos') document.querySelector('nav a[href="projetos.html"]')?.classList.add('active');
      if(page === 'cadastro') document.querySelector('nav a[href="cadastro.html"]')?.classList.add('active');
    }
  };

  const FormHandler = {
    form: null,
    fields: ['nome','nascimento','email','cpf','telefone','cep','endereco','cidade','estado','interesse','experiencia'],
    bind: function(){
      this.form = document.getElementById('cad-form') || document.querySelector('form');
      if(!this.form) return;
      this.restore();
      this.form.addEventListener('input', Utils.throttle(()=> this.autosave(), 400));
      this.form.addEventListener('submit', e=> this.onSubmit(e));
      this.form.addEventListener('reset', ()=> { Storage.clear(); setTimeout(()=> this.restore(),50) });
    },
    autosave: function(){
      const data = {};
      this.fields.forEach(k=>{
        const el = this.form.elements[k];
        if(el) data[k] = el.value;
      });
      Storage.save(data);
    },
    restore: function(){
      const data = Storage.load();
      if(!this.form) return;
      if(data){
        this.fields.forEach(k=>{
          const el = this.form.elements[k];
          if(el && data[k]) el.value = data[k];
        });
        window.uiToast('Rascunho restaurado do localStorage', 'info', 2000);
      }
    },
    onSubmit: function(e){
      e.preventDefault();
      const errors = [];
      const nome = this.form.elements['nome'];
      const email = this.form.elements['email'];
      const cpf = this.form.elements['cpf'];
      const nascimento = this.form.elements['nascimento'];

      if(!nome.value || nome.value.trim().length < 3) errors.push('O nome deve ter pelo menos 3 caracteres.');
      if(!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errors.push('Informe um e-mail válido.');
      if(!cpf.value || !Utils.validateCPF(cpf.value)) errors.push('CPF inválido.');
      if(nascimento.value){
        const age = Utils.calcAge(nascimento.value);
        if(age !== null && age < 16) errors.push('É necessário ter pelo menos 16 anos para se candidatar.');
      }

      this.clearFieldStates();
      if(errors.length){
        errors.forEach(msg=> window.uiToast(msg, 'error', 3500));
        if(nome && (!nome.value || nome.value.trim().length < 3)) nome.classList.add('input-error');
        if(email && (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))) email.classList.add('input-error');
        if(cpf && !Utils.validateCPF(cpf.value)) cpf.classList.add('input-error');
        return;
      }

      const saved = {};
      this.fields.forEach(k=> { const el = this.form.elements[k]; if(el) saved[k] = el.value });
      Storage.clear();
      window.uiToast('Cadastro enviado com sucesso! Obrigado.', 'success', 3000);
      this.form.reset();
      this.clearFieldStates();
    },
    clearFieldStates: function(){
      this.fields.forEach(k=>{
        const el = this.form.elements[k];
        if(el) {
          el.classList.remove('input-error');
          el.classList.remove('input-success');
          const s = el.nextElementSibling;
          if(s && s.classList && s.classList.contains('fielderror')) s.remove();
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    SPA.init();
    if(location.pathname.includes('cadastro')) FormHandler.bind();
    if(location.pathname === '/' || location.pathname.includes('index.html')) {}
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m=> m.classList.remove('open'));
    });
  });
})();
