window.onload = function () {
    console.log('window loaded');
    document.body.style.background = 'rgb(209, 132, 31)'

    let gameMode = localStorage.getItem('home')
    
    

    if (gameMode == 2 || gameMode == 3||gameMode==4) {
        // document.getElementById('backMusic').innerHTML = '<audio autoplay loop src="audios/music.mpeg"></audio>'
    }
    let sess = 0;
    let botCalled = true
    if (gameMode == null) {
        location.replace('./home.html')
    } else {
        localStorage.removeItem('home')
        sess = sessionStorage.getItem('count')
        if (sess!=null) {
            sess = parseInt(JSON.parse(sess))
            if (gameMode!=4) {
                sessionStorage.setItem('count',sess+1)
                sess+=1
            }
            
        }else{
            sessionStorage.setItem('count',1)
            sess = 1
        }
    }
    if (gameMode!=4) {
        localStorage.removeItem('moves')
        localStorage.removeItem('initial')
        localStorage.removeItem('final')
        localStorage.removeItem('moveName')
        localStorage.removeItem('timeAt')
        localStorage.removeItem('playerName')
        localStorage.removeItem('rotation')
        localStorage.removeItem('bullet')
    }
    let playMode = 0;
    if (gameMode==3) {
        playMode = parseInt(localStorage.getItem('playmode'));
        if (playMode==1) {
            player1 = JSON.parse(localStorage.getItem('player1'))
            player2 = JSON.parse(localStorage.getItem('player2'))
            player1Color = sess%2==1?'red':'blue';
            player2Color = sess%2==1?'blue':'red';
            if (player1.length>0) {
                document.getElementById('wrapper1').hidden = false
                document.getElementById('wrapper1').style.backgroundColor = player1Color;
                document.getElementById('play1').addEventListener('click',function (e) {
                    y = getEventTarget(e)
                    if (!y.classList.contains('tooltipDiv')) {
                        if (y.innerText=='OTS') {
                            document.getElementsByClassName(player1Color+' Titan')[0].style.border = '5px solid green'
                            if (y.classList.contains('sp1')) {
                                document.getElementById('play1').removeChild(y)
                            }else{
                                document.getElementById('play1').removeChild(y.parentNode)
                            }
                            var a = document.getElementsByClassName('tooltipDiv')[0].style.top
                            document.getElementsByClassName('tooltipDiv')[0].style.top = parseInt(parseInt(a.substring(0,a.length-1))+130)+'%'
                        }else if (y.innerText=='TP') {
                            z = document.getElementsByClassName(player2Color)
                            for (let i = 0; i < z.length; i++) {
                                if (!z[i].classList.contains('Titan')&&!z[i].classList.contains('Canon')&&!z[i].classList.contains('SRicochets')) {
                                    document.getElementById(z[i].id).style.border = '5px solid brown'
                                }
                            }
                            if (y.classList.contains('sp1')) {
                                document.getElementById('play1').removeChild(y)
                            }else{
                                document.getElementById('play1').removeChild(y.parentNode)
                            }
                            var a = document.getElementsByClassName('tooltipDiv')[0].style.top
                            document.getElementsByClassName('tooltipDiv')[0].style.top = parseInt(parseInt(a.substring(0,a.length-1))+130)+'%'
                            document.getElementById('p2').innerText = 'Spell'
                        }
                        
                    }
                })
                for (let i = 0; i < player1.length; i++) {
                    document.getElementById('play1').innerHTML+='<div class="sp1"><p>'+player1[i]+'</p></div>'
                }
            }
            if (player2.length>0) {
                document.getElementById('wrapper2').hidden = false
                
                document.getElementById('wrapper2').style.backgroundColor = player2Color;
                document.getElementById('play2').addEventListener('click',function (e) {
                    y = getEventTarget(e)
                    if (!y.classList.contains('tooltipDiv')) {
                        if (y.innerText=='OTS') {
                            document.getElementsByClassName(player2Color+' Titan')[0].style.border = '5px solid green'
                            if (y.classList.contains('sp1')) {
                                document.getElementById('play2').removeChild(y)
                            }else{
                                document.getElementById('play2').removeChild(y.parentNode)
                            }
                            var a = document.getElementsByClassName('tooltipDiv')[1].style.top
                            document.getElementsByClassName('tooltipDiv')[1].style.top = parseInt(parseInt(a.substring(0,a.length-1))+130)+'%'
                        }else if (y.innerText=='TP') {
                            z = document.getElementsByClassName(player1Color)
                            for (let i = 0; i < z.length; i++) {
                                if (!z[i].classList.contains('Titan')&&!z[i].classList.contains('Canon')&&!z[i].classList.contains('SRicochets')) {
                                    document.getElementById(z[i].id).style.border = '5px solid brown'
                                }
                            }
                            if (y.classList.contains('sp1')) {
                                document.getElementById('play2').removeChild(y)
                            }else{
                                document.getElementById('play2').removeChild(y.parentNode)
                            }
                            var a = document.getElementsByClassName('tooltipDiv')[1].style.top
                            document.getElementsByClassName('tooltipDiv')[1].style.top = parseInt(parseInt(a.substring(0,a.length-1))+130)+'%'
                            document.getElementById('p2').innerText = 'Spell'
                        }
                        
                    }
                })
                for (let i = 0; i < player2.length; i++) {
                    document.getElementById('play2').innerHTML+='<div class="sp1"><p>'+player2[i]+'</p></div>'
                }
            }
        }
    }
    localStorage.removeItem('playmode')
    localStorage.removeItem('player1')
    localStorage.removeItem('player2')
    let lefto;
    let righto;
    let moveo;
    let swapo;
    let undoNumber = 0;
    let redoNumber = 0;

    const targetElement = document.getElementById('div');
    document.getElementById('div').style.boxShadow = '0 0 10px 10px grey'
    document.getElementById('heading').style.display = 'grid'
    if (gameMode == 2 || gameMode == 3||gameMode==4) {
        document.getElementById('undoandredo').hidden = false
        document.getElementById('undoandredo').style.display = 'grid'
    } else {
        document.getElementById('undoandredo').hidden = true
        document.getElementById('undoandredo').style.removeProperty('display')
    }
    actual = false
    for (let i = 0; i < 64; i++) {
        const htmlString = '<div class="div2" id="div' + parseInt(i + 1) + '"></div>';
        targetElement.insertAdjacentHTML('beforeend', htmlString);
    }
    function getEventTarget(e) {
        e = e || document.event;
        return e.target || e.srcElement;
    }
    let tempStore;
    document.getElementById('div').addEventListener('click',function (e) {
        y = getEventTarget(e)
        if (y.parentNode.classList.contains('Ricochets')||y.parentNode.classList.contains('SRicochets')||y.parentNode.classList.contains('Titan')||y.parentNode.classList.contains('Tank')||y.parentNode.classList.contains('Canon')) {
            y = y.parentNode
        }
        if (y.classList.contains('div2')) {
            if (document.getElementById('p2').innerText == 'Nothing') {
                
                if ((y.classList.contains('red') && document.getElementById('s1').innerText == 'Red') || (y.classList.contains('blue') && document.getElementById('s1').innerText == 'Blue') || y.classList.contains('green')) {
                    actual = true
                    
                    tempStore = y
                    if (y.classList.contains('Titan') || y.classList.contains('Tank')) {
                        pathOfTitanAndTank(parseInt(y.id.substring(3)));
                    } else if (y.classList.contains('Canon')) {
                        pathOfCanon(parseInt(y.id.substring(3)));
                    } else if (y.classList.contains('Ricochets')) {
                        pathOfRicochets(parseInt(y.id.substring(3)));
                    } else if (y.classList.contains('SRicochets')) {
                        pathOfSRicochets(parseInt(y.id.substring(3)));
                    }
                    y = tempStore
                    if (y.classList.contains('green')) {
                        greenPath(parseInt(y.id.substring(3)));
                    }
                } else {
                    showMessage('Notice: Now '+document.getElementById('s1').innerText+' Player"s Turn')
                    actual = false
                    greenList = document.getElementsByClassName('green');
                    let l = []

                    for (let i = 0; i < greenList.length; i++) {
                        l.push(greenList[i].id)
                    }

                    for (let i = 0; i < l.length; i++) {
                        document.getElementById(l[i]).classList.remove('green')
                        y = document.getElementById(l[i]).classList
                        document.getElementById('div' + y[1].substring(6)).classList.remove('clicked')
                        document.getElementById(l[i]).classList.remove(y[1])
                    }
                    clickedList = document.getElementsByClassName('clicked');
                    let m = []
                    for (let i = 0; i < clickedList.length; i++) {
                        m.push(clickedList[i].id)
                    }
                    for (let i = 0; i < m.length; i++) {
                        document.getElementById(m[i]).classList.remove('clicked')
                        document.getElementById('rot1').removeEventListener('click', lefto)
                        document.getElementById('rot2').removeEventListener('click', righto)
                        document.getElementById('rot3').removeEventListener('click', moveo)
                        document.getElementById('rot1').hidden = true
                        document.getElementById('rot2').hidden = true
                        document.getElementById('rot3').hidden = true
                    }
            
                }
            }else if (document.getElementById('p2').innerText == 'Swapping') {
                if (y.style.border == '5px solid green') {
                    currId = y.id
                    swappedElementId = document.getElementsByClassName('ToBeSwapped')[0].id
                    swapPosition(currId, swappedElementId)
                    document.getElementById(currId).classList.remove('ToBeSwapped')
                    if (document.getElementById(currId).classList.contains('red')) {
                        recordGame('R', 'red', swappedElementId.substring(3), currId.substring(3), 2, minutes + ':' + seconds, null, null)
                    } else {
                        recordGame('R', 'blue', swappedElementId.substring(3), currId.substring(3), 2, minutes + ':' + seconds, null, null)
                    }
                    document.getElementById('p2').innerText == 'Nothing'
                    tanks = document.getElementsByClassName('Tank')
                    canons = document.getElementsByClassName('Canon')
                    sricochets = document.getElementsByClassName('SRicochets')
                    ricochets = document.getElementsByClassName('Ricochets')
                    for (let i = 0; i < tanks.length; i++) {
                        tanks[i].style.removeProperty('border')
                        tanks[i].style.borderLeft = '8px solid yellowgreen'
                    }
                    for (let i = 0; i < canons.length; i++) {
                        canons[i].style.removeProperty('border')
                    }
                    for (let i = 0; i < sricochets.length; i++) {
                        sricochets[i].style.removeProperty('border')
                    }
                    for (let i = 0; i < ricochets.length; i++) {
                        ricochets[i].style.removeProperty('border')
                    }
                    if (redoNumber == 0) {

                        if (gameMode == 2 || gameMode == 3||gameMode==4) {
                            selectDir(currId.substring(3))
                        } else {
                            bulletOfCanon(currId.substring(3), 8);
                        }
                    }
                }else{
                    showMessage('Please select to be swapped block')
                }
            }else if (document.getElementById('p2').innerText == 'Spell') {
                if (document.getElementById(z[i].id).style.border == '5px solid green') {
                    y.innerHTML += '<p class="TPspell">P</p>'
                    if (document.getElementById('s1').innerText=='Red') {
                        colorOf = 'blue'
                    }else{
                        colorOf = 'red'
                    }
                    z = document.getElementsByClassName(colorOf)
                    for (let i = 0; i < document.getElementsByClassName(colorOf).length; i++) {
                        if (!z[i].classList.contains('Titan')) {
                            document.getElementById(z[i].id).style.removeProperty('border')
                        }
                        if (z[i].classList.contains('Tank')) {
                            document.getElementById(z[i].id).style.borderLeft = '8px solid yellowgreen'
                        }
                    }
                    document.getElementById('p2').innerText = 'Nothing'
                } else {
                    showMessage('Please Enchant The Spell')
                }
                
            }else{
                showMessage('Wait for bullet to reach end')
            }
        }else if(y.id=='div'){
            showMessage('Please Select Shown Blocks')
        }
        
    })
    if ((gameMode==3||gameMode==4) && (sess%2==0)) {
        titanDivBlue = [6]
        tankDivBlue = [1, 8]
        RicochetsDivBlue = [9, 16]
        SRicochetsDivBlue = [11, 14]
        CanonDivBlue = [3]

        titanDivRed = [62]
        tankDivRed = [57, 64]
        RicochetsDivRed = [49, 56]
        SRicochetsDivRed = [51, 54]
        CanonDivRed = [59]
        document.getElementById('s1').innerText = 'Red'
        document.getElementById('s1').classList.remove('BlueTurn')
        document.getElementById('s1').classList.add('RedTurn')
    }else{
        titanDivRed = [6]
        tankDivRed = [1, 8]
        RicochetsDivRed = [9, 16]
        SRicochetsDivRed = [11, 14]
        CanonDivRed = [3]

        titanDivBlue = [62]
        tankDivBlue = [57, 64]
        RicochetsDivBlue = [49, 56]
        SRicochetsDivBlue = [51, 54]
        CanonDivBlue = [59]
    }
    


    createTitan('Titan', titanDivRed, 'red')
    createTank('Tank', tankDivRed, 'red')


    createTitan('Titan', titanDivBlue, 'blue')
    createTank('Tank', tankDivBlue, 'blue')

    createRicochets('red', RicochetsDivRed, '', '', '80px solid red', '70px solid transparent')
    createRicochets('blue', RicochetsDivBlue, '', '', '80px solid blue', '70px solid transparent')

    createSRicochets('red', SRicochetsDivRed)
    createSRicochets('blue', SRicochetsDivBlue)

    createCanon(CanonDivRed,'red')
    createCanon(CanonDivBlue,'blue')

    function createTitan(params, division, color) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).innerText = params;
            document.getElementById('div' + division[i]).classList.add(color, params);
        }
    }

    function createTank(params, division, color) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).innerText = params;
            if (gameMode == 2 || gameMode == 3||gameMode==4) {
                document.getElementById('div' + division[i]).style.borderLeft = '8px solid yellowgreen'
            }
            document.getElementById('div' + division[i]).classList.add(color, params);
        }
    }

    function createRicochets(color, division, borderL, borderT, borderB, borderR) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).insertAdjacentHTML('beforeend', '<div style="border-top: ' + borderT + ';border-left: ' + borderL + ';border-right: ' + borderR + ';border-bottom: ' + borderB + ';margin:10px;" id="' + color + 'R' + division[i] + '"></div>')
            document.getElementById('div' + division[i]).classList.add(color, 'Ricochets');
        }
    }

    function createSRicochets(color, division) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).insertAdjacentHTML('beforeend', '<div style="position: relative;top: 42px;right: 12px; width: 110px;border-radius: 5px;height: 10px;background-color: ' + color + ';transform: rotate(45deg);" id="' + color + 'SR' + division[i] + '"></div>')
            document.getElementById('div' + division[i]).classList.add(color, 'SRicochets');
        }
    }

    function createCanon(division,color) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div'+division[i]).innerText = "Canon";
            document.getElementById('div'+division[i]).classList.add(color, 'Canon');
        }
        
    }
    
    if (gameMode == 2 || ((gameMode==3||gameMode==4) && sess%2==1)) {
        document.getElementById('div3').innerHTML += '<div id="redC" hidden><div id="redTop" style="border-top-left-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div><div style = "display: grid;grid-template-columns: auto auto;"><div id="redLeft" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;width: 25px;height: 10px;background-color:black;"></div><div id="redRight" style="border-bottom-right-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 25px;height: 10px;background-color:black;"></div></div><div id="redBottom" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div></div>'
        document.getElementById('div59').innerHTML += '<div id="blueC" hidden><div id="blueTop" style="border-top-left-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div><div style = "display: grid;grid-template-columns: auto auto;"><div id="blueLeft" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;width: 25px;height: 10px;background-color:black;"></div><div id="blueRight" style="border-bottom-right-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 25px;height: 10px;background-color:black;"></div></div><div id="blueBottom" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div></div>'
    }else if (((gameMode==3||gameMode==4) && sess%2==0)) {
        document.getElementById('div59').innerHTML += '<div id="redC" hidden><div id="redTop" style="border-top-left-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div><div style = "display: grid;grid-template-columns: auto auto;"><div id="redLeft" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;width: 25px;height: 10px;background-color:black;"></div><div id="redRight" style="border-bottom-right-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 25px;height: 10px;background-color:black;"></div></div><div id="redBottom" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div></div>'
        document.getElementById('div3').innerHTML += '<div id="blueC" hidden><div id="blueTop" style="border-top-left-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div><div style = "display: grid;grid-template-columns: auto auto;"><div id="blueLeft" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;width: 25px;height: 10px;background-color:black;"></div><div id="blueRight" style="border-bottom-right-radius: 10px;border-top-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 25px;height: 10px;background-color:black;"></div></div><div id="blueBottom" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;position: relative;left: calc(50% - 5px);width: 10px;height: 20px;background-color:black;"></div></div>'
    }

    let [seconds, minutes] = [60, 1]
    function startTimer() {
        seconds--
        if (seconds == 0 && minutes != 0) {
            seconds = 60
            minutes--
        } else if (seconds == 0 && minutes == 0) {
            clearInterval(timer)
            let player = document.getElementById('s1').innerText
            if (player == 'Blue') {
                window.alert('Time"s up!! Red Won')
                gameEnds('red')
            } else {
                window.alert('Time"s up!! Blue Won')
                gameEnds('blue')
            }
        }
        let m = minutes < 10 ? '0' + minutes : minutes
        let s = seconds < 10 ? '0' + seconds : seconds
        if (document.getElementById('timer')) {

            document.getElementById('timer').innerHTML = m + ':' + s
        }
    }

    let timer = null
    function startCounting() {
        if (timer != null) {
            clearInterval(timer)
        }
        timer = setInterval(startTimer, 1000);
    }

    function restartCounting() {
        clearInterval(timer)
        seconds = 60
        minutes = 1
    }

    function remUnnecessary() {
        greenList = document.getElementsByClassName('green');
        let storeGrnList = []

        for (let i = 0; i < greenList.length; i++) {
            storeGrnList.push(greenList[i].id)
        }

        for (let i = 0; i < storeGrnList.length; i++) {
            document.getElementById(storeGrnList[i]).classList.remove('green')
            rem = document.getElementById(storeGrnList[i]).classList
            document.getElementById('div' + rem[1].substring(6)).classList.remove('clicked')
            document.getElementById(storeGrnList[i]).classList.remove(rem[1])
        }
        clickedList = document.getElementsByClassName('clicked');
        let m = []
        for (let i = 0; i < clickedList.length; i++) {
            m.push(clickedList[i].id)
        }
        for (let i = 0; i < m.length; i++) {
            document.getElementById(m[i]).classList.remove('clicked')
            document.getElementById('rot1').removeEventListener('click', lefto)
            document.getElementById('rot2').removeEventListener('click', righto)
            document.getElementById('rot3').removeEventListener('click', moveo)
            document.getElementById('rot1').hidden = true
            document.getElementById('rot2').hidden = true
            document.getElementById('rot3').hidden = true
        }
    }

    function stopCounting() {
        clearInterval(timer)
    }

    function pathOfTitanAndTank(params) {
        arr = [1, -1, 8, -8, 9, -9, 7, -7]
        greenPathFormation(parseInt(params), arr)
    }

    function greenPathFormation(params, arr) {
        p = document.getElementById('div' + params).classList
        if (!p.contains('clicked')) {
            remUnnecessary()
            document.getElementById('div' + params).classList.add('clicked');
            for (let index = 0; index < 8; index++) {
                y = params + arr[index]
                z = document.getElementById('div' + y);
                if (!((params - 1) % 8 == 0 && (arr[index] == -1 || arr[index] == -9 || arr[index] == 7)) && !(params % 8 == 0 && (arr[index] == 9 || arr[index] == -7 || arr[index] == 1)) && y > 0 && y < 65 && !(z.classList.contains('red') || z.classList.contains('blue'))) {
                    document.getElementById('div' + y).classList.add('green', 'parent' + params);
                }
            }
        } else {
            remUnnecessary()
            document.getElementById('div' + params).classList.remove('clicked');
            for (let index = 0; index < 8; index++) {

                y = params + arr[index]
                z = document.getElementById('div' + y);
                if (!((params - 1) % 8 == 0 && (arr[index] == -1 || arr[index] == -9 || arr[index] == 7)) && !(params % 8 == 0 && (arr[index] == 9 || arr[index] == -7 || arr[index] == 1)) && y > 0 && y <= 64 && !(z.classList.contains('red') || z.classList.contains('blue'))) {
                    document.getElementById('div' + y).classList.remove('green', 'parent' + params);
                }
            }
        }
    }

    function greenPath(params) {
        x = document.getElementById('div' + params).classList
        for (let i = 0; i < x.length; i++) {
            if (x[i].substring(6) != '') {

                y = x[i].substring(6)
                classname = document.getElementById('div' + y)
                parentname = document.getElementById('div' + params)

                if (classname.classList.contains('Titan')) {
                    col = classname.classList.contains('red') ? 'red' : 'blue'
                    recordGame('Ti', col, y, params, 0, minutes + ':' + seconds, null, null)
                    classname.classList.remove('Titan')
                    parentname.classList.add('Titan')
                } else if (classname.classList.contains('Tank')) {
                    col = classname.classList.contains('red') ? 'red' : 'blue'
                    recordGame('Ta', col, y, params, 0, minutes + ':' + seconds, null, null)
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        parentname.style.borderLeft = '8px solid yellowgreen'
                        classname.style.removeProperty('border-left')
                    }
                    classname.classList.remove('Tank')
                    parentname.classList.add('Tank')

                } else if (classname.classList.contains('Canon')){
                    col = classname.classList.contains('red') ? 'red' : 'blue'
                    recordGame('C', col, y, params, 0, minutes + ':' + seconds, null, null)
                    classname.classList.remove('Canon')
                    parentname.classList.add('Canon')
                }else if (classname.classList.contains('SRicochets') && classname.classList.contains('red')) {
                    document.getElementById('redSR' + y).id = 'redSR' + params
                    recordGame('SR', 'red', y, params, 0, minutes + ':' + seconds, null, null)
                } else if (classname.classList.contains('SRicochets') && classname.classList.contains('blue')) {
                    document.getElementById('blueSR' + y).id = 'blueSR' + params
                    recordGame('SR', 'blue', y, params, 0, minutes + ':' + seconds, null, null)
                } else if (classname.classList.contains('Ricochets') && classname.classList.contains('red')) {
                    document.getElementById('redR' + y).id = 'redR' + params
                    recordGame('R', 'red', y, params, 0, minutes + ':' + seconds, null, null)
                } else if (classname.classList.contains('Ricochets') && classname.classList.contains('blue')) {
                    document.getElementById('blueR' + y).id = 'blueR' + params
                    recordGame('R', 'blue', y, params, 0, minutes + ':' + seconds, null, null)
                }
                
                if (classname.classList.contains('Ricochets')) {
                    classname.classList.remove('Ricochets')
                    parentname.classList.add('Ricochets')
                } else if (classname.classList.contains('SRicochets')) {
                    classname.classList.remove('SRicochets')
                    parentname.classList.add('SRicochets')
                }
                    
                parentname.innerHTML = classname.innerHTML
                classname.innerHTML = ''
                classname.classList.remove('clicked')
                classname.style.removeProperty('background-color')

                if (classname.classList.contains('red')) {
                    classname.classList.remove('red')
                    parentname.classList.add('red')
                } else {
                    classname.classList.remove('blue')
                    parentname.classList.add('blue')
                }
                parentname.classList.remove('green', 'parent' + y)

                z = document.getElementsByClassName('green')
                l = []
                for (let m = 0; m < z.length; m++) {
                    l.push(z[m].id)
                }
                for (let k = 0; k < l.length; k++) {
                    document.getElementById(l[k]).classList.remove('green', 'parent' + y)
                }

                if (redoNumber == 0) {
                    document.getElementById('p2').innerText = 'Running'
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(params)
                    } else {
                        bulletOfCanon(params, 8);
                    }
                }

                break;
            }
        }
    }
    let topCanon;
    let leftCanon;
    let rightCanon;
    let bottomCanon;
    function selectDir(params) {
        clas = document.getElementById('div' + params).classList
        if (clas.contains('red')) {
            x = document.getElementsByClassName('Canon red')
            color = 'red'
        } else {
            x = document.getElementsByClassName('Canon blue')
            color = 'blue'
        }

        document.getElementById(color + "C").hidden = false
        document.getElementById(color + "Top").addEventListener('click', topCanon = function () {
            bulletOfCanon(params, -8)
        })
        document.getElementById(color + "Left").addEventListener('click', leftCanon = function () {
            bulletOfCanon(params, -1)
        })
        document.getElementById(color + "Right").addEventListener('click', rightCanon = function () {
            bulletOfCanon(params, 1)
        })
        document.getElementById(color + "Bottom").addEventListener('click', bottomCanon = function () {
            bulletOfCanon(params, 8)
        })
    }

    function bulletOfCanon(params, chid) {
        tp = 0
        clas = document.getElementById('div' + params).classList
        ids = 0
        if (clas.contains('red')) {
            x = document.getElementsByClassName('Canon red')
        } else {
            x = document.getElementsByClassName('Canon blue')
        }

        if (clas.contains('red')) {
            changeId = chid
            htmlStr = '<div id="bulletred"></div>';
            if (gameMode==3 && sess%2==0) {
                decider = -1
            }else{
                decider = 1
            }
            
            bulletName = 'bulletred'
            colorToCompare = 'red'
            oppositeColor = 'blue'
        } else if (clas.contains('blue')) {
            changeId = chid
            htmlStr = '<div id="bulletblue"></div>';
            if (gameMode==3 && sess%2==0) {
                decider = 1
            }else{
                decider = -1
            }
            bulletName = 'bulletblue'
            colorToCompare = 'blue'
            oppositeColor = 'red'
        }
        if (gameMode == 2 || gameMode == 3||gameMode==4) {
            if (gameMode==3 && sess%2 == 0 && clas.contains('red')) {
                changeId *= (-1)
            }else if (gameMode==3 && sess%2 == 0 && clas.contains('blue')) {
            }else if(clas.contains('blue')){
                changeId *= (-1)
            }
            document.getElementById(colorToCompare + "Top").removeEventListener('click', topCanon);
            document.getElementById(colorToCompare + "Left").removeEventListener('click', leftCanon);
            document.getElementById(colorToCompare + "Right").removeEventListener('click', rightCanon);
            document.getElementById(colorToCompare + "Bottom").removeEventListener('click', bottomCanon);
            document.getElementById(colorToCompare + "C").hidden = true
        }
        const intervalId = setInterval(() => {
            ids = ids + (decider * changeId)
            isExistant = false
            if (((parseInt(x[0].id.substring(3)) + ids) < 65) && ((parseInt(x[0].id.substring(3)) + ids) > 0)) {
                h = document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids))
                isExistant = true
                document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids)).insertAdjacentHTML('beforeend', htmlStr);
                if (gameMode == 2 || gameMode == 3||gameMode==4) {
                    if (decider == 1) {
                        if (changeId == 8) {
                            document.getElementById(bulletName).style.height = '20px'
                            document.getElementById(bulletName).style.width = '10px'
                            document.getElementById(bulletName).style.borderBottomLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomRightRadius = '10px'
                        } else if (changeId == -8) {
                            document.getElementById(bulletName).style.height = '20px'
                            document.getElementById(bulletName).style.width = '10px'
                            document.getElementById(bulletName).style.borderTopLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderTopRightRadius = '10px'
                        } else if (changeId == -1) {
                            document.getElementById(bulletName).style.height = '10px'
                            document.getElementById(bulletName).style.width = '20px'
                            document.getElementById(bulletName).style.borderTopLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomLeftRadius = '10px'
                        } else if (changeId == 1) {
                            document.getElementById(bulletName).style.height = '10px'
                            document.getElementById(bulletName).style.width = '20px'
                            document.getElementById(bulletName).style.borderTopRightRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomRightRadius = '10px'
                        }
                    } else if (decider == -1) {
                        if (changeId == 8) {
                            document.getElementById(bulletName).style.height = '20px'
                            document.getElementById(bulletName).style.width = '10px'
                            document.getElementById(bulletName).style.borderTopLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderTopRightRadius = '10px'
                        } else if (changeId == -8) {
                            document.getElementById(bulletName).style.height = '20px'
                            document.getElementById(bulletName).style.width = '10px'
                            document.getElementById(bulletName).style.borderBottomLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomRightRadius = '10px'
                        } else if (changeId == 1) {
                            document.getElementById(bulletName).style.height = '10px'
                            document.getElementById(bulletName).style.width = '20px'
                            document.getElementById(bulletName).style.borderTopLeftRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomLeftRadius = '10px'
                        } else if (changeId == -1) {
                            document.getElementById(bulletName).style.height = '10px'
                            document.getElementById(bulletName).style.width = '20px'
                            document.getElementById(bulletName).style.borderTopRightRadius = '10px'
                            document.getElementById(bulletName).style.borderBottomRightRadius = '10px'
                        }
                    }
                }

                setTimeout(() => {
                    if (document.getElementById(bulletName)) {
                        document.getElementById(bulletName).remove()
                    }
                }, 200);
            }
            if (((parseInt(x[0].id.substring(3)) + ids) > 64) || ((parseInt(x[0].id.substring(3)) + ids) < 0)) {
                isExistant = false
                document.getElementById('p2').innerText = 'Nothing'
                clearInterval(intervalId)
                restartCounting()
                startCounting()
                if (gameMode==3&&playMode==0&&botCalled) {
                    bot()
                }else if (gameMode==3&&playMode==0&&!botCalled) {
                    botCalled=true
                }
            }

            if ((((parseInt(x[0].id.substring(3)) + ids) % 8 == 0 && changeId == (1 * decider)) || ((parseInt(x[0].id.substring(3)) + ids - 1) % 8 == 0 && changeId == (-1 * decider))) && !(h.classList.contains('Ricochets') && h.classList.contains(colorToCompare)) && !(h.classList.contains('SRicochets') && h.classList.contains(colorToCompare))) {
                
                isExistant=false
                document.getElementById('p2').innerText = 'Nothing'
                clearInterval(intervalId)
                restartCounting()
                startCounting()
                if (gameMode==3&&playMode==0&&botCalled) {
                    bot()
                }else if (gameMode==3&&playMode==0&&!botCalled) {
                    botCalled=true
                }
            }
            if (isExistant && h.classList.contains('Ricochets')) {
                document.getElementById(bulletName).style.top = '-50px'
                document.getElementById(bulletName).style.position = 'relative'
            }
            if (isExistant && (h.classList.contains(oppositeColor) && h.classList.contains('Tank'))) {
                if (gameMode == 2 ||(gameMode==3 && playMode==0)|| gameMode==4) {
                    b1 = h.style.borderLeft
                    b2 = h.style.borderRight
                    b3 = h.style.borderTop
                    b4 = h.style.borderBottom
                    if (!((b1 != '' && changeId == (1 * decider)) || (b2 != '' && changeId == (-1 * decider)) || (b3 != '' && changeId == (8 * decider)) || (b4 != '' && changeId == (-8 * decider)))) {
                        isExistant = false
                        document.getElementById('p2').innerText = 'Nothing'
                        clearInterval(intervalId)
                        restartCounting()
                        startCounting()
                        if (gameMode==3&&playMode==0&&botCalled) {
                            bot()
                        }else if (gameMode==3&&playMode==0&&!botCalled) {
                            botCalled=true
                        }
                    }
                }else if (gameMode==3 && playMode==1) {
                    if (h.querySelector("p")) {
                        document.getElementById(bulletName).style.top = '-50px'
                        document.getElementById(bulletName).style.position = 'relative'
                    } else {
                        b1 = h.style.borderLeft
                        b2 = h.style.borderRight
                        b3 = h.style.borderTop
                        b4 = h.style.borderBottom
                        if (!((b1 != '' && changeId == (1 * decider)) || (b2 != '' && changeId == (-1 * decider)) || (b3 != '' && changeId == (8 * decider)) || (b4 != '' && changeId == (-8 * decider)))) {
                            isExistant = false
                            document.getElementById('p2').innerText = 'Nothing'
                            clearInterval(intervalId)
                            restartCounting()
                            startCounting()
                            if (gameMode==3&&playMode==0&&botCalled) {
                                bot()
                            }else if (gameMode==3&&playMode==0&&!botCalled) {
                                botCalled=true
                            }
                        }
                    }
                }else {
                    isExistant = false
                    document.getElementById('p2').innerText = 'Nothing'
                    clearInterval(intervalId)
                    restartCounting()
                    startCounting()
                    if (gameMode==3&&playMode==0&&botCalled) {
                        bot()
                    }else if (gameMode==3&&playMode==0&&!botCalled) {
                        botCalled=true
                    }
                }
            }
            if (isExistant && h.classList.contains(oppositeColor) && h.classList.contains('Titan')) {
                if (gameMode==3 && playMode==1 && h.style.border=='5px solid green') {
                    h.style.removeProperty('border')
                }else{
                    isExistant = false
                    window.alert(oppositeColor.toUpperCase() + ' Done')
                    document.getElementById('p2').innerText = 'Nothing'
                    clearInterval(intervalId)
                    stopCounting()
                    gameEnds(colorToCompare)
                }
                
            }
            if (isExistant && h.classList.contains('Ricochets') && h.classList.contains(colorToCompare)) {
                p = document.getElementById(colorToCompare + 'R' + h.id.substring(3))
                leftdir = p.style.borderLeft
                rightdir = p.style.borderRight
                bottomdir = p.style.borderBottom
                topdir = p.style.borderTop
                
                if (topdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-1 * decider)) {
                    changeId = (8 * decider)
                } else if (topdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-8 * decider)) {
                    changeId = (1 * decider)
                } else if (topdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (1 * decider)) {
                    changeId = (8 * decider)
                } else if (topdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (-8 * decider)) {
                    changeId = (-1 * decider)
                }


                else if (bottomdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-1 * decider)) {
                    changeId = (-8 * decider)
                } else if (bottomdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (8 * decider)) {
                    changeId = (1 * decider)
                } else if (bottomdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (1 * decider)) {
                    changeId = (-8 * decider)
                } else if (bottomdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (8 * decider)) {
                    changeId = (-1 * decider)
                }

                else if (leftdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-1 * decider)) {
                    changeId = (8 * decider)
                } else if (leftdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-8 * decider)) {
                    changeId = (1 * decider)
                } else if (leftdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (-1 * decider)) {
                    changeId = (-8 * decider)
                } else if (leftdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (8 * decider)) {
                    changeId = (1 * decider)
                }

                else if (rightdir == ('80px solid red' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-8 * decider)) {
                    changeId = (-1 * decider)
                } else if (rightdir == ('80px solid red' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (1 * decider)) {
                    changeId = (8 * decider)
                } else if (rightdir == ('80px solid red' + colorToCompare) && topdir == '70px solid transparent' && changeId == (1 * decider)) {
                    changeId = (-8 * decider)
                } else if (rightdir == ('80px solid red' + colorToCompare) && topdir == '70px solid transparent' && changeId == (8 * decider)) {
                    changeId = (-1 * decider)
                }


                else {
                    isExistant = false
                    document.getElementById('p2').innerText = 'Nothing'
                    clearInterval(intervalId)
                    restartCounting()
                    startCounting()
                    if (gameMode==3&&playMode==0&&botCalled) {
                        bot()
                    }else if (gameMode==3&&playMode==0&&!botCalled) {
                        botCalled=true
                    }
                }
            }
            if (isExistant && (gameMode == 2 || gameMode == 3||gameMode==4) && h.classList.contains('Ricochets') && h.classList.contains(oppositeColor)) {
                if (h.querySelector('p')) {
                    
                }else {

                
                    p = document.getElementById(oppositeColor + 'R' + h.id.substring(3))
                    leftdir = p.style.borderLeft
                    rightdir = p.style.borderRight
                    bottomdir = p.style.borderBottom
                    topdir = p.style.borderTop
                    
                    if (((bottomdir == ('80px solid ' + oppositeColor) && rightdir == '70px solid transparent')||(leftdir == ('80px solid ' + oppositeColor) && topdir == '70px solid transparent')) && (changeId == (-1*decider)||changeId==(8*decider))) {
                    }else if (((bottomdir == ('80px solid ' + oppositeColor) && leftdir == '70px solid transparent')||(rightdir == ('80px solid ' + oppositeColor) && topdir == '70px solid transparent')) && (changeId == (1*decider)||changeId==(8*decider))) {
                    }else if (((topdir == ('80px solid ' + oppositeColor) && rightdir == '70px solid transparent')||(leftdir == ('80px solid ' + oppositeColor) && bottomdir == '70px solid transparent')) && (changeId == (-1*decider)||changeId==(-8*decider))) {
                    }else if (((topdir == ('80px solid ' + oppositeColor) && leftdir == '70px solid transparent')||(rightdir == ('80px solid ' + oppositeColor) && bottomdir == '70px solid transparent')) && (changeId == (1*decider)||changeId==(-8*decider))) {
                    }else{
                        document.getElementById('p2').innerText = 'Nothing'
                        clearInterval(intervalId)
                        restartCounting()
                        startCounting()
                        document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids)).classList.remove('Ricochets')
                        document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids)).classList.remove(oppositeColor)
                        document.getElementById(oppositeColor + 'R' + h.id.substring(3)).remove()
                        document.getElementById(bulletName).style.removeProperty('top')
                        document.getElementById(bulletName).style.removeProperty('position')
                        recordGame('B', colorToCompare, h.id.substring(3), h.id.substring(3), -1, minutes + ":" + seconds, null, [-1, 'R', leftdir, rightdir, bottomdir, topdir])
                        if (gameMode==3&&playMode==0&&botCalled) {
                            bot()
                        }else if (gameMode==3&&playMode==0&&!botCalled) {
                            botCalled=true
                        }
                    }
                }
            }

            if (isExistant && h.classList.contains('SRicochets') && h.classList.contains(colorToCompare)) {
                p = document.getElementById(colorToCompare + 'SR' + h.id.substring(3))
                s1 = p.style.transform
                if (s1 == 'rotate(-45deg)' && changeId == 1) {
                    changeId = -8
                } else if (s1 == 'rotate(-45deg)' && changeId == 8) {
                    changeId = -1
                } else if (s1 == 'rotate(-45deg)' && changeId == -8) {
                    changeId = 1
                } else if (s1 == 'rotate(-45deg)' && changeId == -1) {
                    changeId = 8
                } else if (s1 == 'rotate(45deg)' && changeId == 1) {
                    changeId = 8
                } else if (s1 == 'rotate(45deg)' && changeId == -8) {
                    changeId = -1
                } else if (s1 == 'rotate(45deg)' && changeId == -1) {
                    changeId = -8
                } else if (s1 == 'rotate(45deg)' && changeId == 8) {
                    changeId = 1
                }
            }
        }, 250);



        if (clas.contains('red')) {


            document.getElementById('s1').classList.remove('RedTurn')
            document.getElementById('s1').classList.add('BlueTurn')
            document.getElementById('s1').innerHTML = 'Blue'

        } else if (clas.contains('blue')) {


            document.getElementById('s1').classList.remove('BlueTurn')
            document.getElementById('s1').classList.add('RedTurn')
            document.getElementById('s1').innerHTML = 'Red'
        }
    }

    function pathOfCanon(params) {
        params = parseInt(params)
        x = document.getElementById('div' + params).classList
        arr = [-1, 1]
        if (x.contains('clicked')) {
            remUnnecessary()
            document.getElementById('div' + params).classList.remove('clicked')
            for (let i = 0; i < arr.length; i++) {
                z = document.getElementById('div' + parseInt(params + arr[i]))
                y = params + arr[i]
                if (((y > 0 && y < 9) || (y > 56 && y < 65)) && !document.getElementById('div' + y).classList.contains('red') && !document.getElementById('div' + y).classList.contains('blue')) {
                    document.getElementById('div' + y).classList.remove('green', 'parent' + params)
                }
            }
        } else {
            remUnnecessary()
            for (let i = 0; i < arr.length; i++) {
                z = document.getElementById('div' + parseInt(params + arr[i]))
                y = params + arr[i]
                if (((y > 0 && y < 9) || (y > 56 && y < 65)) && !document.getElementById('div' + y).classList.contains('red') && !document.getElementById('div' + y).classList.contains('blue')) {
                    document.getElementById('div' + params).classList.add('clicked')
                    document.getElementById('div' + y).classList.add('green', 'parent' + params)
                }

            }
        }

    }

    function rotationOfRicochets(ids, dir) {
        document.getElementById('rot1').removeEventListener('click', lefto)
        document.getElementById('rot2').removeEventListener('click', righto)
        document.getElementById('rot3').removeEventListener('click', moveo)
        document.getElementById('rot4').removeEventListener('click', swapo)
        document.getElementById('rot1').hidden = true
        document.getElementById('rot2').hidden = true
        document.getElementById('rot3').hidden = true
        document.getElementById('rot4').hidden = true
        document.getElementById('div' + ids).classList.remove('clicked')
        y = document.getElementById('div' + ids).classList
        if (y.contains('blue', 'Ricochets')) {
            x = document.getElementById('blueR' + ids).style
            if (dir == 'right') {

                recordGame('R', 'blue', ids, ids, 1, minutes + ':' + seconds, 'r', null)
                leftdir = x.borderLeft
                topdir = x.borderTop
                bottomdir = x.borderBottom
                rightdir = x.borderRight

                if (bottomdir == '80px solid blue' && rightdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-right')
                    document.getElementById('blueR' + ids).style.borderLeft = '70px solid transparent'
                } else if (bottomdir == '80px solid blue' && leftdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-bottom')
                    document.getElementById('blueR' + ids).style.borderTop = '80px solid blue'
                } else if (topdir == '80px solid blue' && leftdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-left')
                    document.getElementById('blueR' + ids).style.borderRight = '70px solid transparent'
                } else if (topdir == '80px solid blue' && rightdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-top')
                    document.getElementById('blueR' + ids).style.borderBottom = '80px solid blue'
                }
                if (redoNumber == 0) {

                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }
            } else if (dir == 'left') {
                recordGame('R', 'blue', ids, ids, 1, minutes + ':' + seconds, 'l', null)
                leftdir = x.borderLeft
                topdir = x.borderTop
                bottomdir = x.borderBottom
                rightdir = x.borderRight

                if (bottomdir == '80px solid blue' && rightdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-bottom')
                    document.getElementById('blueR' + ids).style.borderTop = '80px solid blue'
                } else if (topdir == '80px solid blue' && rightdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-right')
                    document.getElementById('blueR' + ids).style.borderLeft = '70px solid transparent'
                } else if (topdir == '80px solid blue' && leftdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-top')
                    document.getElementById('blueR' + ids).style.borderBottom = '80px solid blue'
                } else if (bottomdir == '80px solid blue' && leftdir == '70px solid transparent') {
                    document.getElementById('blueR' + ids).style.removeProperty('border-left')
                    document.getElementById('blueR' + ids).style.borderRight = '70px solid transparent'
                }
                if (redoNumber == 0) {

                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }

            } else if (dir == 'move') {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
            } else {
                document.getElementById('p2').innerText = 'Swapping'
                tanks = document.getElementsByClassName('Tank')
                canons = document.getElementsByClassName('Canon')
                sricochets = document.getElementsByClassName('SRicochets')
                ricochets = document.getElementsByClassName('Ricochets')
                for (let i = 0; i < tanks.length; i++) {
                    tanks[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < canons.length; i++) {
                    canons[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < sricochets.length; i++) {
                    sricochets[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < ricochets.length; i++) {
                    if (parseInt(ricochets[i].id.substring(3)) != parseInt(ids)) {
                        ricochets[i].style.border = 'solid 5px green'
                    }
                }
                document.getElementById('div' + ids).classList.add('ToBeSwapped')
            }

        } else if (y.contains('red', 'Ricochets')) {

            x = document.getElementById('redR' + ids).style
            if (dir == 'right') {
                recordGame('R', 'red', ids, ids, 1, minutes + ':' + seconds, 'r', null)
                leftdir = x.borderLeft
                topdir = x.borderTop
                bottomdir = x.borderBottom
                rightdir = x.borderRight

                if (bottomdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-right')
                    document.getElementById('redR' + ids).style.borderLeft = '70px solid transparent'
                } else if (bottomdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-bottom')
                    document.getElementById('redR' + ids).style.borderTop = '80px solid red'
                } else if (topdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-left')
                    document.getElementById('redR' + ids).style.borderRight = '70px solid transparent'
                } else if (topdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-top')
                    document.getElementById('redR' + ids).style.borderBottom = '80px solid red'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }
            } else if (dir == 'left') {
                recordGame('R', 'red', ids, ids, 1, minutes + ':' + seconds, 'l', null)
                leftdir = x.borderLeft
                topdir = x.borderTop
                bottomdir = x.borderBottom
                rightdir = x.borderRight

                if (bottomdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-bottom')
                    document.getElementById('redR' + ids).style.borderTop = '80px solid red'
                } else if (topdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-right')
                    document.getElementById('redR' + ids).style.borderLeft = '70px solid transparent'
                } else if (topdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-top')
                    document.getElementById('redR' + ids).style.borderBottom = '80px solid red'
                } else if (bottomdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-left')
                    document.getElementById('redR' + ids).style.borderRight = '70px solid transparent'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }
            } else if (dir == 'move') {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
            } else {
                document.getElementById('p2').innerText = 'Swapping'
                tanks = document.getElementsByClassName('Tank')
                canons = document.getElementsByClassName('Canon')
                sricochets = document.getElementsByClassName('SRicochets')
                ricochets = document.getElementsByClassName('Ricochets')
                for (let i = 0; i < tanks.length; i++) {
                    tanks[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < canons.length; i++) {
                    canons[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < sricochets.length; i++) {
                    sricochets[i].style.border = 'solid 5px green'
                }
                for (let i = 0; i < ricochets.length; i++) {
                    if (parseInt(ricochets[i].id.substring(3)) != parseInt(ids)) {
                        ricochets[i].style.border = 'solid 5px green'
                    }
                }
                document.getElementById('div' + ids).classList.add('ToBeSwapped')
            }

        }

    }

    function pathOfRicochets(params) {


        if (document.getElementById('div' + params).classList.contains('clicked')) {
            remUnnecessary()
            document.getElementById('div' + params).classList.remove('clicked')
            document.getElementById('rot1').hidden = true
            document.getElementById('rot2').hidden = true
            document.getElementById('rot3').hidden = true
            document.getElementById('rot4').hidden = true
        } else {
            remUnnecessary()
            document.getElementById('div' + params).classList.add('clicked')
            document.getElementById('rot1').hidden = false
            document.getElementById('rot2').hidden = false
            document.getElementById('rot3').hidden = false
            document.getElementById('rot4').hidden = false
            window.scrollBy(0, window.innerHeight)
            document.getElementById('rot1').addEventListener('click', lefto = function () {
                rotationOfRicochets(params, 'left')
            })
            document.getElementById('rot2').addEventListener('click', righto = function () {
                rotationOfRicochets(params, 'right')
            })
            document.getElementById('rot3').addEventListener('click', moveo = function () {
                rotationOfRicochets(params, 'move')
            })
            document.getElementById('rot4').addEventListener('click', swapo = function () {
                rotationOfRicochets(params, 'swap')
            })

        }

    }

    function rotationOfSRicochets(ids, dir) {

        document.getElementById('rot1').removeEventListener('click', lefto)
        document.getElementById('rot2').removeEventListener('click', righto)
        document.getElementById('rot3').removeEventListener('click', moveo)
        document.getElementById('rot1').hidden = true
        document.getElementById('rot2').hidden = true
        document.getElementById('rot3').hidden = true

        document.getElementById('div' + ids).classList.remove('clicked')
        y = document.getElementById('div' + ids).classList
        if (y.contains('blue', 'SRicochets')) {
            x = document.getElementById('blueSR' + ids).style
            if (dir == 'right') {
                recordGame('SR', 'blue', ids, ids, 1, minutes + ':' + seconds, 'r', null)
                s1 = x.transform
                if (s1 == 'rotate(-45deg)') {
                    document.getElementById('blueSR' + ids).style.transform = 'rotate(45deg)'
                } else {
                    document.getElementById('blueSR' + ids).style.transform = 'rotate(-45deg)'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }

            } else if (dir == 'left') {
                recordGame('SR', 'blue', ids, ids, 1, minutes + ':' + seconds, 'l', null)
                s1 = x.transform
                if (s1 == 'rotate(-45deg)') {
                    document.getElementById('blueSR' + ids).style.transform = 'rotate(45deg)'
                } else {
                    document.getElementById('blueSR' + ids).style.transform = 'rotate(-45deg)'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }

            } else {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
            }

        } else if (y.contains('red', 'SRicochets')) {
            x = document.getElementById('redSR' + ids).style
            if (dir == 'right') {
                recordGame('SR', 'red', ids, ids, 1, minutes + ':' + seconds, 'r', null)
                s1 = x.transform
                if (s1 == 'rotate(-45deg)') {
                    document.getElementById('redSR' + ids).style.transform = 'rotate(45deg)'
                } else {
                    document.getElementById('redSR' + ids).style.transform = 'rotate(-45deg)'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }

            } else if (dir == 'left') {
                recordGame('SR', 'red', ids, ids, 1, minutes + ':' + seconds, 'l', null)
                s1 = x.transform
                if (s1 == 'rotate(-45deg)') {
                    document.getElementById('redSR' + ids).style.transform = 'rotate(45deg)'
                } else {
                    document.getElementById('redSR' + ids).style.transform = 'rotate(-45deg)'
                }
                if (redoNumber == 0) {
                    if (gameMode == 2 || gameMode == 3||gameMode==4) {
                        selectDir(ids)
                    } else {
                        bulletOfCanon(ids, 8);
                    }
                }

            } else {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
            }

        }

    }

    function pathOfSRicochets(params) {

        if (document.getElementById('div' + params).classList.contains('clicked')) {
            remUnnecessary()
            document.getElementById('div' + params).classList.remove('clicked')
            document.getElementById('rot1').hidden = true
            document.getElementById('rot2').hidden = true
            document.getElementById('rot3').hidden = true
        } else {
            remUnnecessary()
            document.getElementById('div' + params).classList.add('clicked')
            document.getElementById('rot1').hidden = false
            document.getElementById('rot2').hidden = false
            document.getElementById('rot3').hidden = false
            window.scrollBy(0, window.innerHeight)
            if (document.getElementById('div' + params).classList.contains('red')) {
                document.getElementById('rot1').addEventListener('click', lefto = function () {
                    rotationOfSRicochets(params, 'left')
                })
                document.getElementById('rot2').addEventListener('click', righto = function () {
                    rotationOfSRicochets(params, 'right')
                })
                document.getElementById('rot3').addEventListener('click', moveo = function () {
                    rotationOfSRicochets(params, 'move')
                })

            } else {
                document.getElementById('rot1').addEventListener('click', lefto = function () {
                    rotationOfSRicochets(params, 'left')
                })
                document.getElementById('rot2').addEventListener('click', righto = function () {
                    rotationOfSRicochets(params, 'right')
                })
                document.getElementById('rot3').addEventListener('click', moveo = function () {
                    rotationOfSRicochets(params, 'move')
                })

            }

        }
    }

    function swapPosition(iniPos, finiPos) {

        storeCurrDivHtml = []
        storeCurrDivClass = []
        storeCurrDivHtml.push(document.getElementById(iniPos).innerHTML)
        for (let i = 0; i < document.getElementById(iniPos).classList.length; i++) {
            storeCurrDivClass.push(document.getElementById(iniPos).classList[i])
        }


        storeSwapDivHtml = []
        storeSwapDivClass = []
        storeSwapDivHtml.push(document.getElementById(finiPos).innerHTML)
        for (let i = 0; i < document.getElementById(finiPos).classList.length; i++) {
            storeSwapDivClass.push(document.getElementById(finiPos).classList[i])
        }

        for (let i = 0; i < storeSwapDivClass.length; i++) {
            document.getElementById(finiPos).classList.remove(storeSwapDivClass[i])
        }
        for (let i = 0; i < storeCurrDivClass.length; i++) {
            document.getElementById(finiPos).classList.add(storeCurrDivClass[i])
        }


        document.getElementById(finiPos).innerHTML = storeCurrDivHtml[0]


        for (let i = 0; i < storeCurrDivClass.length; i++) {
            document.getElementById(iniPos).classList.remove(storeCurrDivClass[i])
        }
        for (let i = 0; i < storeSwapDivClass.length; i++) {
            document.getElementById(iniPos).classList.add(storeSwapDivClass[i])
        }


        document.getElementById(iniPos).innerHTML = storeSwapDivHtml[0]

        if (document.getElementById(iniPos).classList.contains('Ricochets')) {
            if (document.getElementById(iniPos).classList.contains('blue')) {
                document.getElementById('blueR' + finiPos.substring(3)).id = "blueR" + iniPos.substring(3)
            } else {
                document.getElementById('redR' + finiPos.substring(3)).id = "redR" + iniPos.substring(3)
            }
        } else if (document.getElementById(iniPos).classList.contains('SRicochets')) {
            if (document.getElementById(iniPos).classList.contains('blue')) {
                document.getElementById('blueSR' + finiPos.substring(3)).id = "blueSR" + iniPos.substring(3)
            } else {
                document.getElementById('redSR' + finiPos.substring(3)).id = "redSR" + iniPos.substring(3)
            }
        } else if (document.getElementById(iniPos).classList.contains('Tank')) {
            document.getElementById(iniPos).style.borderLeft = '8px solid green'
            document.getElementById(finiPos).style.removeProperty('border-left')
        }



        if (document.getElementById(finiPos).classList.contains('Ricochets')) {
            if (document.getElementById(finiPos).classList.contains('blue')) {
                document.getElementById('blueR' + iniPos.substring(3)).id = "blueR" + finiPos.substring(3)
            } else {
                document.getElementById('redR' + iniPos.substring(3)).id = "redR" + finiPos.substring(3)
            }
        } else if (document.getElementById(finiPos).classList.contains('SRicochets')) {
            if (document.getElementById(finiPos).classList.contains('blue')) {
                document.getElementById('blueSR' + iniPos.substring(3)).id = "blueSR" + finiPos.substring(3)
            } else {
                document.getElementById('redSR' + iniPos.substring(3)).id = "redSR" + finiPos.substring(3)
            }
        } else if (document.getElementById(finiPos).classList.contains('Tank')) {
            document.getElementById(finiPos).style.borderLeft = '8px solid green'
            document.getElementById(iniPos).style.removeProperty('border-left')
        }

    }
    let resume;
    let restart;
    let home;
    let resetorpause;

    function resetOrPause() {
        stopCounting()
        document.getElementById('imga').removeEventListener('click', resetorpause)
        document.getElementById('controller').hidden = false
        x = document.getElementsByClassName('div2')
        document.getElementById('heading').hidden = true
        document.getElementById('heading').style.removeProperty('display')
        document.getElementById('div').hidden = true
        document.getElementById('div').style.removeProperty('box-shadow')
        document.getElementById('turns').hidden = true
        for (let i = 0; i < x.length; i++) {
            x[i].hidden = true
        }
        document.body.style.removeProperty('background')
        document.body.style.background = 'skyblue'
        document.getElementById('controller').style.display = 'flex'
        document.getElementById('resume').addEventListener('click', resume = function () {
            resumeGame()
        });
        document.getElementById('restart').addEventListener('click', restart = function () {
            restartGame()
        });
        document.getElementById('home').addEventListener('click', home = function () {
            goHome()
        });
    }

    function restartGame() {
        localStorage.setItem('home', gameMode)
        if (gameMode==3&&playMode==1) {
            localStorage.setItem('playmode',1)
            localStorage.setItem('player1',JSON.stringify(player1))
            localStorage.setItem('player2',JSON.stringify(player2))
            
        }
        if (gameMode==3) {
            if (sess==1) {
                sessionStorage.removeItem('count')
            } else {
                sessionStorage.setItem('count',sess-1)
            }
        }
        location.reload()
    }

    function goHome() {
        location.reload()
    }

    function resumeGame() {
        document.getElementById('resume').removeEventListener('click', resume)
        document.getElementById('controller').hidden = true
        document.getElementById('controller').style.removeProperty('display')
        x = document.getElementsByClassName('div2')
        document.getElementById('heading').hidden = false
        document.getElementById('heading').style.display = 'grid'
        document.getElementById('div').hidden = false
        document.getElementById('div').style.boxShadow = '0 0 10px 10px grey'
        document.getElementById('turns').hidden = false
        for (let i = 0; i < x.length; i++) {
            x[i].hidden = false
        }
        startCounting()
        document.body.style.removeProperty('background')
        document.body.style.background = 'rgb(209, 132, 31)'
        document.getElementById('imga').addEventListener('click', resetorpause = function () {
            resetOrPause()
        })
    }

    document.getElementById('imga').addEventListener('click', resetorpause = function () {
        resetOrPause()
    })

    let undo;
    let redo;

    function recordGame(playerName, playerColor, initialPos, finalPos, moveName, timeAt, rotation, bulletChange) {

        if ((gameMode == 2 || gameMode == 3||gameMode==4) && redoNumber == 0) {
            pyColor = localStorage.getItem('moves')
            pyInitial = localStorage.getItem('initial')
            pyFinal = localStorage.getItem('final')
            pyMove = localStorage.getItem('moveName')
            pyTime = localStorage.getItem('timeAt')
            pyName = localStorage.getItem('playerName')
            pyRotation = localStorage.getItem('rotation')
            pyBullet = localStorage.getItem('bullet')

            if (pyColor == null) {
                pyColor = []
                pyInitial = []
                pyFinal = []
                pyMove = []
                pyTime = []
                pyName = []
                pyRotation = []
                pyBullet = []
            } else {
                pyColor = JSON.parse(pyColor)
                pyInitial = JSON.parse(pyInitial)
                pyFinal = JSON.parse(pyFinal)
                pyMove = JSON.parse(pyMove)
                pyTime = JSON.parse(pyTime)
                pyName = JSON.parse(pyName)
                pyRotation = JSON.parse(pyRotation)
                pyBullet = JSON.parse(pyBullet)
            }
            pyColor.push(playerColor)
            pyInitial.push(initialPos)
            pyFinal.push(finalPos)
            pyMove.push(moveName)
            pyTime.push(timeAt)
            pyName.push(playerName)
            pyRotation.push(rotation)
            pyBullet.push(bulletChange)

            localStorage.setItem('moves', JSON.stringify(pyColor))
            localStorage.setItem('initial', JSON.stringify(pyInitial))
            localStorage.setItem('final', JSON.stringify(pyFinal))
            localStorage.setItem('moveName', JSON.stringify(pyMove))
            localStorage.setItem('timeAt', JSON.stringify(pyTime))
            localStorage.setItem('playerName', JSON.stringify(pyName))
            localStorage.setItem('rotation', JSON.stringify(pyRotation))
            localStorage.setItem('bullet', JSON.stringify(pyBullet))

            undoNumber++
            actual = false
        } else if ((gameMode == 2 || gameMode == 3||gameMode==4) && redoNumber != 0 && actual) {
            actual = false
            pyColor = localStorage.getItem('moves')
            pyInitial = localStorage.getItem('initial')
            pyFinal = localStorage.getItem('final')
            pyMove = localStorage.getItem('moveName')
            pyTime = localStorage.getItem('timeAt')
            pyName = localStorage.getItem('playerName')
            pyRotation = localStorage.getItem('rotation')
            pyBullet = localStorage.getItem('bullet')


            pyColor = JSON.parse(pyColor)
            pyInitial = JSON.parse(pyInitial)
            pyFinal = JSON.parse(pyFinal)
            pyMove = JSON.parse(pyMove)
            pyTime = JSON.parse(pyTime)
            pyName = JSON.parse(pyName)
            pyRotation = JSON.parse(pyRotation)
            pyBullet = JSON.parse(pyBullet)


            pyColor.splice(pyColor.length - redoNumber)
            pyInitial.splice(pyInitial.length - redoNumber)
            pyFinal.splice(pyFinal.length - redoNumber)
            pyMove.splice(pyMove.length - redoNumber)
            pyTime.splice(pyTime.length - redoNumber)
            pyName.splice(pyName.length - redoNumber)
            pyRotation.splice(pyRotation.length - redoNumber)
            pyBullet.splice(pyBullet.length - redoNumber)


            pyColor.push(playerColor)
            pyInitial.push(initialPos)
            pyFinal.push(finalPos)
            pyMove.push(moveName)
            pyTime.push(timeAt)
            pyName.push(playerName)
            pyRotation.push(rotation)
            pyBullet.push(bulletChange)


            localStorage.setItem('moves', JSON.stringify(pyColor))
            localStorage.setItem('initial', JSON.stringify(pyInitial))
            localStorage.setItem('final', JSON.stringify(pyFinal))
            localStorage.setItem('moveName', JSON.stringify(pyMove))
            localStorage.setItem('timeAt', JSON.stringify(pyTime))
            localStorage.setItem('playerName', JSON.stringify(pyName))
            localStorage.setItem('rotation', JSON.stringify(pyRotation))
            localStorage.setItem('bullet', JSON.stringify(pyBullet))


            undoNumber++
            redoNumber = 0

        }




    }
    document.getElementById('undo').addEventListener('click', undo = function () {

        if (document.getElementById('p2').innerText == 'Nothing' && undoNumber != 0) {
            pyColor = localStorage.getItem('moves')
            pyInitial = localStorage.getItem('initial')
            pyFinal = localStorage.getItem('final')
            pyMove = localStorage.getItem('moveName')
            pyTime = localStorage.getItem('timeAt')
            pyName = localStorage.getItem('playerName')
            pyRotation = localStorage.getItem('rotation')

            if (pyColor != null) {
                pyColor = JSON.parse(pyColor)
                pyInitial = JSON.parse(pyInitial)
                pyFinal = JSON.parse(pyFinal)
                pyMove = JSON.parse(pyMove)
                pyTime = JSON.parse(pyTime)
                pyName = JSON.parse(pyName)
                pyRotation = JSON.parse(pyRotation)

                redoNumber++
                undoNumber--
                if (pyColor[pyColor.length - redoNumber] == 'red') {
                    document.getElementById('s1').classList.remove('BlueTurn')
                    document.getElementById('s1').classList.add('RedTurn')
                    document.getElementById('s1').innerHTML = 'Red'
                } else if (pyColor[pyColor.length - redoNumber] == 'blue') {
                    document.getElementById('s1').classList.remove('RedTurn')
                    document.getElementById('s1').classList.add('BlueTurn')
                    document.getElementById('s1').innerHTML = 'Blue'
                }
                timeBack = pyTime[pyTime.length - redoNumber].split(':')
                seconds = parseInt(timeBack[1]) - 1
                minutes = parseInt(timeBack[0])
                if (pyMove[pyMove.length - redoNumber] == 0) {
                    if (pyName[pyName.length - redoNumber] == 'Ti' || pyName[pyName.length - redoNumber] == 'Ta') {
                        pathOfTitanAndTank(pyFinal[pyFinal.length - redoNumber])
                    } else if (pyName[pyName.length - redoNumber] == 'C') {
                        pathOfCanon(pyFinal[pyFinal.length - redoNumber])
                    } else if (pyName[pyName.length - redoNumber] == 'R') {
                        pathOfRicochets(pyFinal[pyFinal.length - redoNumber])
                        rotationOfRicochets(pyFinal[pyFinal.length - redoNumber], 'move')
                    } else if (pyName[pyName.length - redoNumber] == 'SR') {
                        pathOfSRicochets(pyFinal[pyFinal.length - redoNumber])
                        rotationOfSRicochets(pyFinal[pyFinal.length - redoNumber], 'move')
                    }
                    greenPath(pyInitial[pyInitial.length - redoNumber])
                } else if (pyMove[pyMove.length - redoNumber] == 1) {
                    if (pyName[pyName.length - redoNumber] == 'R') {
                        pathOfRicochets(pyFinal[pyFinal.length - redoNumber])
                        if (pyRotation[pyRotation.length - redoNumber] == 'r') {
                            rotationOfRicochets(pyFinal[pyFinal.length - redoNumber], 'left')
                        } else {
                            rotationOfRicochets(pyFinal[pyFinal.length - redoNumber], 'right')
                        }
                    } else if (pyName[pyName.length - redoNumber] == 'SR') {
                        pathOfSRicochets(pyFinal[pyFinal.length - redoNumber])
                        if (pyRotation[pyRotation.length - redoNumber] == 'r') {
                            rotationOfSRicochets(pyFinal[pyFinal.length - redoNumber], 'left')
                        } else {
                            rotationOfSRicochets(pyFinal[pyFinal.length - redoNumber], 'right')
                        }
                    }
                } else if (pyMove[pyMove.length - redoNumber] == -1) {
                    createRicochets(pyColor[pyColor.length - redoNumber] == 'blue' ? 'red' : 'blue', [parseInt(pyInitial[pyInitial.length - redoNumber])], pyBullet[pyBullet.length - redoNumber][2], pyBullet[pyBullet.length - redoNumber][5], pyBullet[pyBullet.length - redoNumber][4], pyBullet[pyBullet.length - redoNumber][3])
                    document.getElementById('undo').click()
                } else if (pyMove[pyMove.length - redoNumber] == 2) {
                    swapPosition('div' + pyInitial[pyInitial.length - redoNumber], 'div' + pyFinal[pyFinal.length - redoNumber])
                }

            }
        }
    })
    document.getElementById('redo').addEventListener('click', redo = function () {
        if (document.getElementById('p2').innerText == 'Nothing' && redoNumber != 0) {
            pyColor = localStorage.getItem('moves')
            pyInitial = localStorage.getItem('initial')
            pyFinal = localStorage.getItem('final')
            pyMove = localStorage.getItem('moveName')
            pyTime = localStorage.getItem('timeAt')
            pyName = localStorage.getItem('playerName')
            pyRotation = localStorage.getItem('rotation')


            if (pyColor != null) {

                pyColor = JSON.parse(pyColor)
                pyInitial = JSON.parse(pyInitial)
                pyFinal = JSON.parse(pyFinal)
                pyMove = JSON.parse(pyMove)
                pyTime = JSON.parse(pyTime)
                pyName = JSON.parse(pyName)
                pyRotation = JSON.parse(pyRotation)
                
                if (pyColor[pyColor.length - redoNumber] == 'red') {
                    document.getElementById('s1').classList.remove('RedTurn')
                    document.getElementById('s1').classList.add('BlueTurn')
                    document.getElementById('s1').innerHTML = 'Blue'
                } else if (pyColor[pyColor.length - redoNumber] == 'blue') {
                    document.getElementById('s1').classList.remove('BlueTurn')
                    document.getElementById('s1').classList.add('RedTurn')
                    document.getElementById('s1').innerHTML = 'Red'
                }

                timeBack = pyTime[pyTime.length - redoNumber].split(':')
                seconds = parseInt(timeBack[1]) - 1
                minutes = parseInt(timeBack[0])


                if (pyMove[pyMove.length - redoNumber] == 0) {
                    if (pyName[pyName.length - redoNumber] == 'Ti' || pyName[pyName.length - redoNumber] == 'Ta') {
                        pathOfTitanAndTank(pyInitial[pyInitial.length - redoNumber])
                    } else if (pyName[pyName.length - redoNumber] == 'C') {
                        pathOfCanon(pyInitial[pyInitial.length - redoNumber])
                    } else if (pyName[pyName.length - redoNumber] == 'R') {
                        pathOfRicochets(pyInitial[pyInitial.length - redoNumber])
                        rotationOfRicochets(pyInitial[pyInitial.length - redoNumber], 'move')
                    } else if (pyName[pyName.length - redoNumber] == 'SR') {
                        pathOfSRicochets(pyInitial[pyInitial.length - redoNumber])
                        rotationOfSRicochets(pyInitial[pyInitial.length - redoNumber], 'move')
                    }
                    greenPath(pyFinal[pyFinal.length - redoNumber])
                    if (pyMove[pyMove.length - redoNumber + 1] == -1) {
                        document.getElementById('div' + pyInitial[pyInitial.length - redoNumber + 1]).classList.remove('Ricochets')
                        document.getElementById('div' + pyInitial[pyInitial.length - redoNumber + 1]).classList.remove(pyColor[pyColor.length - redoNumber + 1] == 'blue' ? 'red' : 'blue')
                        document.getElementById((pyColor[pyColor.length - redoNumber + 1] == 'blue' ? 'red' : 'blue') + 'R' + pyInitial[pyInitial.length - redoNumber + 1]).remove()
                        redoNumber -= 1
                        undoNumber += 1
                    }


                } else if (pyMove[pyMove.length - redoNumber] == 1) {
                    if (pyName[pyName.length - redoNumber] == 'R') {
                        pathOfRicochets(pyFinal[pyFinal.length - redoNumber])
                        if (pyRotation[pyRotation.length - redoNumber] == 'r') {
                            rotationOfRicochets(pyFinal[pyFinal.length - redoNumber], 'right')
                        } else {
                            rotationOfRicochets(pyFinal[pyFinal.length - redoNumber], 'left')
                        }
                    } else if (pyName[pyName.length - redoNumber] == 'SR') {
                        pathOfSRicochets(pyFinal[pyFinal.length - redoNumber])
                        if (pyRotation[pyRotation.length - redoNumber] == 'r') {
                            rotationOfSRicochets(pyFinal[pyFinal.length - redoNumber], 'right')
                        } else {
                            rotationOfSRicochets(pyFinal[pyFinal.length - redoNumber], 'left')
                        }
                    }
                    if (pyMove[pyMove.length - redoNumber + 1] == -1) {
                        document.getElementById('div' + pyInitial[pyInitial.length - redoNumber + 1]).classList.remove('Ricochets')
                        document.getElementById('div' + pyInitial[pyInitial.length - redoNumber + 1]).classList.remove(pyColor[pyColor.length - redoNumber + 1] == 'blue' ? 'red' : 'blue')
                        document.getElementById((pyColor[pyColor.length - redoNumber + 1] == 'blue' ? 'red' : 'blue') + 'R' + pyInitial[pyInitial.length - redoNumber + 1]).remove()
                        redoNumber -= 1
                        undoNumber += 1
                    }
                } else if (pyMove[pyMove.length - redoNumber] == -1) {
                    document.getElementById('div' + pyInitial[pyInitial.length - redoNumber]).classList.remove('Ricochets')
                    document.getElementById('div' + pyInitial[pyInitial.length - redoNumber]).classList.remove(pyColor[pyColor.length - redoNumber] == 'blue' ? 'red' : 'blue')
                    document.getElementById((pyColor[pyColor.length - redoNumber] == 'blue' ? 'red' : 'blue') + 'R' + pyInitial[pyInitial.length - redoNumber]).remove()
                } else if (pyMove[pyMove.length - redoNumber] == 2) {
                    swapPosition('div' + pyFinal[pyFinal.length - redoNumber], 'div' + pyInitial[pyInitial.length - redoNumber])
                }
                redoNumber -= 1
                undoNumber += 1

            }
        }
    })
    
    function gameEnds(winnerName) {
        stopCounting()
        document.getElementById('heading').innerHTML = ''
        document.getElementById('heading').remove()
        document.getElementById('div').innerHTML = ''
        document.getElementById('div').remove()
        document.getElementById('controller').hidden = false
        
        
        document.getElementById('turns').remove()
        document.getElementById('resume').remove()
        document.getElementById('winner').hidden = false




        document.getElementById('winner').innerText = winnerName.toUpperCase() + '  WINS';
        document.getElementById('winner').style.backgroundColor = winnerName.toLowerCase()
        document.body.style.removeProperty('background')
        document.body.style.background = 'skyblue'
        document.getElementById('controller').style.display = 'flex'

        
        document.getElementById('home').addEventListener('click', home = function () {
            goHome()
        });
        if (gameMode == 4) {
            document.getElementById('restart').hidden = true
        }else {
            document.getElementById('restart').addEventListener('click', restart = function () {
                restartGame()
            });
        }
        if (gameMode == 2 || gameMode == 3||gameMode==4) {
            document.getElementById('scoreboard').hidden = false
            document.getElementById('win').hidden = false
            document.getElementById('opponent').hidden = false

            pyColor = localStorage.getItem('moves')
            pyInitial = localStorage.getItem('initial')
            pyFinal = localStorage.getItem('final')
            pyMove = localStorage.getItem('moveName')
            pyTime = localStorage.getItem('timeAt')
            pyName = localStorage.getItem('playerName')
            pyRotation = localStorage.getItem('rotation')
            pyBullet = localStorage.getItem('bullet')


            if (pyColor != null) {
                pyColor = JSON.parse(pyColor)
                pyInitial = JSON.parse(pyInitial)
                pyFinal = JSON.parse(pyFinal)
                pyMove = JSON.parse(pyMove)
                pyTime = JSON.parse(pyTime)
                pyName = JSON.parse(pyName)
                pyRotation = JSON.parse(pyRotation)
                pyBullet = JSON.parse(pyBullet)
                
                for (let i = 0; i < pyColor.length; i++) {
                    if (pyColor[i] == 'red') {
                        playername = (pyName[i] == 'Ti' ? 'Titan' : pyName[i] == 'Ta' ? 'Tank' : pyName[i] == 'C' ? 'Canon' : pyName[i] == 'SR' ? 'Semi-Ricochet' : pyName[i] == 'B' ? 'Bullet' : pyName[i] == 'R' ? 'Ricochets' : '')
                        playerrotation = (pyRotation[i] == 'l' ? 'Clockwise' : 'Anti-Clockwise')
                        playermove = (pyMove[i] == 0 ? playername + ' moved from Plate ' + pyInitial[i] + ' to Plate ' + pyFinal[i] : pyMove[i] == 1 ? playername + ' rorates towards ' + playerrotation : pyMove[i] == -1 ? playername + ' kills blue Ricochets' : pyMove[i] == 2 ? playername + ' swapped place ' : '')
                        document.getElementById('movesr').innerHTML += '<p>Move' + i + ': ' + playermove + '</p>'
                    }
                    if (pyColor[i] == 'blue') {
                        playername = (pyName[i] == 'Ti' ? 'Titan' : pyName[i] == 'Ta' ? 'Tank' : pyName[i] == 'C' ? 'Canon' : pyName[i] == 'SR' ? 'Semi-Ricochet' : pyName[i] == 'B' ? 'bullet' : pyName[i] == 'R' ? 'Ricochets' : '')
                        playerrotation = (pyRotation[i] == 'l' ? 'Clockwise' : 'Anti-Clockwise')
                        playermove = (pyMove[i] == 0 ? playername + ' moved from Plate ' + pyInitial[i] + ' to Plate ' + pyFinal[i] : pyMove[i] == 1 ? playername + ' rorates towards ' + playerrotation : pyMove[i] == -1 ? playername + ' kills red Ricochets' : pyMove[i] == 2 ? playername + ' swapped place ' : '')
                        document.getElementById('movesb').innerHTML += '<p>Move' + i + ': ' + playermove + '</p>'
                    }
                }
            }

        }
        if (gameMode==3) {
            document.getElementById('replay').hidden = false
            document.getElementById('replay').addEventListener('click',function () {
                localStorage.setItem('home',4)
                location.reload()
            })
            localStorage.setItem('win',winnerName)
        }
        
    }
    
    if (gameMode==4){
        redoNumber = JSON.parse(localStorage.getItem('moves')).length
        undoNumber = 0
            let intervalId3 = setInterval(() => {
                if (redoNumber==0) {
                    clearInterval(intervalId3)
                    gameEnds(localStorage.getItem('win'))
                    localStorage.removeItem('win')
                    localStorage.removeItem('moves')
                    localStorage.removeItem('initial')
                    localStorage.removeItem('final')
                    localStorage.removeItem('moveName')
                    localStorage.removeItem('timeAt')
                    localStorage.removeItem('playerName')
                    localStorage.removeItem('rotation')
                    localStorage.removeItem('bullet')
                }else{
                    document.getElementById('redo').click()
                }
            }, 2000);
                
            
            
       
    }

    function bot() {
        if (botCalled) {
            botCalled = false
            setTimeout(() => {
                whichMove = Math.floor(Math.random()*5)
                if (sess%2==1) {
                    botColor = 'red'
                }else{
                    botColor = 'blue'
                }

                if (whichMove==0) {
                    movename = 'Titan'
                }else if (whichMove==1) {
                    movename = 'Tank'
                }else if (whichMove==2) {
                    movename = 'Canon'
                }else if (whichMove==3) {
                    movename = 'Ricochets'
                }else if (whichMove==4) {
                    movename = 'SRicochets'
                }

                
                whichplay = document.getElementsByClassName(botColor+' '+movename)[Math.floor(Math.random()*document.getElementsByClassName(botColor+' '+movename).length)].id
                document.getElementById(whichplay).click()

                if (whichMove==0||whichMove==1||whichMove==2) {
                    allowedPath = document.getElementsByClassName('green')[Math.floor(Math.random()*document.getElementsByClassName('green').length)].id
                    greenPath(allowedPath.substring(3))
                }

                if (whichMove==3||whichMove==4) {
                    options = Math.floor(Math.random()*3)
                    if (options==0) {
                        document.getElementById('rot1').click()
                    }else if (options==1) {
                        document.getElementById('rot2').click()
                    }else if (options==2) {
                        document.getElementById('rot3').click()
                        allowedPath = document.getElementsByClassName('green')[Math.floor(Math.random()*document.getElementsByClassName('green').length)].id
                        greenPath(allowedPath.substring(3))
                    }
                }
                direction = Math.floor(Math.random()*4)
                if (direction==0) {
                    document.getElementById(botColor+'Bottom').click();
                }else if (direction==1) {
                    document.getElementById(botColor+'Left').click();
                }else if (direction==2) {
                    document.getElementById(botColor+'Top').click();
                }else if (direction==3) {
                    document.getElementById(botColor+'Right').click();
                }
            }, 1000);
        }
        
    }

    if (gameMode==3) {
        dragElement('wrapper1')
        dragElement('wrapper2')
    }
    
    function dragElement(idName) {
        var pos1 = 0,pos2 = 0,pos3 = 0,pos4 = 0;
        document.getElementById(idName).onmousedown = dragMouseDown;
        document.getElementsByClassName('tooltipDiv')[0].style.top = (-200-130*(player1.length-1))+'%'
        document.getElementsByClassName('tooltipDiv')[1].style.top = (-200-130*(player2.length-1))+'%'
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.getElementById(idName).style.top = (document.getElementById(idName).offsetTop - pos2) + "px";
            document.getElementById(idName).style.left = (document.getElementById(idName).offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    function showMessage(msg) {
        let toastBox = document.getElementById('toastBox');
        let toast = document.createElement('div')
        toast.classList.add('toast')
        toast.innerHTML = msg
        toastBox.appendChild(toast);

        setTimeout(() => {
            toast.remove()
        }, 5000);
    }

    startCounting()
}

