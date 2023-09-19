
const menu = document.querySelector('.menu');
const h1Title = document.querySelector('#js-title');
const schedule = document.querySelector('#js-schedule');
const icon = document.querySelector('.fas');
const showPrevious = document.querySelector('.show-previous');
const loader = document.querySelector('#js-loading');

const currentTime = new Date().setFullYear(2021, 1, 10);
let menuIsVisible = false;
let badMethod = false; // Flagga för att toggla metod

let selectedChannel = [];
let upcommingShows = [];
let previousShows = [];
let allShows = [];


(() => {
    h1Title.textContent = 'SVT 1'
    getData('SVT 1')

})();


/* Att manupilera menyn med setInterval med täta intervaller är inte bra för prestationen */

function toggleMenu2() {
    menuIsVisible = !menuIsVisible;
    let positionLeft = 300;

    if (menuIsVisible) {
        let interval1 = setInterval(() => {
            menu.style.left = `-${positionLeft--}px`;
            if (positionLeft === 0) clearInterval(interval1);
        }, 1);
    }

    if (!menuIsVisible) {
        positionLeft = 0;
        let interval2 = setInterval(() => {
            menu.style.left = `-${positionLeft++}px`;
            if (positionLeft >= 300) clearInterval(interval2);
        }, 1);
    }
}


/* 
Denna metod föredrar jag då CSS sköter animationen effektivare samt att det är lättare att kontrollera 
hur animationen ska bete sig. 

*/

function toggleMenu() {

    if (badMethod) return toggleMenu2();

    menuIsVisible = !menuIsVisible;
    menu.style.transition = 'left 0.5s';

    if (menuIsVisible) {
        menu.style.left = '0px';
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        return;
    }

    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    menu.style.left = '-300px';
}

function setChannel(channel) {
    h1Title.textContent = channel;

    getData(channel);
}


async function getData(channel) {
    schedule.style.display = 'none';
    loader.classList.remove('hidden');

    const resp = await fetch(`./data/${channel}.json`);
    const data = await resp.json();
    selectedChannel = data;

    schedule.style.display = 'block';
    loader.classList.add('hidden');

    sortShows();
    render(upcommingShows);
}

function render(shows) {
    const scheduleHtml = shows.map((shows) => {
        return `<li class="list-group-item">
                    <strong>${timeFormater(shows.start)}</strong>
                    <div>${shows.name}</div>
                </li>`;
    }).join('');

    const ulHtml = '<ul class="list-group list-group-flush">';
    const liHtml = '<li class="list-group-item show-previous" onclick="showPreviousShows()">Visa tidigare program</li>';
    schedule.innerHTML = ulHtml;

    document.querySelector('.list-group').innerHTML = liHtml + scheduleHtml;
}

function timeFormater(date) {
    const hours = String(new Date(date).getHours()).padStart(2, '0');
    const minutes = String(new Date(date).getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return time;
}

function sortShows() {
    selectedChannel.sort((current, next) => new Date(current.start).getTime() - new Date(next.start).getTime());

    upcommingShows = selectedChannel.filter(program => new Date(program.start).getTime() > currentTime);
    previousShows = selectedChannel.filter(program => new Date(program.start).getTime() < currentTime);

    allShows = previousShows.concat(upcommingShows);
}

function showPreviousShows() {
    render(allShows);
}
