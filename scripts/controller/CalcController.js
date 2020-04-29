class CalcController {

    constructor() {

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display"); 
        this._dateEl = document.querySelector("#data"); 
        this._timeEl = document.querySelector("#hora"); 
        //underline significa private
        this._currentDate;        //Private: somente atributos e métodos da própria classe podem acessar esse atributo ou método
        this.initialize();
        this.initButtonsEvents();

    }

    initialize() {

        this.setDisplayDateTime();
        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {

        this._operation = []; //limpa o array de operadores

    }

    clearEntry() {

        this._operation.pop(); //retira um valor do topo do array de operadores

    }

    getLastOperation() {

        
        return this._operation[this._operation.length - 1];

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isOperator(value)) {
                //Trocar o operador
                

            } else {
                //outra coisa


            }

        } else {
            //Number
            let newValue = this.getLastOperation().toString() + value.toString();
            this._operation.push(newValue);

        }
        this._operation.push(value); //pega o array e adiciona um valor no final dele
        
        console.log(this._operation);

    }


    setError() {

        this.displayCalc = "Error";

    }

    execBtn(value) {

        switch(value) {

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'subtracao':

                break;
            case 'divisao':

                break;
            case 'multiplicacao':

                break;
            case 'porcento':

                break;
            case 'igual':

                break;
            case 'ponto':

                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
                

        }

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, parts > g");

        buttons.forEach((btn, index) => {
            //basicamente para cada valor indexado de botões você passa esse valor
            //juntamente com os eventos relacionados a esse valor que devem ser observados
            //e a função que deve ser executada caso tal evento ocorra
            //no caso os valores são as tags html do document referentes aos botões
            //logo as figuras e o texto dos botões na tela
            this.addEventListenerAll(btn, 'click drag', e => {
                //para substituir um certo valor no nome da classe por outro valor
                //console.log(btn.className.baseVal.replace("btn-", ""));
                let textBtn = btn.className.baseVal.replace("btn-", "");
                
                this.execBtn(textBtn);
            });
            //btn é cada valor da lista de botões referenciados com o querySelectorAll
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer"; //para mudar o estilo do mouse

            });

        });

    }

    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale); 
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }
    
    get displayTime() {

        return this._timeEl.innerHTML;

    }

    set displayTime(value) {

        return this._timeEl.innerHTML = value;

    }

    get displayDate() {

        return this._dateEl.innerHTML;

    }

    set displayDate(value) {

        return this._dateEl.innerHTML = value;

    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value) {

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate() {
        //currentDate.toLocaleDateString("pt-BR", {month: 'short'}) para mostrar uma abreviação por extenso do mês atual
        return new Date();

    }

    set currentDate(value) {

        this._currentDate = value;

    }

}