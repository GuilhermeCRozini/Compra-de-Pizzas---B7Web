// Variável que será um Array
// Tudo que for adicionado nesse Array (Pizzas que irei comprar, quantidade, tamanho...) é basicamente o meu carrinho
let cart = []
// Variável que irá armazenar a quantidade de itens que terá no modal
// Irá iniciar com 1
let modalQt = 1
// Indetificação de qual pizza estou selecionando
let modalKey = 0

// Atalho para não ficar a todo momento colocando 'document.querySelector' em tudo que eu fizer
// Utilizando uma função anônima
const qS = elemento => document.querySelector(elemento)
const qSAll = elemento => document.querySelectorAll(elemento)

// **** LISTANDO (Mapeando) AS PIZZAS ****

// Recebendo 2 parâmetros
//  1º - O próprio item (Cada Pizza)
//  2º - Index, ou seja, o número no array referente ao item específico
pizzaJson.map((item, index) => {
  // Clonando a estrutura da div Model no HTML, inserindo os dados e jogando na tela
  // Selecionando a div com a class models e dentro dele irei pegar a class pizza-item
  // Para clonar eu utilizo o cloneNode e como parâmetro eu coloco true, porque ele irá pegar não só o próprio item mas tudo que tiver dentro dele
  let pizzaItem = qS('.models .pizza-item').cloneNode(true)

  // Irá armazenar qual é a pizza que está no modal, ou seja, quando eu clicar em alguma pizza, irá abrir o modal com  as informações referentes à pizza que foi clicada
  // Setando um atributo que chamarei de data-key, esse nome porque quando coloca um atributo com alguma informação é colocado esse prefixo 'data'
  // Colocando aqui qual é a chave específica do item
  pizzaItem.setAttribute('data-key', index)

  // Adicionando as informações em pizza item
  // Imagem
  // Pegando a classe pizza-item--img e selecioando dentro dele img
  // Acessando o SRC e trocando pelo caminho item.img
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  // Preço
  // Formatando para aparecer todos padronizados em decimal com dois digitos após a vírgula
  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerHTML = `R$ ${item.price.toFixed(2)}`
  // Nome da Pizza
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  // Descrição da Pizza
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

  // PARTE RELATIVA AO MODAL
  pizzaItem.querySelector('a').addEventListener('click', evento => {
    // Ação de quando clicar no '+', não atualizar a tela mas abrir o modal com as informações da Pizza para poder adicionar no carrinho ou não
    // Bloqueando a ação natural do clique no item na tag a, que no caso é atualizar a tela
    evento.preventDefault()

    // Pegando a informação do data-key da pizza para indicar ao modal qual foi a pizza clicada
    // evento.target, refere-se ao próprio elemento que foi clicado, que nesse caso é a tag 'a', mas eu preciso sair do elemento a e ir para pizza item
    // closest, significa ache o elemento mais próximo que tenha '.pizza-item', nesse caso qual é o item mais próximo da tag 'a' com o que foi pedido? É o item anterior, a div com a classe pizza-item
    // getAttribute, pegando a data-key que possui a chave que eu cliquei
    let key = evento.target.closest('.pizza-item').getAttribute('data-key')
    //console.log(`PIZZA CLICADA: ${key}`)
    //console.log(pizzaJson[key])
    // Redefine com a quantidade 1, sempre que abrir o modal
    modalQt = 1
    // Informa qual é a pizza
    modalKey = key

    // Preenchendo as informações referente à pizza clicada no modal
    // Imagem
    qS('.pizzaBig img').src = pizzaJson[key].img
    // Nome
    qS('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    // Descrição
    qS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    // Preço
    qS('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`
    // Tamanhos
    //Retirando a seleção no item (Quando abrir o modal, nenhum item irá aparecer selecionado)
    qS('.pizzaInfo--size.selected').classList.remove('selected')

    // Para percorrer os itens selecionados
    // forEach, para cada um dos itens, irá rodar uma função
    // Essa função receberá o próprio item que chamarei de size, e receberá o index
    qSAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        // A pizza grande já vai aparecer selecionada
        size.classList.add('selected')
      }

      // Pegando o span dentro do pizzaInfo--size, para preencher com alguma informação
      /**
       * pizzaJson[key].sizes[sizeIndex];  ==   Acessando os tamanhos da pizza
       */
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })

    // **** EVENTO DE CLIQUE PARA ABRIR O MODAL ****

    // Sempre que abrir o modal irá deixar a quantidade como 1
    // Irá em quantidade e colocará modalQt, ou seja, a quantidade padrão que tem na pizza
    qS('.pizzaInfo--qt').innerHTML = modalQt

    // Gerando animação de abertura do Modal, o opacity começará como 0
    qS('.pizzaWindowArea').style.opacity = 0
    // Mudando o Display de None para Flex, porém continua sem aparecer na tela
    qS('.pizzaWindowArea').style.display = 'flex'
    // Passando o tempo determinado, vai passar a opacidade para 1 e exibirá o modal na tela
    setTimeout(() => {
      qS('.pizzaWindowArea').style.opacity = 1
    }, 200)
  })

  // append, pega o conteúdo que já existe em pizza area e vai adicionar mais um conteúdo, e como parâmetro eu irei colocar o elemento que eu quero adicionar que nesse caso é o pizzaItem
  qS('.pizza-area').append(pizzaItem)
})

