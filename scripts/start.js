const inputTeams = document.querySelector('#input-teams');
const inputPlayer = document.querySelector('#input-players-in-team');
const increaseTeams = document.querySelector('#inputTeams__increase');
const decreaseTeams = document.querySelector('#inputTeams__decrease');
const increasePlayers = document.querySelector('#inputPlayers__increase');
const decreasePlayers = document.querySelector('#inputPlayers__decrease');
const inputNick = document.querySelector('#input-players-nick');
const labelNick = document.querySelector('#nickLabel');
const counterNick = document.getElementById('counterPlayer');
const fieldNickElement = document.getElementById('fieldNick');
const nextPage = document.querySelector('.main__saveAndStart');


const fieldTeams = {
    input: inputTeams,
    confines: {
        legalCount: {
            locate: -1,
            step: [2,4,8]
        },
        max: 8,
        min: 2
    },
    controlValue: {
        increaseButton: increaseTeams,
        decreaseButton: decreaseTeams
    }
}
const fieldPlayers = {
    input: inputPlayer,
    confines: {
        max: 4,
        min: 1
    },
    controlValue: {
        increaseButton: increasePlayers,
        decreaseButton: decreasePlayers
    }
}
const fieldNick = {
    element: fieldNickElement,
    input: inputNick,
    counter: counterNick,
    labelNick: {
        label: labelNick,
        defaultText: labelNick.textContent
    },
    players: []
}
const fields = [fieldPlayers,fieldTeams];

fieldNick.input.addEventListener('input', () => {
    checkValue(fieldNick);
});

