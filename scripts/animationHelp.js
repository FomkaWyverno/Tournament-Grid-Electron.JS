const buttonHelp = document.querySelector('.main__help');
const helpElements = document.querySelectorAll('.help__hide');
const team = document.querySelector('.tField__team');
const cursor = document.querySelector('.tField__cursor');
const playersNick = document.querySelectorAll('.tField__nick');
 
const animationBlock = {
    animation: {
        animationInterval: undefined,
        animationTimeout: new Set(),
        animationRun: false,
    },
    cursor: cursor,
    team: team,
    nick1: playersNick[0],
    nick2: playersNick[1]
}
buttonHelp.addEventListener('click', () => {
    buttonHelp.classList.toggle('help__active');
    helpElements.forEach(element => {
        element.classList.toggle('help__hide');
    });
    animationToggle(animationBlock);
});





function animationToggle(animationBlock) { // Анимационный переключатель.
    if (animationBlock.animation.animationRun) {
        animationStop(animationBlock);
        animationBlock.animation.animationRun = false;
    } else {
        playersNick.forEach(element => { // При начале анимации ставим первые ники
            element.textContent = element.getAttribute('data-text-first');
            element.setAttribute('data-text-select',1);
        });
        animationGo(animationBlock);
        animationBlock.animation.animationRun = true;
    }
}

function animationGo(animationBlock) { // Начинаем Анимацию.
    animation(animationBlock.animation.animationTimeout,animationBlock.cursor,animationBlock.team,animationBlock.nick1,animationBlock.nick2);
    animationBlock.animation.animationInterval = setInterval(() => 
    {
        animation(animationBlock.animation.animationTimeout,animationBlock.cursor,animationBlock.team,animationBlock.nick1,animationBlock.nick2);
    },8000);
}

function animationStop(animationBlock) { // Останавливаем Анимацию
    clearInterval(animationBlock.animation.animationInterval); // Удаляем цикл
    animationBlock.animation.animationTimeout.forEach(idTimeout => { // Удаляем внутрициклевые задержки  анимации
        clearTimeout(idTimeout);
        animationBlock.animation.animationTimeout.delete(idTimeout);
    });
}

function animation(idTimeout,cursor,team,nick1,nick2) { // Общая анимация помощи с полем команды.
    cursor.classList.add('moveStage1');
    let id1 = setTimeout(() => { // Через секунду курсор будет на поле, и примет картинку Ховера Идем на первый ник // Также сохраняем ID задержки в SET
        cursor.classList.add('hover');
        team.classList.add('hover');
        changeText(nick1);
        if (idTimeout.has(id1)) {
            idTimeout.delete(id1);
        }
    },1000);
    idTimeout.add(id1);
    let id2 = setTimeout(() => { // 4 seconds Переходит на второй ник
        cursor.classList.remove('moveStage1');
        cursor.classList.add('moveStage2');
        

        changeText(nick2);

        let id3 = setTimeout(() => { // 2 seconds (4+2 = 6seconds) // Курсор Будет на втором нике
            cursor.classList.remove('moveStage2');
            let id4 = setTimeout(() => {
                cursor.classList.remove('hover');
                team.classList.remove('hover');
                if (idTimeout.has(id4)) {
                    idTimeout.delete(id4);
                }
            },200);
            if (idTimeout.has(id3)) {
                idTimeout.delete(id3);
            }
        },2000);
        if (idTimeout.has(id2)) {
            idTimeout.delete(id2);
        }
    },4000);
    idTimeout.add(id2);
}


function changeText(nick) { // Анимация для изминения текста.
    deleteText(nick);
    setTimeout(() => {
        printText(nick);
    },2000);
}

function deleteText(nick) { // Анимация стирания текста
    setTimeout(() => {
        nick.style.animation = `deleteText .5s steps(${nick.textContent.length}) 1 forwards`;
        textCursorOn(nick);
    },1000);
}
function printText(nick) { // Анимация печатанья текста.
    if (nick.getAttribute("data-text-select") == 1) {
        nick.setAttribute("data-text-select","2");
        nick.textContent = nick.getAttribute("data-text-second");
    } else {
        nick.setAttribute("data-text-select","1");
        nick.textContent = nick.getAttribute("data-text-first");
    }
    nick.style.animation = `printText .4s steps(${nick.textContent.length}) 1 forwards`;
    setTimeout(() => {
        textCursorOff(nick);
    },600);
}

function textCursorOn(nick) { // Включаем текстовый курсор
    nick.classList.add('textCursorActive');
}

function textCursorOff(nick) { // Выключаем текстовый курсор
    nick.classList.remove('textCursorActive');
}