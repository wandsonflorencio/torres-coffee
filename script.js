
const botao = document.querySelector('.botao-menu')
const menulateral = document.querySelector('.menu-lateral')
const conteudo = document.querySelector('.conteudo')
const background = document.querySelector('.background')


botao.addEventListener('click', () =>{
    menulateral.classList.toggle('ativo')
    botao.classList.toggle('ativo')
    conteudo.classList.toggle('ativo')
    background.classList.toggle('ativo')
    document.body.style.backgroundColor = menulateral.classList.contains('ativo') ? '#34495e' : '#ecf0f1'
    
})

background.addEventListener('click', () =>{
    menulateral.classList.remove('ativo')
    botao.classList.remove('ativo')
    conteudo.classList.remove('ativo')
    background.classList.remove('ativo')
    document.body.style.backgroundColor = '#ecf0f1'
    
})
console.log(conteudo)