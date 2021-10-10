const ketikin = (selector, options) => {
    const baseTypingSpeed = 5
    const maxTypingSpeed = 100
    const defaultTimeGap = 1000

    const invisibleChar = '&lrm;'
    const typingBar = '<span id="ketikin-bar">|</span>'

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

    removeTypingBar = (element) => {
        element.querySelectorAll('#ketikin-bar').forEach(bar => bar.remove())
    }

    addTypingChar = (element, char) => {
        element.innerHTML = element.innerHTML + char
        removeTypingBar(element)
    }

    addTypingBar = (element) => {
        element.innerHTML = element.innerHTML + typingBar
    }

    swapTypingText = (element, text) => {
        element.innerHTML = text
        removeTypingBar(element)
    }

    type = (element, char, executionTime) => {
        setTimeout(() => addTypingChar(element, char), executionTime)
        setTimeout(() => addTypingBar(element), executionTime)
    }

    backSpace = (element, text, executionTime) => {
        setTimeout(() => swapTypingText(element, text), executionTime)
        setTimeout(() => addTypingBar(element), executionTime)
        return text.substring(0, text.length - 1)
    }

    clearText = (element) => {
        element.innerHTML = invisibleChar
    }

    arrangeExecutionTime = (lastExecutionTime, speedBaseline) => {
        return lastExecutionTime + Math.floor(Math.random() * adjustSpeed(options.speed)) + speedBaseline
    }

    orchestrate = (element, text, shouldBackSpacing, executionTime) => {
        let typingText = text

        // clear text first before typing
        clearText(element)

        for(const char of typingText) {
            type(element, char, executionTime)
            executionTime = arrangeExecutionTime(executionTime, baseTypingSpeed)
        }

        if(shouldBackSpacing) {
            backSpacingSpeed = baseTypingSpeed
            executionTime = executionTime + defaultTimeGap
            
            while(typingText) {
                typingText = backSpace(element, typingText, executionTime)
                executionTime = arrangeExecutionTime(executionTime, backSpacingSpeed)
                backSpacingSpeed = Math.floor(backSpacingSpeed * 0.7)
            }

            // clear residual text
            setTimeout(() => swapTypingText(element, typingText) | addTypingBar(element), executionTime)
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