// **** EVENTOS DO PRÓPRIO MODAL ****

// Como o cancelar não é um botão, eu não irei indicar nenhum tipo de parâmetro, eu simplemente crio uma função e ela fechará o modal
function closeModal() {
  qS('.pizzaWindowArea').style.opacity = 0

  setTimeout(() => {
    qS('.pizzaWindowArea').style.display = 'none'
  }, 500)
}
// forEach, para cada um deles eu irei executar uma função
qSAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
  item => {
    // Recebendo o próprio item e adicionando o clique
    item.addEventListener('click', closeModal)
  }
)

// **** BOTÕES - (DIMINUIR QUANTIDADE) E + (AUMENTAR QUANTIDADE) DO MODAL ****

qS('.pizzaInfo--qtmenos').addEventListener('click', () => {
  // Funcionará apenas quando o modalQt for maior do que 1
  // Não pode dimiuir até a quantidade 0
  if (modalQt > 1) {
    // Quando clicar no botão -, irá acessar o modaQt e irá aumentar -1 (Decrementar)
    modalQt--

    // Selecionando o pizzaInfo--qt e coloco o novo valor da variável modal
    qS('.pizzaInfo--qt').innerHTML = modalQt
  }
})

qS('.pizzaInfo--qtmais').addEventListener('click', () => {
  // Quando clicar no botão +, irá acessar o modaQt e irá aumentar +1 (Incrementar)
  modalQt++

  // Selecionando o pizzaInfo--qt e coloco o novo valor da variável modal
  qS('.pizzaInfo--qt').innerHTML = modalQt
})

// *** TAMANHO DA PIZZA ***

qSAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', evento => {
    // Como fazer para trocar a seleção de um item?
    // Clicou em um item, irá desmarcar qualquer outro item que já esteja selecionado e depois marca o que foi clicado
    qS('.pizzaInfo--size.selected').classList.remove('selected')

    // Como já estou dentro de um loop, irei utilizar o próprio size como o item
    size.classList.add('selected')
  })
})

// **** CARRINHO DE COMPRAS ****

qS('.pizzaInfo--addButton').addEventListener('click', () => {
  // Quando clicar no botão de adicionar, tenho que reunir todas as informações necessárias para serem inseridas no carrinho
  /**
   * Preciso saber:
   *
   * 1º - Qual a Pizza?
   * console.log(`Pizza: ${modalKey}`)
   * Com o número que for retornado eu consigo acessar o JSON, pego o index referente à pizza e pego todas as informações que eventualmente irei precisar para adicionar ao carrinho
   *
   * 2º - Qual o tamanho selecionado?
   * Para isso eu pego o item que está selecionado no modal para o tamanho
   * Variável pegando o item e o valor no data-key referente ao tamanho
   * let size = qS('.pizzaInfo--size.selected').getAttribute('data-key')
   * console.log(`Tamanho: ${size}`);
   *
   * 3º - Quantas pizzas serão adicionadas?
   * Essa informação seria o modalQt
   * console.log(`Quantidade: ${modalQt}`)
   */

  // Size está como string, então vou transformá-lo em um inteiro
  let size = parseInt(qS('.pizzaInfo--size.selected').getAttribute('data-key'))

  // A mesma pizza do mesmo tamanho devem estar juntas, só separa se forem de tamanhos diferentes
  // Para isso irei criar um identidicador, que é basicamente alguma string por exemplo a qual irá juntar o id da pizza com o tamanho dela

  // Nessa variável irá juntar as informações, id da pizza e o tamanho dela
  // Cocatenando o id da pizza com algum símbolo qualquer como por exemplo um '@', e depois o tamanho dela
  let identifier = pizzaJson[modalKey].id + '@' + size

  // Antes de adicionar (Antes do push), eu tenho que verificr se no carrinho eu já tenho outro item com o mesmo identificador, porque se tiver, não irá dar um push, irá simplesmente adicionar a quantidade naquele item que já tem

  // Identificando se eu já tenho o item no meu carrinho
  // Verificando o key do item e como parâmetro coloco o que ele irá procurar, no caso o identifier
  // item, é cada item do meu carrinho
  let key = cart.findIndex(item => {
    // Dos identifier no carrihno, qual tem o mesmo identifier do meu, se achar, vai retornar o index dele, senão irá retornar -1
    return item.identifier == identifier
  })

  if (key > -1) {
    // Se achou, irá aumentar a quantidade
    // cart[key], para selecionar o item certo
    // qr, quantidade
    // modalQt, nova quantidade que eu quero adicionar
    cart[key].qt += modalQt
  } else {
    // Se não achou, irá colocar no carrinho

    // Adicionando ao Array do carrinho
    cart.push({
      // Adicionando o identificador que eu criei, no carrinho
      identifier,
      // Pegando o id no PizzaJson a que está no modalKey
      id: pizzaJson[modalKey].id,
      // Posso colocar size: size ou simplesmente size
      size,
      qt: modalQt
    })
  }
  // Depois de clicar em adicionar ao carrinho, o modal será fechado
  // Mas antes de fechar, será feito uma atualização no carrinho, verificando se algo foi alterado no meu carrinho
  // Neste caso a ordem não importa, pode atualizar antes e fechar depois ou ao contrário
  updateCart()
  closeModal()
})

