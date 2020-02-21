
// Inspired by http://jsfiddle.net/vKZLn/1/
class Spritzer {
    constructor(el, returnFx) {
        el.classList.add('spritzed')
        el.style.padding = (parseInt(window.getComputedStyle(el)['font-size']) / 1.3) + 'px'
        el.appendChild(document.createElement("div"))
        this.playing = true
        this.currentTimer = null
        // function isKeyWord(word) {
        //     var isKey = false
        //     keyWords.forEach(key => { if (word.includes(key)) isKey = true })
        //     return isKey
        // }
        function multipliers(word) {
            var len = word.length - /[,\.\!]$/.test(word)
            var multi = 1
            if (len > 13) { 
                multi *= 1.6
            } else if (len > 7) { 
                multi *= 1.3
            }
            // maybe add something for punctuation and/or last word
            if (keyWords.some(key => word.includes(key))) multi *= 2.5
            return multi
        }
        function processWord(word) {
            var orp = orpPos(word), letters = word.split('')
            return letters.map(function (letter, idx) {
                if (idx === orp)
                    return '<span class="highlight">' + letter + '</span>'
                return letter
            }).join('')
        }
        function positionWord() {
            var wordEl = el.firstElementChild, highlight = wordEl.firstElementChild
            if (highlight) {
                var centerOffsetX = (highlight.offsetWidth / 2) + highlight.offsetLeft, centerOffsetY = (highlight.offsetHeight / 2) + highlight.offsetTop
                wordEl.style.left = ((el.clientWidth / 2) - centerOffsetX) + 'px'
                wordEl.style.top = ((el.clientHeight / 2) - centerOffsetY) + 'px'
            }
        }
        function orpPos(word) {
            var len = word.length - /[,\.\!]$/.test(word)
            if (len == 1) return 0
            if (len < 6) return 1
            if (len < 10) return 2
            if (len < 14) return 3
            return 4
        }
        var currentWord = 0, delay
        var keyWords = []
        var wordTime = Date.now()
        var displayNextWord = function () {
            // var key = this.keys[currentWord]
            var word = this.words[currentWord]
            if (typeof word == 'undefined') {
                statementDone()
                return
            }
            window.el = el
            // if (this.multis[currentWord] == .2) {
            //     // el.firstElementChild.setAttribute("style","font-style:italic;")
            //     el.firstElementChild.style.color = "rgba(50,25,50,.75)"
            // } else {
            //     el.firstElementChild.style.color = null
            // }
            el.firstElementChild.innerHTML = word
            if (currentWord !== this.words.length) {
                console.log(Date.now() - wordTime + ' - ' + word)
                wordTime = Date.now()
                positionWord()
                // this.currentTimer = setTimeout(displayNextWord, delay * this.multis[currentWord++] * (/\.$/.test(word) ? 1.6 : 1))
                this.currentTimer = setTimeout(displayNextWord, delay * this.multis[currentWord++])
            } else {
                this.currentTimer = setTimeout(statementDone, delay * this.multis[currentWord])
            }
        }.bind(this)
        var statementDone = function () {
            this.pause()
            currentWord = 0
            if (typeof returnFx === 'function')
                returnFx()
        }.bind(this)
        this.render = function (text, wpm, kW) {
            // this.words = text.replace(/^\s+|\s+|\n$/,'').split(/\s+/).map(processWord)
            this.words = text.split(/\s+/)
            // this.keys = this.words.map(isKeyWord)
            this.multis = this.words.map(multipliers)
            // if (this.words[3] == 'is' && this.words[4] != 'brainwashed') {
            //     console.log('splice')
            //     this.words.splice(4,0,'brainwashed')
            //     this.multis.splice(4,0,.2)
            // }
            this.words = this.words.map(processWord)
            // for (let i = this.words.length; i > 0; i--) {
            //     this.words.splice(i,0,' ')
            // }
            this.words.push('')
            this.multis.push(1.1)
            delay = 60000 / wpm
            keyWords = kW
            this.playing = true
            clearTimeout(this.currentTimer)
            displayNextWord()
        }
        this.play = function () {
            this.playing = true
            displayNextWord()
        }
        this.pause = function () {
            this.playing = false
            clearTimeout(this.currentTimer)
        }
        this.toggle = function () {
            if (this.playing)
                this.pause()
            else
                this.play()
        }
    }
}
