class CalcController {

    constructor() {

        this._audioOnOff = false
        this._audio = new Audio('click.mp3')
        this._buttonToggleEl = document.querySelector('.toggle')
        this._lastOperator = ''
        this._lastNumber = ''
        this._toContinue = true
        this._historic = []
        this._operation = []
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('#display-main')
        this._timeEl = document.querySelector('.display-time')
        this._dateEl = document.querySelector('.display-date')
        this._historicEl = document.querySelector('#display-historic')
        this._audioEl = document.querySelector('.display-audio')
        this._currentDate = ''
        this.initializeDisplay()
        this.initButtonsEvents()
        this.initKeyboard()

    }

    get displayCalcEl() {

        return this._displayCalcEl.innerHTML

    }

    set displayCalcEl(value) {

        if (value.toString().length > 14) {

            value = parseInt(value).toExponential(10)

        } else if (value.toString().split('')[value.toString().split('').length - 1] !== '.') {

            value = parseFloat(value).toLocaleString(this._locale).replace(',', '.')

        }

        this._displayCalcEl.innerHTML = value

    }

    get timeEl() {

        return this._timeEl.innerHTML

    }

    set timeEl(value) {

        this._timeEl.innerHTML = value

    }

    get dateEl() {

        return this._dateEl.innerHTML

    }

    set dateEl(value) {

        this._dateEl.innerHTML = value

    }

    get historicEl() {

        return this._historicEl.innerHTML

    }

    set historicEl(value) {

        if (value.length > 34) {

            value = value.substring(value.length - 34, value.length)

        }

        this._historicEl.innerHTML = value

    }

    get audioEl() {

        return this._audioEl.innerHTML

    }

    set audioEl(value) {

        this._audioEl.innerHTML = value

    }

    get currentDate() {

        return new Date()

    }

    set currentDate(value) {

        this._currentDate = value

    }

    initializeDisplay() {

        this.setDisplayDateTime()

        setInterval(() => {

            this.setDisplayDateTime()

        }, 1000)

        this.setOperationToDisplay()

        this.pasteFromClipboard()

        this.toggleAudio()

    }

