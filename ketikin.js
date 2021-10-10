const ketikin = (selector, options) => {
    const baseTypingSpeed = 5
    const maxTypingSpeed = 100
    const defaultTimeGap = 1000

    const invisibleChar = '&lrm;'
    const cursor = '<span id="ketikin-cursor">|</span>'

    options = Object.assign({
        texts: [],
        speed: 0,
        loop: false
    }, options)

    adjustSpeed = (speed) => {
        speed = speed > maxTypingSpeed ? maxTypingSpeed : speed
        speed = speed < 0 ? 0 : speed
        speed = maxTypingSpeed - speed
        return speed
    }

    getCursors = (element) => {
        return element.querySelectorAll('#ketikin-cursor')
    }

    removeCursors = (element) => {
        getCursors(element).forEach(bar => bar.remove())
    }

    addTypingChar = (element, char) => {
        element.innerHTML = element.innerHTML + char
        removeCursors(element)
    }

    addCursor = (element) => {
        element.innerHTML = element.innerHTML + cursor
    }

    swapTypingText = (element, text) => {
        element.innerHTML = text
        removeCursors(element)
    }

    type = (element, char, executionTime) => {
        setTimeout(() => addTypingChar(element, char), executionTime)
        setTimeout(() => addCursor(element), executionTime)
    }

    backSpace = (element, text, executionTime) => {
        setTimeout(() => swapTypingText(element, text), executionTime)
        setTimeout(() => addCursor(element), executionTime)
        return text.substring(0, text.length - 1)
    }

    clearText = (element) => {
        element.innerHTML = invisibleChar
    }

    arrangeExecutionTime = (lastExecutionTime, speedBaseline) => {
        return lastExecutionTime + Math.floor(Math.random() * adjustSpeed(options.speed)) + speedBaseline
    }

    orchestrate = (element, text, shouldBackSpacing, executionTime) => {
        clearText(element)

        for(const char of text) {
            type(element, char, executionTime)
            executionTime = arrangeExecutionTime(executionTime, baseTypingSpeed)
        }

        if(shouldBackSpacing) {
            let backSpacingSpeed = baseTypingSpeed
            executionTime = executionTime + defaultTimeGap
            
            while(text) {
                text = backSpace(element, text, executionTime)
                executionTime = arrangeExecutionTime(executionTime, backSpacingSpeed)
                backSpacingSpeed = Math.floor(backSpacingSpeed * 0.7)
            }

            setTimeout(() => swapTypingText(element, text) | addCursor(element), executionTime)
        }

        return executionTime
    }

    playOrchestration = (element, texts) => {
        let executionTime = 0
        let shouldBackSpacing = false

        texts.forEach((text, index) => {
            shouldBackSpacing = (index < texts.length - 1 && !options.loop) || options.loop
            executionTime = orchestrate(element, text, shouldBackSpacing, executionTime) + defaultTimeGap
        })

        if(options.loop) {
            setTimeout(() => playOrchestration(element, texts), executionTime)
        }
    }

    document.querySelectorAll(selector).forEach(element => {
        playOrchestration(element, (options.texts || [element.innerText]).filter(text => text))
    })
}
