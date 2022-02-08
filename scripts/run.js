const title = document.querySelector('.header__title');
const blackPlace = document.querySelector('.header__titleStart');

setTimeout(() =>{
    title.classList.add('start');
    setTimeout(() => {
        title.classList.add('ready');
        setTimeout(() => {
            blackPlace.remove();
        },1500);
    },1000);
},300);