// Carrinho no Mobile
qS('.menu-openner').addEventListener('click', () => {
  // Só irá abrir quando tiver algo no carrinho
  if (cart.length > 0) {
    qS('aside').style.left = '0'
  }
})
// Ação para fechar o carrinho no Mobile
qS('.menu-closer').addEventListener('click', () => {
  qS('aside').style.left = '100vw'
})

// Função que irá atualizar o carrinho de compras
function updateCart() {
  // Sempre que rodar esta função, o número indicando quantos tipos de itens o carrinho possui, será atualizado (header)
  qS('.menu-openner span').innerHTML = cart.length

  // Decidindo se mostra o carrinho ou não, como faz essa decisão, verificando quantos itens ou se tem itens no meu carrinho
  if (cart.length > 0) {
    qS('aside').classList.add('show')

    qS('.cart').innerHTML = ''

    let subtotal = 0
    let desconto = 0
    let total = 0

    // Pegando item a item para exibir na tela, podendo utilizar o cart ou o map, ambos irão funcionar
    for (let i in cart) {
      // Identificando qual é a pizza
      // Procurando dentro do pizzaJson os itens que possuem o id fornecido
      let pizzaItem = pizzaJson.find(item => {
        //cart[i], selecionando o item específico do loop e .id que é o id do próprio carrinho
        return item.id == cart[i].id
      })
      //console.log(pizzaItem)
      // O preço da pizza vezes a quantidade que eu tenho no carrinho
      subtotal += pizzaItem.price * cart[i].qt

      let cartItem = qS('.models .cart--item').cloneNode(true)

      /**
       * Poderia deixar da seguinte forma:
       * let pizzaSizeName = cart[i].size
       * Mas nesse caso ficaria aparecendo entre 0 e 2 no tamanho, para ficar melhor de entender, quero que mostre P, M e G
       */
      let pizzaSizeName
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P'
          break
        case 1:
          pizzaSizeName = 'M'
          break
        case 2:
          pizzaSizeName = 'G'
          break
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

      // Carregando as informações no carrinho
      cartItem.querySelector('img').src = pizzaItem.img
      // No nome irei colocar o tamanho, porque não existe uma div específico para colocar
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
      // cart[i].qt, pegando do carrinho, a quantidade
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
      // Adicionando as funções dos botões + e -
      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[i].qt > 1) {
            cart[i].qt--
          } else {
            // Caso só tenha 1 e eu diminuir, irá retirar o item do meu carrinho
            // Removendo o item do meu carrinho, e a quantidade de 1 item
            cart.splice(i, 1)
          }
          updateCart()
        })
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[i].qt++
          // Reatuliza o carrinho toda vez que apertar o botão + ou no botão - de algum item do meu carrinho
          // Sempre que eu atualizar a quantidade do item dentro do carrinho, irá por consequência atualizar tudo (Subtotal, Desconto, Total)
          updateCart()
        })

      qS('.cart').append(cartItem)
    }

    // Desconto é 10% do subtotal
    desconto = subtotal * 0.1
    total = subtotal - desconto

    qS('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    qS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    qS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
  } else {
    qS('aside').classList.remove('show')

    // No Mobile, quando diminuir a quantidade do item para 0, fecha o carrinho
    qS('aside').style.left = '100vw'
  }
}