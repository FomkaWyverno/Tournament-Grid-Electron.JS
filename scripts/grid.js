const container = document.getElementById('place');
const ws = new WebSocket('ws://localhost:8971');
    ws.onopen = () => {
    ws.onmessage = (file) => {
        const setting = JSON.parse(file.data);
        const grid = new Grid(setting);

        container.appendChild(toHTML(grid));
    }                                                    
    ws.send(JSON.stringify({type:"getSetting"}));
    
}



function Grid(settings) {//Абстрактная визиализация сетки
    console.log(settings);
    const roundsCount = getRounds(settings.teams);
    this.roundCount = roundsCount;
    this.round = new Array(roundsCount);
    let teamsLeft = settings.teams;
    for (let i = 0, j = this.round.length; i < this.round.length; i++,j--) {
        let nameRound;
        if (i == this.round.length-1) {
            nameRound = "Победители!";
        } else if (i == this.round.length-2) {
            nameRound = "Финал";
        } else {
            nameRound = `${i+1} Раунд`;
        }
        this.round[i] = new Round(
                                nameRound,
                                getResultRoundCount(teamsLeft),
                                i==0 ?settings.contentPlayers:undefined,
                                i==this.round.length-2,
                                i==this.round.length-1,
                                settings.players,
                                i==0,
                                j,
                                i!=this.round.length-1,
                                i);
        teamsLeft = Math.ceil(teamsLeft/2);
    }


    function getRounds(countTeam) {
        let round = 0;
        while (countTeam != 1) {
            countTeam /= 2;
            round++;
        }
        return ++round;
    }
    function getResultRoundCount(countTeam) {
        let resultRoundCount = countTeam/4;
        return Math.ceil(resultRoundCount);

    }
}
function Round(nameRound,resultRoundCount,playersArray,isFinal,isWinner,playersCount,isFirstRound,numberRound,isHaveNextRound,elementID) {//Абстрактная визиализация раунда
    this.nameRound = nameRound;
    this.typeElement = 'div';
    this.class = 'grid__round';
    this.isHaveNextRound = isHaveNextRound;
    this.elementID = elementID;
    if (resultRoundCount < 1) {
        resultRoundCount = 1;
    }
    const playersArrayRandom = new Array();
    if (playersArray != undefined) {
            const havePlayer = new Set();
            while(true) {
            let number = randomNumber(playersArray.length);

            if (!havePlayer.has(number)) {
                playersArrayRandom.push(playersArray[number]);
                havePlayer.add(number);
            }

            if (havePlayer.size == playersArray.length) {
                break;
            }
        }
    }
    this.resultsRound = new ResultsRound(resultRoundCount,playersArrayRandom,isFinal,isWinner,playersCount,isFirstRound,numberRound);

    function randomNumber(max) {
        return Math.floor(Math.random() * max);
    }
}
function ResultsRound(resultRoundCount, players,isFinal,isWinner,playersCount,isFirstRound,numberRound) {//Абстрактная визиализация РезультатовРаунда
    this.resultRound = new Array(resultRoundCount);
    this.typeElement = 'div';
    this.class = 'grid__resultsRound';
    for (let i = 0; i < this.resultRound.length; i++) {
        let matchs = isFinal || isWinner ? 1 : 2;
        let from = i*(playersCount*4);
        let to = playersCount*4+(i*(playersCount*4));
        
        this.resultRound[i] = new ResultRound(matchs,
                                              isFinal,
                                              isWinner,
                                              playersCount,
                                              isFirstRound?getPlayers(players,from,to): undefined,
                                              numberRound,
                                              i,
                                              Math.ceil((i+1)/2)-1);
    }
}
function ResultRound(matchCount,isFinal,isWinner,playersCount,players,numberRound,elementID,nextElementID) {//Абстрактная визиализация РезультатаРаунда(2-х матчей)
    this.match = new Array(matchCount);
    this.lines = !isWinner;
    this.isFinal = isFinal;
    this.numberRound = numberRound;
    this.elementID = elementID;
    this.nextElementID = nextElementID;
    this.typeElement = 'div';
    this.class = 'grid__resultRound';
    for (let i = 0; i < this.match.length; i++) {
        let countTeam = isWinner ? 1 : 2;
        let from;
        let to;
        if (players != undefined) {
            from = i*(playersCount*2);
            to = playersCount*2+(i*(playersCount*2));
        }
        this.match[i] = new Match(countTeam,
                                  playersCount,
                                  players != undefined ? getPlayers(players,from,to) : undefined,
                                  i,
                                  elementID % 2 == 0 ? 0 : 1
                                  );
    }
}
function Match(teamCount,playersCount,players,elementID,nextElementID) {//Абстрактная визиализация Матча
    this.team = new Array(teamCount);
    this.typeElement = 'div';
    this.class = 'grid__match';
    this.elementID = elementID;
    this.nextElementID = nextElementID;
    for (let i = 0; i < this.team.length; i++) {
        let from;
        let to;
        if (players != undefined) {
            from = i*playersCount;
            to = playersCount+(i*playersCount);
        }
        this.team[i] = new Team(playersCount,
                                players != undefined ? getPlayers(players,from,to) : undefined,
                                i,
                                elementID % 2 == 0 ? 0:1
                                );
    }
}
function Team(playerCount, players,elementID,nextElementID) {//Абстрактная визиализация Командыё
    this.player = new Array(playerCount);
    this.typeElement = 'div';
    this.class = 'grid__team';
    this.elementID = elementID;
    this.canGoNextRound = true;
    this.nextElementID = nextElementID;
    for (let i = 0; i < playerCount; i++) {
        this.player[i] = new Player(players != undefined ? players[i] : '');
    }
}
function Player(nick) {//Абстрактная визиализация Игрока
    this.typeElement = 'div';
    this.class = 'grid__player';
    this.nick = nick;
}



