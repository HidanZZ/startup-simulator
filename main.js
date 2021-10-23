function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    console.log("hey")
    rawFile.onreadystatechange = function () {
        console.log(rawFile.status)
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            console.log('what')
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
var options;
var characters;
var question_index;
var loading=true;
console.log('here')
readTextFile("cardText.json", function (text) {
    options = JSON.parse(text);
    question_index = shuffle([...Array(options[gameOptions.time.current.quarter - 1].length).keys()]);

});
readTextFile("characters.json", function (text) {
    characters = JSON.parse(text);

});

const load=setInterval(()=>{
    console.log(loading)
    if (characters && options){
        loading=false
    }
    if (!loading){
        introductionButton.querySelector(".button-middle-content").innerHTML="I'm Ready !!"
        introductionButton.addEventListener("click", startGame);
        clearInterval(load)
    }
},100)
const findCharacterById = (id) => {
    return characters.find(o => o.id === id);
}
const gameOptions = {
    followers: 100,
    happiness: {
        index: 6,
        images: [
            "img/happiness/happiness0.png",
            "img/happiness/happiness1.png",
            "img/happiness/happiness2.png",
            "img/happiness/happiness3.png",
            "img/happiness/happiness4.png",
            "img/happiness/happiness5.png",
            "img/happiness/happiness6.png",
            "img/happiness/happiness7.png",
            "img/happiness/happiness8.png",
            "img/happiness/happiness9.png",
            "img/happiness/happiness10.png",
        ]
    },

    time: {
        current: {
            quarter: 1,
            index: 1,
            percentage: 100
        },
        max: 12,
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
}

// select all elements
const startButton = document.querySelector(".button-start-game");
const start = document.getElementById("screen-start");
const introductionButton = document.querySelector(".button-im-ready");
const gameover = document.querySelector(".buttons-gameover");
const introduction = document.getElementById("screen-tutorial");

const game = document.getElementById("screen-game");
const question = document.querySelector(".card-description-question");
const characterDescription = document.querySelector(".card-description-character");
const characterImg = document.querySelector(".card-picture-image");

const choiceA = document.querySelector(".button-yes").querySelector(".button-middle-content");
const choiceB = document.querySelector(".button-no").querySelector(".button-middle-content");
const buttonYes = document.querySelector(".button-yes")
const buttonNo = document.querySelector(".button-no")
const followersValue = document.querySelector(".followers-value");
const happinessImg = document.querySelector(".happiness-value");
const month = document.querySelector(".calendar-week");
const monthPercentage = document.querySelector(".calendar-bar-fill");
const buttons = document.querySelector(".buttons");
const card = document.querySelector(".card");

const followersChange = document.querySelector(".followers-change");

// create some variables

let runningQuestion = 0; //track current question





// shuffle a given array
function shuffle(l) {
    for (var j, x, i = l.length; i; j = parseInt(Math.random() * i), x = l[--i], l[i] = l[j], l[j] = x) ;
    return l;
}




// render starting stats
function renderStats(followersgain = 0) {
    animateFollowersGain(followersgain)
    followersValue.innerHTML = gameOptions.followers;
    happinessImg.innerHTML = "<img src=" + gameOptions.happiness.images[gameOptions.happiness.index] + ">"
    console.log("top", parseInt(followersChange.style.top.substr(0, followersChange.style.top.length - 2)))
    month.innerHTML = gameOptions.time.months[gameOptions.time.current.index - 1];
    monthPercentage.style.width = gameOptions.time.current.percentage + '%';

}

function animateFollowersGain(followers) {
    console.log(followers)
    followersChange.style.top =  "-10px";
    followersChange.style.display =  "none";

    let green = "rgb(38, 187, 38)"
    let red = "red"
    var sign=""
    if (followers > 0) {
        followersChange.style.color = green
        sign="+"

    } else if (followers < 0) {
        followersChange.style.color = red
    } else {
        return;
    }
    followersChange.querySelector(".followers-change-value").innerHTML=sign+followers+"M"
    console.log('here')
    followersChange.style.display = "block"

    while (top > -50) {
        console.log(followersChange.style.top)
        console.log(followersChange.style.display)
        followersChange.style.top = (top - 0.5) + "px"
        top -= 0.5

    }
    var animate = setInterval(move, 10);
    var top = parseInt(followersChange.style.top.substr(0, followersChange.style.top.length - 2));

    function move() {
        top -= 0.5;
        followersChange.style.top = top + "px";
        if (top < -50) {
            clearInterval(animate)
        }
    }

}

// render a question
function renderQuestion() {

    // hidden.style.display = "none";
    // current question
    let q = options[gameOptions.time.current.quarter - 1][question_index[runningQuestion]];
    question.innerHTML = "<p>" + q.prompt + "</p>";
    const char = findCharacterById(q.characterId)
    characterDescription.innerHTML = char.lastName + " " + char.firstName + ", " + char.role
    characterImg.style.backgroundImage = "url(" + char.cardImg + ")";
    // qImg.innerHTML = "<img src=" + q.imgSrc + ">";
    choiceA.innerHTML = q.options[0].optionText;
    choiceB.innerHTML = q.options[1].optionText;
    // choiceC.innerHTML = changeTextColor("&" + q.choiceC + "&");
    // testing whether the conditions are satisfied for choice C

}


// connect buttons with functions
startButton.addEventListener("click", startIntroduction);

buttonYes.addEventListener("click", () => {
    renderResult(0)
});
buttonNo.addEventListener("click", () => {
    renderResult(1)
});


//render a result
function renderResult(choice) {
    let q = options[gameOptions.time.current.quarter - 1][question_index[runningQuestion]];
    gameOptions.followers += q.options[choice].followerDelta
    gameOptions.happiness.index += q.options[choice].happinessDelta
    gameOptions.time.current.percentage += q.options[choice].timeDelta
    if (gameOptions.time.current.percentage <= 0) {
        gameOptions.time.current.percentage = 100
        gameOptions.time.current.index++

    }
    gameOptions.time.current.quarter = Math.floor((gameOptions.time.current.index - 1 + 3) / 3);

    renderStats(q.options[choice].followerDelta);
    continueGame()


}


// start introduction
function startIntroduction() {

    start.style.display = "none";
    introduction.style.display = "inline-block";
}


// start game
function startGame() {
    // add default skill to skill list

    introduction.style.display = "none";
    game.style.display = "inline-block";

    renderQuestion();
    renderStats();
}

// next question
function continueGame() {

    // chance of getting resumes

    console.log(gameOptions.time.current)
    // game over logics
    if (gameOptions.time.current.index > gameOptions.time.max) {

        gameOptions.time.current.percentage = 0
        gameOptions.time.current.index = gameOptions.time.max
        renderStats()
        if (gameOptions.followers>=1000){
            gameOver('win');

        }else {
            gameOver('time');

        }
    } else if (gameOptions.happiness.index <= 0) {
        gameOptions.happiness.index = 0

        renderStats()
        gameOver('happiness');
    } else if (gameOptions.followers <= 0) {
        gameOver('followers');
    }   else {
        runningQuestion++;
        if (runningQuestion >= options[gameOptions.time.current.quarter - 1].length) {

            runningQuestion = 0
            question_index = shuffle([...Array(options[gameOptions.time.current.quarter - 1].length).keys()]);


        }
        renderQuestion();
    }

}


function gameOver(temp) {


    if (temp == 'time') {
        question.innerHTML = "<p> Game over</p>";
        characterDescription.innerHTML = "worthless"
        characterImg.style.backgroundImage = "url('img/over.png')";
        buttons.style.display = "none";
        gameover.style.display = "block";
        card.classList.add("defeat")
    } else if (temp == 'happiness') {
        question.innerHTML = "<p> Game over</p>";
        characterDescription.innerHTML = "worthless"
        characterImg.style.backgroundImage = "url('img/over.png')";
        buttons.style.display = "none";
        gameover.style.display = "block";
        card.classList.add("defeat")
    } else if (temp == 'followers') {
        question.innerHTML = "<p> Game over</p>";
        characterDescription.innerHTML = "worthless"
        characterImg.style.backgroundImage = "url('img/over.png')";
        buttons.style.display = "none";
        gameover.style.display = "block";
        card.classList.add("defeat")
    } else if (temp == 'win') {
        question.innerHTML = "<p>You've reached your dream as a famous pop Star</p>";
        characterDescription.innerHTML = " Yay you made it !!"
        characterImg.style.backgroundImage = "url('img/win.gif')";
        characterImg.style.backgroundColor = "rgb(104,104,104)";
        buttons.style.display = "none";
        gameover.style.display = "block";

    }
    gameover.addEventListener("click", () => {
        location.reload()
    })
}



