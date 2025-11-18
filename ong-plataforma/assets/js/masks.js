// masks.js - máscaras simples para CPF, telefone e CEP
document.addEventListener('DOMContentLoaded', function(){
  const cpf = document.getElementById('cpf');
  const phone = document.getElementById('telefone');
  const cep = document.getElementById('cep');

  function onlyDigits(v){ return v.replace(/\D/g,''); }

  function maskCPF(value){
    value = onlyDigits(value).slice(0,11);
    if(value.length <=3) return value;
    if(value.length <=6) return value.replace(/(\d{3})(\d+)/,'$1.$2');
    if(value.length <=9) return value.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3');
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4');
  }

  function maskPhone(value){
    value = onlyDigits(value).slice(0,11);
    if(value.length <=2) return value;
    if(value.length <=6) return value.replace(/(\d{2})(\d{1,4})/,'($1) $2');
    if(value.length <=10) return value.replace(/(\d{2})(\d{4})(\d+)/,'($1) $2-$3');
    return value.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');
  }

  function maskCEP(value){
    value = onlyDigits(value).slice(0,8);
    if(value.length <=5) return value;
    return value.replace(/(\d{5})(\d{1,3})/,'$1-$2');
  }

  if(cpf){
    cpf.addEventListener('input', e => {
      const sel = e.target.selectionStart;
      e.target.value = maskCPF(e.target.value);
      e.target.setSelectionRange(sel, sel);
    });
  }
  if(phone){
    phone.addEventListener('input', e => {
      const sel = e.target.selectionStart;
      e.target.value = maskPhone(e.target.value);
      e.target.setSelectionRange(sel, sel);
    });
  }
  if(cep){
    cep.addEventListener('input', e => {
      const sel = e.target.selectionStart;
      e.target.value = maskCEP(e.target.value);
      e.target.setSelectionRange(sel, sel);
    });
  }
});
