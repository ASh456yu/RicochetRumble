window.onload = function () {
    console.log('window loaded');
    document.body.style.background = 'rgb(209, 132, 31)'

    let gameMode = localStorage.getItem('home')
    localStorage.removeItem('moves')
    localStorage.removeItem('initial')
    localStorage.removeItem('final')
    localStorage.removeItem('moveName')
    localStorage.removeItem('timeAt')
    localStorage.removeItem('playerName')
    localStorage.removeItem('rotation')
    localStorage.removeItem('bullet')

    if (gameMode == 2 || gameMode == 3) {
        document.getElementById('backMusic').innerHTML = '<audio autoplay loop src="audios/music.mpeg"></audio>'
    }

    if (gameMode == null) {
        location.replace('./home.html')
    } else {
        localStorage.removeItem('home')
    }

    let lefto;
    let righto;
    let moveo;
    let undoNumber = 0;
    let redoNumber = 0;

    const targetElement = document.getElementById('div');
    document.getElementById('div').style.boxShadow = '0 0 10px 10px grey'
    document.getElementById('heading').style.display = 'grid'
    if (gameMode == 2 || gameMode == 3) {
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

        document.getElementsByClassName('div2')[i].addEventListener('click', function () {
            if (document.getElementById('p2').innerText == 'Nothing') {
                if ((document.getElementById('div' + parseInt(i + 1)).classList.contains('red') && document.getElementById('s1').innerText == 'Red') || (document.getElementById('div' + parseInt(i + 1)).classList.contains('blue') && document.getElementById('s1').innerText == 'Blue') || document.getElementById('div' + parseInt(i + 1)).classList.contains('green')) {
                    actual = true
                    if (document.getElementById('div' + parseInt(i + 1)).innerText == 'Titan' || document.getElementById('div' + parseInt(i + 1)).innerText == 'Tank') {
                        pathOfTitanAndTank(parseInt(i + 1));
                    } else if (document.getElementById('div' + parseInt(i + 1)).innerText == 'Canon') {
                        pathOfCanon(parseInt(i + 1));
                    } else if (document.getElementById('div' + parseInt(i + 1)).classList.contains('Ricochets')) {
                        pathOfRicochets(parseInt(i + 1));
                    } else if (document.getElementById('div' + parseInt(i + 1)).classList.contains('SRicochets')) {
                        pathOfSRicochets(parseInt(i + 1));
                    }
                    const x1 = document.getElementById('div' + parseInt(i + 1)).classList;
                    if (x1.contains('green')) {
                        greenPath(parseInt(i + 1));
                    }
                } else {
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
            }
        });
    }

    titanDivRed = [6]
    tankDivRed = [1, 8]
    RicochetsDivRed = [9, 16]
    SRicochetsDivRed = [11, 14]

    titanDivBlue = [62]
    tankDivBlue = [57, 64]
    RicochetsDivBlue = [49, 56]
    SRicochetsDivBlue = [51, 54]


    createTitan('Titan', titanDivRed, 'red')
    createTank('Tank', tankDivRed, 'red')


    createTitan('Titan', titanDivBlue, 'blue')
    createTank('Tank', tankDivBlue, 'blue')

    createRicochets('red', RicochetsDivRed, '', '', '80px solid red', '70px solid transparent')
    createRicochets('blue', RicochetsDivBlue, '', '', '80px solid blue', '70px solid transparent')

    createSRicochets('red', SRicochetsDivRed)
    createSRicochets('blue', SRicochetsDivBlue)

    function createTitan(params, division, color) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).innerText = params;
            document.getElementById('div' + division[i]).classList.add(color, params);
        }
    }

    function createTank(params, division, color) {
        for (let i = 0; i < division.length; i++) {
            document.getElementById('div' + division[i]).innerText = params;
            if (gameMode == 2 || gameMode == 3) {
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

    document.getElementById('div3').innerText = "Canon";
    document.getElementById('div3').classList.add('red', 'Canon');

    document.getElementById('div59').innerText = "Canon";
    document.getElementById('div59').classList.add('blue', 'Canon');

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
                text = document.getElementById('div' + y).innerText

                if (text != '') {

                    if (text == 'Titan') {
                        col = document.getElementById('div' + y).classList.contains('red') ? 'red' : 'blue'
                        recordGame('Ti', col, y, params, 0, minutes + ':' + seconds, null, null)
                    } else if (text == 'Tank') {
                        col = document.getElementById('div' + y).classList.contains('red') ? 'red' : 'blue'
                        recordGame('Ta', col, y, params, 0, minutes + ':' + seconds, null, null)
                        if (gameMode == 2 || gameMode == 3) {
                            document.getElementById('div' + params).style.borderLeft = '8px solid yellowgreen'
                            document.getElementById('div' + y).style.removeProperty('border-left')
                        }

                    } else {
                        col = document.getElementById('div' + y).classList.contains('red') ? 'red' : 'blue'
                        recordGame('C', col, y, params, 0, minutes + ':' + seconds, null, null)
                    }

                    document.getElementById('div' + params).innerText = text
                    document.getElementById('div' + params).classList.add(text)
                    document.getElementById('div' + y).classList.remove(text, 'clicked')
                    document.getElementById('div' + y).innerText = ''
                } else {

                    if (document.getElementById('div' + y).classList.contains('SRicochets') && document.getElementById('div' + y).classList.contains('red')) {
                        document.getElementById('redSR' + y).id = 'redSR' + params
                        recordGame('SR', 'red', y, params, 0, minutes + ':' + seconds, null, null)
                    } else if (document.getElementById('div' + y).classList.contains('SRicochets') && document.getElementById('div' + y).classList.contains('blue')) {
                        document.getElementById('blueSR' + y).id = 'blueSR' + params
                        recordGame('SR', 'blue', y, params, 0, minutes + ':' + seconds, null, null)
                    } else if (document.getElementById('div' + y).classList.contains('Ricochets') && document.getElementById('div' + y).classList.contains('red')) {
                        document.getElementById('redR' + y).id = 'redR' + params
                        recordGame('R', 'red', y, params, 0, minutes + ':' + seconds, null, null)
                    } else if (document.getElementById('div' + y).classList.contains('Ricochets') && document.getElementById('div' + y).classList.contains('blue')) {
                        document.getElementById('blueR' + y).id = 'blueR' + params
                        recordGame('R', 'blue', y, params, 0, minutes + ':' + seconds, null, null)
                    }

                    document.getElementById('div' + params).innerHTML = document.getElementById('div' + y).innerHTML
                    document.getElementById('div' + y).innerHTML = ''
                    if (document.getElementById('div' + y).classList.contains('Ricochets')) {
                        document.getElementById('div' + y).classList.remove('Ricochets')
                        document.getElementById('div' + params).classList.add('Ricochets')
                    } else if (document.getElementById('div' + y).classList.contains('SRicochets')) {
                        document.getElementById('div' + y).classList.remove('SRicochets')
                        document.getElementById('div' + params).classList.add('SRicochets')
                    }
                    document.getElementById('div' + y).classList.remove('clicked')
                }


                document.getElementById('div' + y).style.removeProperty('background-color')

                if (document.getElementById('div' + y).classList.contains('red')) {
                    document.getElementById('div' + y).classList.remove('red')
                    document.getElementById('div' + params).classList.add('red')
                } else {
                    document.getElementById('div' + y).classList.remove('blue')
                    document.getElementById('div' + params).classList.add('blue')
                }
                document.getElementById('div' + params).classList.remove('green', 'parent' + y)

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
                    bulletOfCanon(params);
                }

                break;
            }
        }
    }

    function bulletOfCanon(params) {
        tp = 0;
        clas = document.getElementById('div' + params).classList
        ids = 0
        if (clas.contains('red')) {
            x = document.getElementsByClassName('Canon red')
        } else {
            x = document.getElementsByClassName('Canon blue')
        }

        if (clas.contains('red')) {
            changeId = 8
            htmlStr = '<div id="bulletred"></div>';
            decider = 1
            bulletName = 'bulletred'
            colorToCompare = 'red'
            oppositeColor = 'blue'
        } else if (clas.contains('blue')) {
            changeId = 8
            htmlStr = '<div id="bulletblue"></div>';
            decider = -1
            bulletName = 'bulletblue'
            colorToCompare = 'blue'
            oppositeColor = 'red'
        }
        const intervalId = setInterval(() => {
            ids = ids + (decider * changeId)
            if (((parseInt(x[0].id.substring(3)) + ids) < 65) && ((parseInt(x[0].id.substring(3)) + ids) > 0)) {
                h = document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids))
                document.getElementById('div' + (parseInt(x[0].id.substring(3)) + ids)).insertAdjacentHTML('beforeend', htmlStr);
                setTimeout(() => {
                    if (document.getElementById(bulletName)) {
                        document.getElementById(bulletName).remove()
                    }
                }, 200);
            }
            if (((parseInt(x[0].id.substring(3)) + ids) > 64) || ((parseInt(x[0].id.substring(3)) + ids) < 0)) {
                document.getElementById('p2').innerText = 'Nothing'
                clearInterval(intervalId)
                restartCounting()
                startCounting()
            }

            if ((((parseInt(x[0].id.substring(3)) + ids) % 8 == 0 && changeId == (1 * decider)) || ((parseInt(x[0].id.substring(3)) + ids - 1) % 8 == 0 && changeId == (-1 * decider))) && !(h.classList.contains('Ricochets') && h.classList.contains(colorToCompare)) && !(h.classList.contains('SRicochets') && h.classList.contains(colorToCompare))) {
                document.getElementById('p2').innerText = 'Nothing'
                clearInterval(intervalId)
                restartCounting()
                startCounting()
            }
            if (h.classList.contains('Ricochets')) {
                document.getElementById(bulletName).style.top = '-50px'
                document.getElementById(bulletName).style.position = 'relative'
            }
            if ((h.classList.contains(oppositeColor) && h.classList.contains('Tank'))) {
                if (gameMode == 2 || gameMode == 3) {
                    b1 = h.style.borderLeft
                    b2 = h.style.borderRight
                    b3 = h.style.borderTop
                    b4 = h.style.borderBottom
                    if (!((b1 != '' && changeId == (1 * decider)) || (b2 != '' && changeId == (-1 * decider)) || (b3 != '' && changeId == (8 * decider)) || (b4 != '' && changeId == (-8 * decider)))) {
                        document.getElementById('p2').innerText = 'Nothing'
                        clearInterval(intervalId)
                        restartCounting()
                        startCounting()
                    }
                } else {
                    document.getElementById('p2').innerText = 'Nothing'
                    clearInterval(intervalId)
                    restartCounting()
                    startCounting()
                }
            }
            if (h.classList.contains(oppositeColor) && h.classList.contains('Titan')) {
                window.alert(oppositeColor.toUpperCase() + ' Done')
                document.getElementById('p2').innerText = 'Nothing'
                clearInterval(intervalId)
                stopCounting()
                gameEnds(colorToCompare)
            }
            if (h.classList.contains('Ricochets') && h.classList.contains(colorToCompare)) {
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
                    document.getElementById('p2').innerText = 'Nothing'
                    clearInterval(intervalId)
                    restartCounting()
                    startCounting()
                }
            }
            if ((gameMode == 2 || gameMode == 3) && h.classList.contains('Ricochets') && h.classList.contains(oppositeColor)) {

                p = document.getElementById(oppositeColor + 'R' + h.id.substring(3))
                leftdir = p.style.borderLeft
                rightdir = p.style.borderRight
                bottomdir = p.style.borderBottom
                topdir = p.style.borderTop

                if (topdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-1 * decider)) {
                } else if (topdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-8 * decider)) {
                } else if (topdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (1 * decider)) {
                } else if (topdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (-8 * decider)) {
                }
                else if (bottomdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (-1 * decider)) {
                } else if (bottomdir == ('80px solid ' + colorToCompare) && rightdir == '70px solid transparent' && changeId == (8 * decider)) {
                } else if (bottomdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (1 * decider)) {
                } else if (bottomdir == ('80px solid ' + colorToCompare) && leftdir == '70px solid transparent' && changeId == (8 * decider)) {
                }
                else if (leftdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-1 * decider)) {
                } else if (leftdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-8 * decider)) {
                } else if (leftdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (-1 * decider)) {
                } else if (leftdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (8 * decider)) {
                }
                else if (rightdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (-8 * decider)) {
                } else if (rightdir == ('80px solid ' + colorToCompare) && bottomdir == '70px solid transparent' && changeId == (1 * decider)) {
                } else if (rightdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (1 * decider)) {
                } else if (rightdir == ('80px solid ' + colorToCompare) && topdir == '70px solid transparent' && changeId == (8 * decider)) {
                } else {
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

                }
            }

            if (h.classList.contains('SRicochets') && h.classList.contains(colorToCompare)) {
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
        document.getElementById('rot1').hidden = true
        document.getElementById('rot2').hidden = true
        document.getElementById('rot3').hidden = true
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
                    bulletOfCanon(ids)
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
                    bulletOfCanon(ids)
                }

            } else {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
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
                    document.getElementById('redR' + ids).style.borderTop = '80px solid blue'
                } else if (topdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-left')
                    document.getElementById('redR' + ids).style.borderRight = '70px solid transparent'
                } else if (topdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-top')
                    document.getElementById('redR' + ids).style.borderBottom = '80px solid blue'
                }
                if (redoNumber == 0) {
                    bulletOfCanon(ids)
                }
            } else if (dir == 'left') {
                recordGame('R', 'red', ids, ids, 1, minutes + ':' + seconds, 'l', null)
                leftdir = x.borderLeft
                topdir = x.borderTop
                bottomdir = x.borderBottom
                rightdir = x.borderRight
                
                if (bottomdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-bottom')
                    document.getElementById('redR' + ids).style.borderTop = '80px solid blue'
                } else if (topdir == '80px solid red' && rightdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-right')
                    document.getElementById('redR' + ids).style.borderLeft = '70px solid transparent'
                } else if (topdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-top')
                    document.getElementById('redR' + ids).style.borderBottom = '80px solid blue'
                } else if (bottomdir == '80px solid red' && leftdir == '70px solid transparent') {
                    document.getElementById('redR' + ids).style.removeProperty('border-left')
                    document.getElementById('redR' + ids).style.borderRight = '70px solid transparent'
                }
                if (redoNumber == 0) {
                    bulletOfCanon(ids)
                }
            } else {
                arr = [1, -1, 8, -8, 9, -9, 7, -7]
                greenPathFormation(parseInt(ids), arr)
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
        } else {
            remUnnecessary()
            document.getElementById('div' + params).classList.add('clicked')
            document.getElementById('rot1').hidden = false
            document.getElementById('rot2').hidden = false
            document.getElementById('rot3').hidden = false
            window.scrollBy(0, window.innerHeight)
            if (document.getElementById('div' + params).classList.contains('red')) {
                document.getElementById('rot1').addEventListener('click', lefto = function () {
                    rotationOfRicochets(params, 'left')
                })
                document.getElementById('rot2').addEventListener('click', righto = function () {
                    rotationOfRicochets(params, 'right')
                })
                document.getElementById('rot3').addEventListener('click', moveo = function () {
                    rotationOfRicochets(params, 'move')
                })
            } else {
                document.getElementById('rot1').addEventListener('click', lefto = function () {
                    rotationOfRicochets(params, 'left')
                })
                document.getElementById('rot2').addEventListener('click', righto = function () {
                    rotationOfRicochets(params, 'right')
                })
                document.getElementById('rot3').addEventListener('click', moveo = function () {
                    rotationOfRicochets(params, 'move')
                })
            }

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
                    bulletOfCanon(ids)
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
                    bulletOfCanon(ids)
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
                    bulletOfCanon(ids)
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
                    bulletOfCanon(ids)
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

        if ((gameMode == 2 || gameMode == 3) && redoNumber == 0) {
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
        } else if ((gameMode == 2 || gameMode == 3) && redoNumber != 0 && actual) {
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


            if (pyColor != null) {

                pyColor = JSON.parse(pyColor)
                pyInitial = JSON.parse(pyInitial)
                pyFinal = JSON.parse(pyFinal)
                pyMove = JSON.parse(pyMove)
                pyTime = JSON.parse(pyTime)
                pyName = JSON.parse(pyName)



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

        document.getElementById('restart').addEventListener('click', restart = function () {
            restartGame()
        });
        document.getElementById('home').addEventListener('click', home = function () {
            goHome()
        });
        if (gameMode == 2 || gameMode == 3) {
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
                        playername = (pyName[i] == 'Ti' ? 'Titan' : pyName[i] == 'Ta' ? 'Tank' : pyName[i] == 'C' ? 'Canon' : pyName[i] == 'SR' ? 'Semi-Ricochet' : pyName[i] == 'B' ? 'Bullet' : 'Ricochets')
                        playerrotation = (pyRotation[i] == 'l' ? 'left' : 'right')
                        playermove = (pyMove[i] == 0 ? playername + ' moved from Plate ' + pyInitial[i] + ' to Plate ' + pyFinal[i] : pyMove[i] == 1 ? playername + ' rorates towards ' + playerrotation : pyMove[i] == -1 ? playername + ' kills blue Ricochets' : '')
                        document.getElementById('movesr').innerHTML += '<p>Move' + i + ': ' + playermove + '</p>'
                    }
                    if (pyColor[i] == 'blue') {
                        playername = (pyName[i] == 'Ti' ? 'Titan' : pyName[i] == 'Ta' ? 'Tank' : pyName[i] == 'C' ? 'Canon' : pyName[i] == 'SR' ? 'Semi-Ricochet' : pyName[i] == 'B' ? 'bullet' : 'Ricochets')
                        playerrotation = (pyRotation[i] == 'l' ? 'left' : 'right')
                        playermove = (pyMove[i] == 0 ? playername + ' moved from Plate ' + pyInitial[i] + ' to Plate ' + pyFinal[i] : pyMove[i] == 1 ? playername + ' rorates towards ' + playerrotation : pyMove[i] == -1 ? playername + ' kills red Ricochets' : '')
                        document.getElementById('movesb').innerHTML += '<p>Move' + i + ': ' + playermove + '</p>'
                    }
                }
            }

        }

    }
    startCounting()
}
















