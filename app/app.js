//atualmente, algumas informações sao armazenadas nos navegadores como se fosse um banco de dados
//pode-se armazenar em session storage(perdido ao fechar uma instância do navegador) ou
//local storage, que é um armazenamento persistente.
//quando se trata de backend, têm-se os cookies, que ficam no lado do cliente armazenando informações
//ao enviar uma solicitacao http, esses cookies sao anexados e o servidor trabalha em cima deles


function voltar_corrigir() {
    $('#gravacao').modal('hide'); //funcao para fechar a janela do modal, ao preencher info incorretas
}



class Despesa {
    constructor(dia, mes, ano, tipo, descricao, valor) {
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
}


function cadastrarDespesa() {
    let dia = document.getElementById('dia');
    let mes = document.getElementById('mes');
    let ano = document.getElementById('ano');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');
    let despesa = new Despesa(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);
    if (bd.validarDados(despesa)) {
        voltar_corrigir()
        document.getElementById('mvra').innerText = "Retornar e corrigir";
        $('#gravacao').modal('show'); //jquery para modificar o modal, já que o bootstrap o utiliza
        document.getElementById('exampleModalLabel').innerText = "ERRO NA GRAVAÇÃO DAS INFORMAÇÕES";
        document.getElementById('modal-body').innerText = "Existem campos não preenchidos ou há erro de sintaxe!";
        $('#mvra').remove('bg-success').addClass('bg-danger'); //jquery para modificar o modal, já que o bootstrap o utiliza
        bd.limpaCampos();
    } else {
        bd.gravar(despesa);
        bd.recuperarTodosRegistros();
        voltar_corrigir();
        document.getElementById('mvra').innerText = "Ok";

        $('#gravacao').modal('show'); //jquery para modificar o modal, já que o bootstrap o utiliza
        document.getElementById('exampleModalLabel').innerText = "SUCESSO NA GRAVAÇÃO DOS DADOS!";
        document.getElementById('modal-body').innerText = "Alterações obtiveram êxito!";

        $('#mvra').removeClass('bg-danger').addClass('bg-success'); //jquery para modificar o modal, já que o bootstrap o utiliza


    }

}
//obs: diferenca de json para objeto literal é que json é uma string (vem entre aspas) e json é usado quando se quer transferir dados.Objetos nao podem ser transferidos, pois,nao vao além da aplicacao
//assim, a biblioteca JSON converte objetos literais (atraves de stringify) em strings json e de strings json para objetos literais (JSON.parse)
class Bd {
    constructor() {
        let id = localStorage.getItem('id');
        console.log(id)
        if (id === null || id == NaN || id == 'NaN' || id === NaN || id === 'NaN') {
            //se nao tiver id,define um comecando em 0
            localStorage.setItem('id', 0); //atribui ao id um valor 0
        }
    }
    getProximoId() {
        //obtem o id
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;

    }
    gravar(despesa) {
        let id = this.getProximoId(); //retorna o proximo id e da de nome para o objeto, gerando vários
        localStorage.setItem(id, JSON.stringify(despesa)); //é feita a armazenagem no local storage em json
        localStorage.setItem('id', id); // define um novo id

    }
    validarDados(dados) {
        if (parseInt(dados.dia) <= 0 || parseInt(dados.dia) > 31 || dados.dia == "" || dados.ano == "" || dados.mes == "" || dados.valor == "") {
            return true;
        } else {
            return false;
        }
    }
    recuperarTodosRegistros() {
        let ultimo_id = this.getProximoId();
        let despesa = null;
        let registros = Array();
        for (let i = 1; i < ultimo_id; i++) {
            despesa = JSON.parse(localStorage.getItem(parseInt(i)));
            console.log(despesa == null)
            if (despesa == null) {
                continue;

            } else {

                despesa.id = i;
                registros.push(despesa);
            }
        }
        return registros;

    }
    limpaCampos() {
        location.reload();
    }
    pesquisar(despesa) {
        //comunica com local storage
        let despesas_pesquisada = Array();
        despesas_pesquisada = this.recuperarTodosRegistros();
        //filtros:
        if (despesa.dia != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => despesa.dia == f.dia);
        }
        if (despesa.mes != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => f.mes == despesa.mes);

        }
        if (despesa.ano != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => f.ano == despesa.ano);

        }
        if (despesa.tipo != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => f.tipo == despesa.tipo);
        }
        if (despesa.valor != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => f.valor == despesa.valor);
        }
        if (despesa.descricao != '') {
            despesas_pesquisada = despesas_pesquisada.filter(f => f.descricao == despesa.descricao);
        }
        return despesas_pesquisada;

    }
}


function carregarTodosRegistros() {
    let despesas = Array();
    despesas = bd.recuperarTodosRegistros();

    //seleção do elemento tbody da tabela
    let tabela = document.getElementById('tbody_');
    //inserção de linhas e colunas, mais o preenchimento com os métodos do objeto tabela
    despesas.forEach(function(despesas) {
            //linha para cada elemento em despesas:
            let linhas = tabela.insertRow();
            console.log(despesas.dia)
                //insere td as colunas
            linhas.insertCell(0).innerHTML = `${despesas.dia}/${despesas.mes}/${despesas.ano}`;
            linhas.insertCell(1).innerHTML = despesas.tipo;
            linhas.insertCell(2).innerHTML = despesas.descricao;
            linhas.insertCell(3).innerHTML = `R$ ${despesas.valor}`;
            let btn = document.createElement('button');
            btn.className = 'btn btn-danger';
            btn.id = despesas.id;
            btn.onclick = x => {
                alert(btn.id);
                localStorage.removeItem(btn.id);
                bd.limpaCampos();
            }
            btn.innerHTML = 'Apagar';
            linhas.insertCell(4).append(btn);

        }) //funcao call back
}



function pesquisarDespesa() {
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    //criacao de um objeto com base no inserido na pesquisa
    let despesa = new Despesa(dia, mes, ano, tipo, descricao, valor);
    let array_filtrado = bd.pesquisar(despesa);


    let tabela = document.getElementById('tbody_');
    tabela.innerHTML = '';;
    //inserção de linhas e colunas, mais o preenchimento com os métodos do objeto tabela
    array_filtrado.forEach(function(array_filtrado) {
            //linha para cada elemento em despesas:
            let linhas = tabela.insertRow();
            //insere td as colunas
            linhas.insertCell(0).innerHTML = `${array_filtrado.dia}/${array_filtrado.mes}/${array_filtrado.ano}`;
            linhas.insertCell(1).innerHTML = array_filtrado.tipo;
            linhas.insertCell(2).innerHTML = array_filtrado.descricao;
            linhas.insertCell(3).innerHTML = `R$ ${array_filtrado.valor}`;
            let btn = document.createElement('button');
            btn.className = 'btn btn-danger';
            btn.id = array_filtrado.id
            btn.onclick = x => {
                alert(btn.id);
                localStorage.removeItem(this.id);
                bd.limpaCampos();
            }

            btn.innerHTML = 'Apagar';
            linhas.insertCell(4).append(btn);
            contador += 1;
        }) //funcao call back
}





let bd = new Bd();

let btn = document.getElementById('mvra');
btn.addEventListener("click", bd.limpaCampos);