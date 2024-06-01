window.onload = function () {
    console.log('Window Loaded');
    localStorage.removeItem('playmode')
    localStorage.removeItem('home')
    localStorage.removeItem('player1')
    localStorage.removeItem('player2')
    localStorage.removeItem('win')
    spells = ['TP','OTS']
    player1 = []
    player2 = []
    
    document.getElementById('startBtn').addEventListener('click',function () {
        document.getElementById('startBtn').hidden = true
        document.getElementById('normalMode').hidden = false
        document.getElementById('normalMode').addEventListener('click',function () {
            localStorage.setItem('home',1)
            location.replace('./file.html')
        })
        document.getElementById('hackerMode').hidden = false
        document.getElementById('hackerMode').addEventListener('click',function () {
            localStorage.setItem('home',2)
            location.replace('./file.html')
        })
        document.getElementById('hackerModePro').hidden = false
        document.getElementById('hackerModePro').addEventListener('click',function () {
            localStorage.setItem('home',3)
            document.getElementById('normalMode').hidden = true
            document.getElementById('hackerMode').hidden = true
            document.getElementById('singlePlay').hidden = false
            document.getElementById('doublePlay').hidden = false
            document.getElementById('singlePlay').addEventListener('click',function () {
                localStorage.setItem('playmode',0);
                location.replace('./file.html')
            })
            document.getElementById('doublePlay').addEventListener('click',function () {
                localStorage.setItem('playmode',1);
                document.getElementById('spellDetails').hidden = false
                document.getElementById('start').innerHTML = '<div id="spell1" class="divSpell" >Choose Spell for Player 1 <div class="spellList"></div> </div><div id="spell2" class="divSpell" >Choose Spell for Player 2<div class="spellList"></div></div><button id="submitBtn" class="choiceBtn" type="button">Start Game</button>'
                for (let i = 0; i < spells.length; i++) {
                    document.getElementsByClassName('spellList')[0].innerHTML+='<div class="spel"><p>'+spells[i]+'</p></div>'
                    document.getElementsByClassName('spellList')[1].innerHTML+='<div class="spel"><p>'+spells[i]+'</p></div>'
                }
                spelClasses = document.getElementsByClassName('spel')
                for (let i = 0; i < spelClasses.length; i++) {
                    spelClasses[i].addEventListener('click',function (e) {
                        playerId = e.target.parentNode.parentNode.parentNode.id
                        if (playerId.substring(5)=='1') {
                            y = player1.indexOf(e.target.innerText)
                            if (y>=0) {
                                player1.splice(y,1);
                                e.target.parentNode.style.removeProperty('border')
                            }else{
                                player1.push(e.target.innerText)
                                e.target.parentNode.style.border = '2px solid green'
                            }
                        } else if(playerId.substring(5)=='2'){
                            y = player2.indexOf(e.target.innerText)
                            if (y>=0) {
                                player2.splice(y,1);
                                e.target.parentNode.style.removeProperty('border')
                            }else{
                                player2.push(e.target.innerText)
                                e.target.parentNode.style.border = '2px solid green'
                            }
                        }
                    });
                }
                document.getElementById('submitBtn').addEventListener('click',function () {
                    localStorage.setItem('player1',JSON.stringify(player1))
                    localStorage.setItem('player2',JSON.stringify(player2))
                    localStorage.setItem('playmode',1);
                    location.replace('./file.html')
                })
                
                
            })
            document.getElementById('hackerModePro').hidden = true
        })
    });

    
    

}