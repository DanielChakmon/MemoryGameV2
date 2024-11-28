const selections = []
var countOfFoundPairs= 0
const cards=[]
var numOfPairs= 0
var sync = true
var startTime
var refresh

function winState(){
    if(countOfFoundPairs==numOfPairs){
        clearInterval(refresh)
        setTimeout(function(){
            document.getElementById("game").hidden= true
            let congratsBox = document.getElementById("congratsBox")
            congratsBox.hidden= false
            document.getElementById("winnerName").textContent = document.getElementById('username').textContent.replace("username: ","")
            document.getElementById("endTime").textContent = document.getElementById("timer").textContent
            document.getElementById("NumberInput").value = ""
        }, 1200)
    }
}

function changeVisibility(cardIndex){
    let image = document.getElementById("cardContainer").children[cardIndex].querySelector(".image")
    cards[cardIndex].visibility = !cards[cardIndex].visibility
    image.src = `${cards[cardIndex].visibility ? `${(cards[cardIndex].value).slice(0,-1)}.png` : "question_card.png"}`
}


function toggleVisibility(cardIndex){
    if(!selections.includes(cards[cardIndex])&&sync){
       sync = false
        changeVisibility(cardIndex)
        selections.push(cards[cardIndex])
        if (selections.length >=countOfFoundPairs*2+2){
            let firstCard = selections[selections.length-2]
            let secondCard = selections[selections.length-1]
            if(firstCard.value.slice(0,-1)==secondCard.value.slice(0,-1)){
              countOfFoundPairs++ ///
              document.getElementById("countOfFoundPairs").textContent = "pairs found: "+countOfFoundPairs
              winState()
              sync = true
            } else{
              setTimeout(() => { 
                  selections.pop()
                  selections.pop()
                  changeVisibility(cards.indexOf(firstCard))
                  changeVisibility(cards.indexOf(secondCard))
                  sync = true
                }, 1000)
            }
        } else{
            sync = true
        }
    } 
}

function startGame(){

    let cardNumbers = []
    numOfPairs = document.getElementById('NumberInput').value
    if(numOfPairs == ""){
        numOfPairs = document.getElementById("typeNumber").value
        if(numOfPairs<=0||numOfPairs>=31){
            alert("select a number between 0 and 30")
            return
        }
    }else{
        if(numOfPairs<=0||numOfPairs>=31){
            alert("select a number between 0 and 30")
            return
        } else{
        
            var username = document.getElementById("floatingInputGroup1").value
            if(username === ""){
                alert("please enter an username")
                return
            }
        }
    }

    document.getElementById("congratsBox").hidden= true
    document.getElementById("game").hidden= false
    countOfFoundPairs=0
    if(cards.length>0){
        while(cards.length>0){
            cards.pop()
            selections.pop()
        }
        document.getElementById("cardContainer").replaceChildren()
    }
    if(username===undefined){
        username=document.getElementById("winnerName").textContent
    }
    document.getElementById("username").textContent = "username: "+username
    document.getElementById("timer").textContent = "time: 00:00:00"
    document.getElementById("countOfFoundPairs").textContent = "pairs found: "+countOfFoundPairs
    for(let i=1; i<=numOfPairs; i++){
      cardNumbers.push({value:`${i}A`,visibility:false},{value:`${i}B`,visibility:false})
     }
     let currentIndex = cardNumbers.length
     while (currentIndex != 0){
       let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;
       [cardNumbers[currentIndex].value, cardNumbers[randomIndex].value] = [cardNumbers[randomIndex].value, cardNumbers[currentIndex].value]
    } 
    cards.push(...cardNumbers)
    addCards()
    startTimer()

 
    
}

function addCards(){
    let cardsContainer = document.getElementById("cardContainer")
    cards.forEach((card, i)=>{
        let cardElement = document.createElement("div")
        cardElement.className= "Card"
        cardElement.innerHTML = `<img  src="${card.visibility ? `${(card.value).slice(0,-1)}.png` : "question_card.png"}" class= "image" alt="??" />`
        let hitBox = cardElement.querySelector(".image")
        hitBox.addEventListener("click", function(){
            toggleVisibility(i)
        })
        cardsContainer.appendChild(cardElement) 
    })
 

}


function startTimer(){
    startTime = Date.now()
    refresh = setInterval(function(){
        let time = Date.now() - startTime
        let fromatedTime = formater(time)
        document.getElementById("timer").textContent = "time: "+fromatedTime
    },1000)
}

function formater(time){
    let fromatedTime= ""
    let divisor = 3600000
    for (let i=0;i<3;i++){
        time= time/divisor
        let additon = Math.floor(time)
        if (additon<10){
            fromatedTime= fromatedTime+"0"+String(additon)
        } else{
            fromatedTime = fromatedTime+String(additon)
        }
        if (i<2){
            fromatedTime= fromatedTime+":"
        }
        time= (time-additon)*divisor
        divisor= divisor/60
    }
    return fromatedTime
}