    toggleAudio() {

        this._buttonToggleEl.addEventListener('click', () => {

            this._audioOnOff = !this._audioOnOff

            if (this._audioOnOff) {

                this._buttonToggleEl.children[0].className = 'on'

                this.audioEl = '♪'

            } else {

                this._buttonToggleEl.children[0].className = 'off'

                this.audioEl = ''

            }

        })

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0

            this._audio.play()

        }

    }

    copyToClipboard() {

        let input = document.createElement('input')

        input.value = this.displayCalcEl

        document.body.appendChild(input)

        input.select()

        document.execCommand('Copy')

        input.remove()

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text')

            if (!isNaN(text)) {

                this.addOperation(parseFloat(text.replace(',', '.')).toString())

            }

        })

    }

    initKeyboard() {

        document.addEventListener('keyup', e => {

            switch (e.key) {

                case 'Escape':
                    this.clearAll()
                    this.playAudio()
                    break
    
                case 'Backspace':
                    this.clearEntry()
                    this.playAudio()
                    break

                case '.':
                case ',':
                    this.addDot()
                    this.playAudio()
                    break
                
                case 'Enter':
                case '=':
                    this.calc(false)
                    this.playAudio()
                    break
    
                        
                case '%':
                case '/':
                case '*':
                case '-':
                case '+':
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
                    this.addOperation(e.key)
                    this.playAudio()
                    break

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard()
            }

        })

    }

    clearAllHistoric() {

        this._historic = []

        this.setHistoricToDisplay()

    }

    clearEntryHistoric() {

        this._historic.pop()

        this.setHistoricToDisplay()

    }

    pushHistoric(value) {

        if (value) this._historic.push(value)

    }

    getLastHistoric() {

        return this._historic[this._historic.length - 1]

    }

    setLastHistoric(value) {

        this._historic[this._historic.length - 1] = value

    }

    addHistoric() {

        if (

            isNaN(this.getLastHistoric()) && isNaN(this.getLastOperation()) && this._historic.length > 0||
            !isNaN(this.getLastHistoric()) && !isNaN(this.getLastOperation())

        ) {

            this.setLastHistoric(this.getLastOperation())

        } else {

            this.pushHistoric(this.getLastOperation())

        }

    }

    setHistoricToDisplay(validation = true) {

        if (isNaN(this.getLastHistoric()) || !validation) {

            this.historicEl = this._historic.join(' ')

        }

    }

    clearAll() {

        this._operation = []

        this._lastOperator = ''

        this.lastNumber = ''

        this.clearAllHistoric()

        this.setOperationToDisplay()

    }

    clearEntry() {

        this._operation.pop()

        this.clearEntryHistoric()

        this.setOperationToDisplay()

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1]

    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value

    }

    isOperator(value) {

        return (['+', '-', '*', '/', '%'].indexOf(value) > -1)

    }

    getItem(isOperator = true, last = true) {

        let item, i

        if (last) {

            for (i = this._operation.length - 1; i >= 0; i--) {

                if (this.isOperator(this._operation[i]) === isOperator) {
    
                    item = this._operation[i]
    
                    break
    
                }
    
            }

        } else {

            for (i = 0; i <= this._operation.length - 1; i++) {

                if (this.isOperator(this._operation[i]) === isOperator) {
    
                    item = this._operation[i]
    
                    break
    
                }
    
            }

        }

        if (!item) item = (isOperator) ? this._lastOperator : this.lastNumber

        return item

    }

    setOperationToDisplay() {

        let lastNumber = this.getItem(false)

        if (!lastNumber) lastNumber = 0;

        this.displayCalcEl = lastNumber

    }

    calcPercent() {

        let percent

        if (this.getItem(true, false) === '*' || this.getItem(true, false) === '/' ) {

            percent = (this.getItem(false) / 100).toString()

        } else {

            percent = (this.getItem(false, false) * this.getItem(false) / 100).toString()

        }

        this.setLastOperation(percent)

        this.addHistoric()

        this.setHistoricToDisplay(false)

    }

    getResult() {

        try {

            return eval(this._operation.join('')).toString()

        } catch (e) {

            console.log(e)

            setTimeout(() => {

                this.setError()

                this.clearAllHistoric()

            }, 1)

        }

    }

    calc(toContinue = true) {

        if (this._operation.length === 0) return

        let last

        this._toContinue = toContinue

        this._lastOperator = this.getItem()

        if (this._operation.length < 3) {

            let firstNumber = this.getItem(false, false)

            if (!this._lastNumber) this._lastNumber = firstNumber

            this._operation = [firstNumber, this._lastOperator, this._lastNumber]

            this.clearAllHistoric()

            this.setHistoricToDisplay()

        }

        if (this._operation.length > 3) {

            last = this._operation.pop()

            this.lastNumber = this.getResult()

        } else if (this._operation.length === 3) {

            this._lastNumber = this.getItem(false)

        }

        if (last === '%') {

            this.calcPercent()

        } else {

            if (this.getItem() === '%') {

                this.calcPercent()

            } else {

                let result = this.getResult()

                if (typeof result === 'string') {

                    if (result.toString().split('').indexOf('.') > -1) {

                        result = parseFloat(parseFloat(result).toPrecision(15)).toString()
    
                    }

                }

                this._operation = [result]

                if (last) this._operation.push(last)

            }
            
        }

        if (!this._toContinue) {

            this.clearAllHistoric()

        }

        this.setOperationToDisplay()

    }

    pushOperation(value) {

        this._operation.push(value)

        if (this._operation.length < 3 && value === '%') {

            this.clearAll()

        } else if (this._operation.length > 3) {

            this.calc();

        }

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            // String

            if (isNaN(value)) {

                // change operator

                if (this._operation.length === 0) return;

                if (value !== '%') {

                    this.setLastOperation(value)

                } else {

                    this.pushOperation(value)

                    this.calc()

                }

            } else {

                // First Number

                this.pushOperation(value)

                this.setOperationToDisplay()

                this._toContinue = true

            }


        } else {

            // Number

            if (isNaN(value)) {

                this.pushOperation(value)

                if (this._historic.length === 0) {

                    this._historic = this._operation

                } else {

                    this.addHistoric()

                }

                this._toContinue = true

            } else {

                if (this._toContinue) {

                    let newValue = this.getLastOperation() + value

                    this.setLastOperation(newValue)

                } else {

                    this.clearAll()

                    this.pushOperation(value)

                    this._toContinue = true

                }

                

                this.setOperationToDisplay()

            }

        }

        this.addHistoric()

        this.setHistoricToDisplay()

    }

    setError() {

        this.displayCalcEl = 'Error'

    }

    addDot() {

        let lastOperation = this.getLastOperation()

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.')

        } else {

            this.setLastOperation(lastOperation + '.')

        }

        this.setOperationToDisplay()

    }

    execBtn(value) {

        this.playAudio()

        switch (value) {

            case 'c':
                this.clearAll()
                break

            case 'ce':
                this.clearEntry()
                break

            case 'percent':
                this.addOperation('%')
                break
            
            case 'division':
                this.addOperation('/')
                break
            
            case 'multiplication':
                this.addOperation('*')
                break
            
            case 'subtraction':
                this.addOperation('-')
                break
            
            case 'sum':
                this.addOperation('+')
                break
            
            case 'dot':
                this.addDot()
                break
            
            case 'equal':
                this.calc(false)
                break

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
                this.addOperation(value)
                break

            default:
                this.setError()            

        }

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll('#keyboard > ul > li');

        buttons.forEach(btn => {

            btn.addEventListener('click', () => {

                let textBtn = btn.className.replace('btn-', '')

                this.execBtn(textBtn)

            })

            btn.addEventListener('mouseover', () => {

                btn.style.cursor = 'pointer'

            })

        })

    }

    setDisplayDateTime() {

        this.dateEl = this.currentDate.toLocaleDateString(this._locale, {

            day: '2-digit',
            month: 'long',
            year: 'numeric'

        })
        this.timeEl = this.currentDate.toLocaleTimeString(this._locale)

    }
    
}