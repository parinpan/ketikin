const ketikin = (selector, options) => {
    const baseTypingSpeed = 5
    const maxTypingSpeed = 100
    const defaultTimeGap = 1000

    const invisibleChar = '&lrm;'
    const cursor = '<span id="{id}">|</span>'

    options = Object.assign({
        texts: null,
        speed: 0,
        loop: false
    }, options)

    fenceSpeed = (speed) => {
        speed = speed > maxTypingSpeed ? maxTypingSpeed : speed
        speed = speed < 0 ? 0 : speed
        speed = maxTypingSpeed - speed
        return speed
    }

    getSeq = (element) => {
        return element.getAttribute('ketikin-seq')   
    }

    getCursor = (element) => {
        return element.querySelector('#' + getSeq(element)) || document.createElement("cursor")
    }

    animateCursor = (element) => {
        getCursor(element).animate([{opacity: 0.5}], {
            duration: defaultTimeGap,
            iterations: Infinity
        })
    }

    removeCursor = (element) => {
        getCursor(element).remove()
    }

    addCursor = (element) => {
        element.innerHTML = element.innerHTML + cursor.replace('{id}', getSeq(element))
    }

    addTypingChar = (element, char) => {
        element.innerHTML = element.innerHTML + char
        removeCursor(element)
    }

    swapTypingText = (element, text) => {
        element.innerHTML = text
        removeCursor(element)
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

    arrangeExecutionTime = (lastExecutionTime, speedBaseline) => {
        return lastExecutionTime + Math.floor(Math.random() * fenceSpeed(options.speed)) + speedBaseline
    }

    orchestrate = (element, text, shouldBackSpacing, executionTime) => {
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
        } else {
            setTimeout(() => animateCursor(element), executionTime)
        }
    }

    document.querySelectorAll(selector).forEach((element, index) => {
        let elementText = element.innerText
        element.innerHTML = invisibleChar
        element.setAttribute('ketikin-seq', 'ketikin-' + index)
        playOrchestration(element, (options.texts || [elementText]).filter(text => text))
    })
}
