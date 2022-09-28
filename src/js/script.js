// Variável que irá armazenar a quantidade de itens que terá no modal
// Irá iniciar com 1  
  let modalQt = 1;

// Atalho para não ficar a todo momento colocando 'document.querySelector' em tudo que eu fizer
// Utilizando uma função anônima
  const qS = (elemento) => document.querySelector(elemento);
  const qSAll = (elemento) => document.querySelectorAll(elemento);

// **** LISTANDO (Mapeando) AS PIZZAS ****

// Recebendo 2 parâmetros
//  1º - O próprio item (Cada Pizza)
//  2º - Index, ou seja, o número no array referente ao item específico
  pizzaJson.map((item, index) => {
// Clonando a estrutura da div Model no HTML, inserindo os dados e jogando na tela
// Selecionando a div com a class models e dentro dele irei pegar a class pizza-item
// Para clonar eu utilizo o cloneNode e como parâmetro eu coloco true, porque ele irá pegar não só o próprio item mas tudo que tiver dentro dele
    let pizzaItem = qS('.models .pizza-item').cloneNode(true);

// Irá armazenar qual é a pizza que está no modal, ou seja, quando eu clicar em alguma pizza, irá abrir o modal com  as informações referentes à pizza que foi clicada
// Setando um atributo que chamarei de data-key, esse nome porque quando coloca um atributo com alguma informação é colocado esse prefixo 'data'
// Colocando aqui qual é a chave específica do item
    pizzaItem.setAttribute('data-key', index);


// Adicionando as informações em pizza item
// Imagem
// Pegando a classe pizza-item--img e selecioando dentro dele img
// Acessando o SRC e trocando pelo caminho item.img
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
// Preço
// Formatando para aparecer todos padronizados em decimal com dois digitos após a vírgula
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
// Nome da Pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
// Descrição da Pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

// PARTE RELATIVA AO MODAL
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
// Ação de quando clicar no '+', não atualizar a tela mas abrir o modal com as informações da Pizza para poder adicionar no carrinho ou não      
// Bloqueando a ação natural do clique no item na tag a, que no caso é atualizar a tela
      evento.preventDefault();

// Pegando a informação do data-key da pizza para indicar ao modal qual foi a pizza clicada
// evento.target, refere-se ao próprio elemento que foi clicado, que nesse caso é a tag 'a', mas eu preciso sair do elemento a e ir para pizza item
// closest, significa ache o elemento mais próximo que tenha '.pizza-item', nesse caso qual é o item mais próximo da tag 'a' com o que foi pedido? É o item anterior, a div com a classe pizza-item
// getAttribute, pegando a data-key que possui a chave que eu cliquei
      let key = evento.target.closest('.pizza-item').getAttribute('data-key');
          console.log(`PIZZA CLICADA: ${key}`);
          console.log(pizzaJson[key]);
// Redefine com a quantidade 1, sempre que abrir o modal
      modalQt = 1;

// Preenchendo as informações referente à pizza clicada no modal
// Imagem
      qS('.pizzaBig img').src = pizzaJson[key].img;
// Nome
      qS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
// Descrição
      qS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
// Preço
      qS('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
// Tamanhos
//Retirando a seleção no item (Quando abrir o modal, nenhum item irá aparecer selecionado)
      qS('.pizzaInfo--size.selected').classList.remove('selected');

// Para percorrer os itens selecionados
// forEach, para cada um dos itens, irá rodar uma função
// Essa função receberá o próprio item que chamarei de size, e receberá o index
      qSAll('.pizzaInfo--size').forEach((size, sizeIndex) => {  
        if(sizeIndex == 2) {
// A pizza grande já vai aparecer selecionada
          size.classList.add('selected');
        }
        
// Pegando o span dentro do pizzaInfo--size, para preencher com alguma informação
/**
 * pizzaJson[key].sizes[sizeIndex];  ==   Acessando os tamanhos da pizza
 */
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];;
      });


// **** EVENTO DE CLIQUE PARA ABRIR O MODAL ****

// Sempre que abrir o modal irá deixar a quantidade como 1
// Irá em quantidade e colocará modalQt, ou seja, a quantidade padrão que tem na pizza
      qS('.pizzaInfo--qt').innerHTML = modalQt;

// Gerando animação de abertura do Modal, o opacity começará como 0
      qS('.pizzaWindowArea').style.opacity = 0;
// Mudando o Display de None para Flex, porém continua sem aparecer na tela
      qS('.pizzaWindowArea').style.display = 'flex';
// Passando o tempo determinado, vai passar a opacidade para 1 e exibirá o modal na tela
      setTimeout(() => {
        qS('.pizzaWindowArea').style.opacity = 1;
      }, 200)
    });

// append, pega o conteúdo que já existe em pizza area e vai adicionar mais um conteúdo, e como parâmetro eu irei colocar o elemento que eu quero adicionar que nesse caso é o pizzaItem
    qS('.pizza-area').append( pizzaItem );
  });


// **** EVENTOS DO PRÓPRIO MODAL ****

// Como o cancelar não é um botão, eu não irei indicar nenhum tipo de parâmetro, eu simplemente crio uma função e ela fechará o modal
  function closeModal() {
      qS('.pizzaWindowArea').style.opacity = 0;
      
      setTimeout(() => {
        qS('.pizzaWindowArea').style.display = 'none';
      }, 500)
  }
// forEach, para cada um deles eu irei executar uma função
  qSAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
// Recebendo o próprio item e adicionando o clique
      item.addEventListener('click', closeModal);
  });

// **** BOTÕES - (DIMINUIR QUANTIDADE) E + (AUMENTAR QUANTIDADE) DO MODAL ****

