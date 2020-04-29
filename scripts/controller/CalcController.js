class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._equal = false;
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display"); 
        this._dateEl = document.querySelector("#data"); 
        this._timeEl = document.querySelector("#hora"); 
        //underline significa private
        this._currentDate;        //Private: somente atributos e métodos da própria classe podem acessar esse atributo ou método
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            if (!isNaN(text)) {
                parseFloat(text);
                if (this.isOperator(this.getLastOperation())) {

                    this.pushOperation(text);

                } else {

                    this.setLastOperation(text);

                }

            }

        });

    }

    copyToClipboard() {

        let input = document.createElement('input'); //cria um elemento pro documento
        input.value = this.displayCalc;           //pega o valor que aparece na calculadora
        document.body.appendChild(input);         //coloca o input pra dentro do documento
        input.select();                           //seleciona o input
        document.execCommand("Copy");             //efetivamente copia o input pro clipboard  
        input.remove();                           //remove o input do documento

    }

    initialize() {

        window.alert("Double click on AC to toggle on and off the audio");
        this.setDisplayDateTime();
        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });

        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;
        if (this._audioOnOff) {

            this._audio.play();

        }

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyboard() {

        document.addEventListener('keyup', e => {
            if (isNaN(this.displayCalc)) {

                this.clearAll();
    
            }
            this.playAudio();
            switch(e.key) {

                case 'Escape':
                    this._equal = false;
                    this.clearAll();
                    break;
                case 'Backspace':
                    this._equal = false;
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this._equal = false;
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    if (this._operation.length > 2 || this._equal == true) { //para evitar dar erro no console só executa o
                                                                             //igual quando é conveniente
                        this._equal = true;
                        this.calc();

                    }
                    break;
                case '.':
                case ',':
                    if (this._equal && !this.isOperator(this.getLastOperation())) {
                        
                        this.clearAll();
                        this._equal = false;

                    }
                    this.addDot();
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
                    if (this._equal && !this.isOperator(this.getLastOperation())) {     //se apertou igual e depois um número
                                                                                        //limpa o array da calculadora
                        this.clearAll();
                        this._equal = false;

                    }
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) { //verifica se a tecla ctrl foi pressionada para poder copiar

                        this.copyToClipboard();

                    }
                    break;

            }

        });

    }

    addEventListenerAll(element, events, fn) {
        //método que adiciona vários listeners de variados eventos para um elemento
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {

        this._operation = []; //limpa o array de operadores
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }

    clearEntry() {

        if (this._operation.length == 1) {

            this.clearAll();

        } else {

            this._operation.pop(); //retira um valor do topo do array de operadores
            this.setLastNumberToDisplay();    

        }

    }

    getLastOperation() {

        //método que retorna o último valor do array ._operation
        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {
        //muda o último operador no array ._operation
        if (this._operation.length == 0) {
            
            if (isNaN(value) == false) {

                this.pushOperation(value); 

            }

        } else {

            this._operation[this._operation.length - 1] = value;

        }

    }

    isOperator(value) {
        //método que verifica se o valor dado é um operador
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    pushOperation(value) {

        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc(); //método para calcular expressões

        }

    }

    getResult() {

        try { //tente resolver a expressão
            
            let sign = false;
            for (let i = 0; i < this._operation.length; i++) {

                if (this._operation[i] == '-' && sign == true) {

                    this._operation[i] = '+';
                    break;

                } else if (this._operation[i] == '-') {

                    sign = true;

                }

            }
            let result = eval(this._operation.join(""));
            if (result < 0.0000001 && result >= 0) {

                result = 0;

            }
            return result;

        } catch { //senão conseguir aparece Error no display

            setTimeout(() => {

                this.setError();

            }, 1);

        }
        

    }

    calc() {

        let last = '';
        this._lastOperator = this.getLastItem();
        if (this._operation.length < 3) {
            
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }


        if (this._operation.length > 3) {

            this._equal = true;
            last = this._operation.pop();
            this._lastNumber = this.getResult(); 

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);  

        }


        let result = this.getResult();
        if (last == '%') {

            result /= 100;
            this._operation = [result];

        } else {
            
            this._operation = [result];
            console.log(this._operation);
            if (last) {

                this._operation.push(last);

            }

        }
        
        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {
        
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i];
                break;

            }

        }
        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }
        return lastItem;

    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);
        if (((lastNumber > 999999999) || (lastNumber < 0.0000001 && lastNumber.length > 9)) && (lastNumber))  {

            this.clearAll();
            this.setError();
            return;

        }
        
        let index;
        lastNumber = lastNumber.toString();
        if ((index = lastNumber.indexOf('.')) > -1) {

            lastNumber = Array.from(lastNumber);
            while (lastNumber.length > 10) {

                lastNumber.pop();

            }
            index = lastNumber.length;
            if (this._equal) {

                while (lastNumber[index - 1] == '0') {

                    lastNumber.pop();
                    index--;
    
                }  

            }
            lastNumber = lastNumber.join('');

        }
        
        if (!lastNumber || (this._operation.length == 1 && this._operation[0] == 0)) {

            lastNumber = 0;

        }
        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        if (this.getLastOperation() == '0' && value == '0') {

            return;

        }
        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isOperator(value)) {
                //Trocar o operador
                this.setLastOperation(value);

            } else {
                
                this.pushOperation(value); //pega o array e adiciona um valor no final dele
                //atualizar display
                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
            
                //Number
                if (!isNaN(value) && this._operation[this._operation.length - 1] == '0' && this._operation.length == 1) {

                    return;

                }
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                //atualizar display
                this.setLastNumberToDisplay();

            }

        }
        console.log(this._operation);

    }


    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation && lastOperation.split('').indexOf('.') > -1) {

            return;

        }

        if (this.isOperator(lastOperation) || !lastOperation && this.getLastOperation() != 0) {
            
            this.pushOperation('0.');

        } else {
            
            this.setLastOperation(lastOperation.toString() + '.');

        }
        this.setLastNumberToDisplay();

    }

    execBtn(value) {

        if (isNaN(this.displayCalc)) {

            this.clearAll();

        }
        this.playAudio();
        //verifica qual dos botões foi clicado e passa a devida operação
        switch(value) {
            
            case 'ac':
                this._equal = false;
                this.clearAll();
                break;
            case 'ce':
                this._equal = false;
                this.clearEntry();
                break;
            case 'soma':
                this._equal = false;
                this.addOperation('+');
                break;
            case 'subtracao':
                this._equal = false;
                this.addOperation('-');
                break;
            case 'divisao':
                this._equal = false;
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this._equal = false;
                this.addOperation('*');
                break;
            case 'porcento':
                this._equal = false;
                this.addOperation('%');
                break;
            case 'igual':
                if (this._operation.length > 2 || this._equal == true) {

                    this._equal = true;
                    this.calc();

                }
                break;
            case 'ponto':
                if (this._equal && !this.isOperator(this.getLastOperation())) {
                        
                    this.clearAll();
                    this._equal = false;

                }
                this.addDot();
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
                if (this._equal && !this.isOperator(this.getLastOperation())) {
                    //caso ja tenha pressionado enter e após isso pressiona um número
                    //limpa a calculadora e apenas o último número pressionado será colocado no array
                    this.clearAll();
                    this._equal = false;

                }
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