function getPlayers(arrayPlayers, from, to) {
    const array = new Array();
    for (let i = from; i < to; i++) {
        array.push(arrayPlayers[i]);
    }
    return array;
}

function toHTML(grid) { // Преобразуем в HTML
    const gridHTML = document.createElement('section'); // Создаем секцию.
    gridHTML.classList.add('grid'); // Создаем секцию Сетку
    grid.round.forEach(roundElement => {
        const htmlRound = document.createElement(roundElement.typeElement); // Создание Раунда
        htmlRound.classList.add(roundElement.class);
    
        const htmlRoundName = document.createElement('span'); // Добавляем описание раунда
        htmlRoundName.classList.add('grid__nameRound');
        htmlRoundName.textContent = roundElement.nameRound; // Устанавливаем текстовый контент для описание РАУНДА
        
        htmlRound.appendChild(htmlRoundName); // Добавляем описание раунда в РАУНД

        const htmlResultsRounds = document.createElement(roundElement.resultsRound.typeElement);
        htmlResultsRounds.classList.add(roundElement.resultsRound.class);
        htmlRound.appendChild(htmlResultsRounds);

        roundElement.resultsRound.resultRound.forEach(resultRoundElement => {
            const htmlResultRound = document.createElement(resultRoundElement.typeElement);
            htmlResultRound.classList.add(resultRoundElement.class);
            htmlResultRound.classList.add(resultRoundElement.elementID);
            
            if(resultRoundElement.numberRound == 3) {
                htmlResultRound.classList.add('round3');
            }
            if (resultRoundElement.isFinal) {
                htmlResultRound.classList.add('final');
            }

            resultRoundElement.match.forEach(matchElement => {
                const htmlMatch = document.createElement(matchElement.typeElement);
                htmlMatch.classList.add(matchElement.class);
                htmlMatch.classList.add(matchElement.elementID);
                
                matchElement.team.forEach(teamElement => {
                    const htmlTeam = document.createElement(teamElement.typeElement);
                    htmlTeam.classList.add(teamElement.class);
                    htmlTeam.classList.add(`roundID:${roundElement.elementID}`);
                    htmlTeam.classList.add(`resRoundID:${resultRoundElement.elementID}`);
                    htmlTeam.classList.add(`mID:${matchElement.elementID}`);
                    htmlTeam.classList.add(`tID:${teamElement.elementID}`);

                    if (roundElement.isHaveNextRound) {
                        htmlTeam.addEventListener('click', () => {
                            setTimeout(() => {
                                if (teamElement.canGoNextRound) {
                                    insertTeam(
                                       grid,
                                       gridHTML,
                                       roundElement.elementID,
                                       roundElement.elementID+1,
                                       resultRoundElement.elementID,
                                       matchElement.elementID,
                                       teamElement.elementID,
                                       resultRoundElement.nextElementID,
                                       matchElement.nextElementID,
                                       teamElement.nextElementID
                                       );
                                }
                            },300);
                            
                        });
                    }
                    


                    teamElement.player.forEach(playerElement =>{
                        const htmlPlayer = document.createElement(playerElement.typeElement);
                        htmlPlayer.classList.add(playerElement.class);

                        const htmlNick = document.createElement('span');
                        htmlNick.classList.add('grid__nick');
                        htmlNick.textContent = playerElement.nick;
                        

                        const htmlInputForNick = document.createElement('input');
                        htmlInputForNick.classList.add('grid__inputForNick');
                        htmlInputForNick.value = htmlNick.textContent;

                        htmlNick.addEventListener('dblclick', () =>{
                            teamElement.canGoNextRound = false;
                            htmlPlayer.style.textOverflow = "clip";
                            htmlInputForNick.style.zIndex = 1;
                            htmlInputForNick.style.opacity = 1;
                            htmlInputForNick.focus();
                            htmlNick.style.opacity = 0;

                        });
                        htmlInputForNick.addEventListener('blur',() => {
                            
                            htmlPlayer.style.textOverflow = "ellipsis";
                            htmlInputForNick.style.zIndex = -1;
                            htmlInputForNick.style.opacity = 0;
                            htmlNick.style.opacity = 1;
                            htmlNick.textContent = htmlInputForNick.value;

                            teamElement.canGoNextRound = true;
                        });
                        htmlInputForNick.addEventListener('keydown',keyEvent => {
                            if (keyEvent.key === 'Enter') {
                                htmlInputForNick.blur();
                            }
                        });
                        
                        htmlPlayer.appendChild(htmlNick);
                        htmlPlayer.appendChild(htmlInputForNick);
                        htmlTeam.appendChild(htmlPlayer);
                    }); 

                    changeNick(htmlTeam);
                    htmlMatch.appendChild(htmlTeam);
                });

                htmlResultRound.appendChild(htmlMatch);
            });

            if (resultRoundElement.lines) {
                const htmlLines = document.createElement('div');
                htmlLines.classList.add('grid__lines');
                const htmlSpan = document.createElement('span');
                htmlSpan.appendChild(document.createElement('span')); 
                htmlLines.appendChild(htmlSpan);
                htmlResultRound.appendChild(htmlLines);
            }
            htmlResultsRounds.appendChild(htmlResultRound);
        });

        gridHTML.appendChild(htmlRound);
    });

    console.log(gridHTML);
    return gridHTML;
}

