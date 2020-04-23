class CalcController {

    constructor() {

        this._displayCalc = "0" //underline significa private
        this._dataAtual;        //Private: somente atributos e métodos da própria classe podem acessar esse atributo ou método

    }

    get displayCalc() {

        return this._displayCalc;

    }

    set displayCalc(valor) {

        this._displayCalc = valor;

    }

    get dataAtual() {

        return this._dataAtual;

    }

    set dataAtual(valor) {

        this._dataAtual = valor;

    }

}