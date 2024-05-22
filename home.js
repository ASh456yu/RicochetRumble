window.onload = function () {
    console.log('Window Loaded');
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
            location.replace('./file.html')
        })
    });

}