function insertTeam(grid,gridHTML,fromRoundID,toRoundID,fromResultID,fromMatchID,fromTeamID,toResultID,toMatchID,toTeamID) {
    const htmlFromRound = gridHTML.childNodes[fromRoundID];
    const htmlToRound = gridHTML.childNodes[toRoundID];

    const htmlFromTeam = htmlFromRound.childNodes[1].childNodes[fromResultID].childNodes[fromMatchID].childNodes[fromTeamID];
    const htmlToTeam = htmlToRound.childNodes[1].childNodes[toResultID].childNodes[toMatchID].childNodes[toTeamID];
    removePlayers(htmlToTeam,htmlToTeam.childNodes);
    const cloneFromTeamChild = new Array();
    htmlFromTeam.childNodes.forEach(node => {
        cloneFromTeamChild.push(node.cloneNode(true));
    });
    cloneFromTeamChild.forEach(cloneNode => {
        htmlToTeam.appendChild(cloneNode);
    });
    

    const roundID = htmlToTeam.classList[1].replace('roundID:','');
    const resultRoundID = htmlToTeam.classList[2].replace('resRoundID:','');
    const matchID = htmlToTeam.classList[3].replace('mID:','');
    const teamID = htmlToTeam.classList[4].replace('tID:','');

    htmlToTeam.childNodes.forEach(playerNode => {

        const span = playerNode.childNodes[0];
        const input = playerNode.childNodes[1];
        

        span.addEventListener('dblclick', () => {
            grid.round[roundID].resultsRound.resultRound[resultRoundID].match[matchID].team[teamID].canGoNextRound = false;
            playerNode.style.textOverflow = "clip";
            input.style.zIndex = 1;
            input.style.opacity = 1;
            input.focus();
            span.style.opacity = 0;
        });
        input.addEventListener('blur', () => {
            playerNode.style.textOverflow = "ellipsis";
            input.style.zIndex = -1;
            input.style.opacity = 0;
            span.style.opacity = 1;
            span.textContent = input.value;

            grid.round[roundID].resultsRound.resultRound[resultRoundID].match[matchID].team[teamID].canGoNextRound = true;
        });
        input.addEventListener('keydown',keyEvent => {
            if (keyEvent.key === 'Enter') {
                input.blur();
            }
        });
    });


    function removePlayers(fromNode,nodeChild) {
        const arrayNode = new Array();

        nodeChild.forEach(node => {
            arrayNode.push(node);
        });
        arrayNode.forEach(node => {
            fromNode.removeChild(node);
        });
    }
}

function changeNick(teamElement) {
    teamElement.childNodes.forEach(playerNode => {
        const span = playerNode.childNodes[0];
        const input = playerNode.childNodes[1];
    });
}