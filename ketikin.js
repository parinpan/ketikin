const ketikin = (selector, options) => {
    const baseTypingSpeed = 5
    const maxTypingSpeed = 100
    const defaultTimeGap = 1000

    const invisibleChar = '&lrm;'
    const cursorID = 'ketikin-cursor'

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

    createCursor = () => {
        let cursor = document.createElement("span")
        let cursorContent = document.createTextNode("|")

        cursor.id = cursorID
        cursor.appendChild(cursorContent)

        return cursor
    }

    getCursor = (element) => {
        return element.querySelector('#' + cursorID) || document.createElement("cursor")
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
        element.appendChild(createCursor())
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

    clearText = (element) => {
        element.innerHTML = invisibleChar
    }

    arrangeExecutionTime = (lastExecutionTime, speedBaseline) => {
        return lastExecutionTime + Math.floor(Math.random() * fenceSpeed(options.speed)) + speedBaseline
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
        } else {
            setTimeout(() => animateCursor(element), executionTime)
        }
    }

    document.querySelectorAll(selector).forEach(element => {
        playOrchestration(element, (options.texts || [element.innerText]).filter(text => text))
    })
}