function maxMinValue(value, min, max) {  // Узнаем выходит ли за пределы значение, если нет то возращаем текущее значение
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

function restrictions(field) { // При вводе данных проверяем пределы значения.
    field.input.addEventListener('input',() => {
        field.input.value = maxMinValue(field.input.value, field.confines.min, field.confines.max);
        eventHaveValue(); // Проверяем заполненные ли все поля?
    });
}

function checkValue(field) { // Проверяем если что то в строке или нет.
    if (field.input.value != '') {
        field.input.classList.add('valid');
    } else {
        field.input.classList.remove('valid');
    }
}

function eventCheckValue(field) { // Ивент для инпутов что бы проверить значение checkValue()
    field.input.addEventListener('input',() => {
        checkValue(field);
    });
}

function increaseField(field) { // Увеличиваем значение с учетом ограничений
    let value = field.input.value;
    value = maxMinValue(++value,field.confines.min,field.confines.max);
    field.input.value = value;
}

function decreaseField(field) { // Уменьшаем значение с учетом ограничений
    let value = field.input.value;
    value = maxMinValue(--value, field.confines.min,field.confines.max);
    field.input.value = value;
}

function eventArrowsField(field) { // Добавляем ивент что бы кнопки увеличивали/уменьшали значение
    field.controlValue.increaseButton.addEventListener('click', () => {
        increaseField(field);
        checkValue(field);
        eventHaveValue(); // Проверяем введены ли все поля?
    });
    field.controlValue.decreaseButton.addEventListener('click', () => {
        decreaseField(field);
        checkValue(field);
        eventHaveValue(); // Проверяем введены ли все поля?
    });
}

function eventStepNumber(field) { // Ивент для ступенчистого инпута для кнопок...
    field.input.addEventListener('input', () => {
        let value = field.input.value;
        const step = field.confines.legalCount.step;
        let l = 0;
        for (element of step) {
            if (value <= element) {
                field.confines.legalCount.locate = l;
                break;
            }
            l++;
        }
    });
    field.controlValue.increaseButton.addEventListener('click', () => {
        const legal = field.confines.legalCount;
        let locate = legal.locate;
        if (locate+1 < legal.step.length) {
            locate++;
            field.input.value = legal.step[locate];
            legal.locate = locate;
            checkValue(field);
        }
    });
    field.controlValue.decreaseButton.addEventListener('click', () => {
        const legal = field.confines.legalCount;
        let locate = legal.locate;
        if (locate-1 >= 0) {
            locate--;
            field.input.value = legal.step[locate];
            legal.locate = locate;
            checkValue(field);
        }
    });
}

function eventClickButtonControl(field) { // При клике на кнопку которая управляет значение подсвечиваем инпут.
    const timeColor = 1000;
    field.controlValue.increaseButton.addEventListener('click', () => {
        field.input.classList.add('click');
        setTimeout(() => {
            field.input.classList.remove('click');
        },timeColor);
    });
    field.controlValue.decreaseButton.addEventListener('click', () => {
        field.input.classList.add('click');
        setTimeout(() => {
            field.input.classList.remove('click');
        },timeColor);
    });
}

function eventHaveValue() { // Проверка заполненные все поля? Что бы начать ввод ников.
    let formComplete = true;
    fields.forEach((f) => {
        if (f.input.value == '') {
            formComplete = false;
        }
    });
    if (formComplete) {
        inputNick.removeAttribute('disabled');
        counterNick.textContent = `Счётчик: ${fieldNick.players.length} из ${inputTeams.value * inputPlayer.value}`; // Пишем сколько нужно будет игроков и сколько уже есть
    }
}

function initializeField(field,setting) { // Иницилизация инпутов
    if (setting.restrictions == undefined || setting.restrictions) {
        restrictions(field);
    }
    if (setting.eventCheckValue == undefined || setting.eventCheckValue) {
        eventCheckValue(field);
    }
    if (setting.eventArrowsField == undefined || setting.eventArrowsField) {
        eventArrowsField(field);
    }
    if (setting.eventStepNumber == undefined || setting.eventStepNumber) {
        eventStepNumber(field);
    }
    if (setting.eventClickButtonControl == undefined || setting.eventClickButtonControl) {
        eventClickButtonControl(field);
    }
}

function dontHaveThisNick(arrayP, nick) { // Функция проверки списка ников.
    let dontHave = true;
    arrayP.forEach(element => {
        if (element == nick) {
            dontHave = false;
        }
    });
    return dontHave;
}

function checkLegalCountTeam(countTeam,input) {
    const goodNumber = [2,4,8];
    if (!hasNumber(goodNumber,countTeam)) {
        for (let item of goodNumber) {
            if (countTeam < item) {
                countTeam = item;
                break;
            }
        }
        input.value = countTeam;
    }
    function hasNumber(array,number) {
        for (let n of array) {
            if (n == number) {
                return true;
            }
        }
        return false;
    }
}


fieldNick.input.addEventListener('keydown', (keyEvent) => { // После первого ввода ника запрещаем менять настройки турнира.
    if (keyEvent.key=='Enter') {
        if (!fieldPlayers.input.hasAttribute('disabled')) {
            fieldPlayers.input.setAttribute('disabled','');
            fieldPlayers.controlValue.decreaseButton.setAttribute('disabled','');
            fieldPlayers.controlValue.increaseButton.setAttribute('disabled','');
            fieldPlayers.controlValue.decreaseButton.classList.add('disabled');
            fieldPlayers.controlValue.increaseButton.classList.add('disabled');
        }
        if (!fieldTeams.input.hasAttribute('disabled')) {
            fieldTeams.input.setAttribute('disabled','');
            fieldTeams.controlValue.decreaseButton.setAttribute('disabled','');
            fieldTeams.controlValue.increaseButton.setAttribute('disabled','');
            fieldTeams.controlValue.decreaseButton.classList.add('disabled');
            fieldTeams.controlValue.increaseButton.classList.add('disabled');
        }
    }
    
});
fieldNick.input.addEventListener('keydown', (keyEvent) => { // Добавляем в список игрока.
    if (keyEvent.key === 'Enter') {
        if (fieldNick.input.value != '' &&
            dontHaveThisNick(fieldNick.players, fieldNick.input.value) &&
            fieldNick.players.length < inputTeams.value * inputPlayer.value) {
            fieldNick.players.push(fieldNick.input.value);
            fieldNick.input.value = '';
            counterNick.textContent = `Счётчик: ${fieldNick.players.length} из ${inputTeams.value * inputPlayer.value}`; // Пишем сколько нужно будет игроков и сколько уже есть.
            if (fieldNick.players.length == inputTeams.value * inputPlayer.value) {
                nextPage.classList.remove('disable');
                fieldNick.input.classList.add('readyNick');

                const fileExport = {
                    type: "setting",
                    content: {
                        teams: fieldTeams.input.value,
                        players: fieldPlayers.input.value,
                        contentPlayers: fieldNick.players
                    }
                    
                }
                const file = JSON.stringify(fileExport);
                const webSocket = new WebSocket('ws://localhost:8971');
                webSocket.onopen = () => {
                    webSocket.send(file);
                }
            }
        }
            
    }
});
fieldNick.input.addEventListener('input', () => { // Автоматическая проверка на ник.
    let error = !dontHaveThisNick(fieldNick.players,fieldNick.input.value);
    if (error) {
        if (!fieldNick.element.classList.contains('error')) {
            fieldNick.element.classList.add('error');
        }
    } else {
        if (fieldNick.element.classList.contains('error')) {
            fieldNick.element.classList.remove('error');
        }
    }
});

initializeField(fieldPlayers,{eventStepNumber: false});
initializeField(fieldTeams,{eventArrowsField: false});

fieldTeams.input.addEventListener('blur', () => { // Легальная для этой ли версии программы количество команд. (При unFocus идет проверка) 
    checkLegalCountTeam(fieldTeams.input.value, fieldTeams.input);
    checkValue(fieldTeams);
});