function cuttext(){
    var size = 600
    var posts = document.getElementsByClassName("article_text")
    for (var i = 0; i < posts.length; i++){
        var text = posts[i].textContent;
        if (text.length > size){
            posts[i].textContent = text.slice(0, size) + " ..."
        }
    }
}

function addaption(){
    if (screen.width <= 1024 && screen.height <= 1366){
        var article = document.getElementsByTagName("div")
        var imgs = document.getElementsByTagName("img")
        var nav = document.getElementById("menu")

        nav.classList = "adaptionmenu"
        nav.innerHTML = `<ul class="mainul" id="mainul">
                            <div class="logo">
                                <a href="/">
                                    <h1><span class="adaptionprog">Prog</span><span class="adaptionway">Way</span></h1>
                                </a>   
                            </div>
                            <ul class="topmenu">
                                <li onclick="mobilemenu()"><img src="/img/shortmenu.png"/></li>
                            </ul>
                        </ul>`

        for (var g = 0; g < imgs.length; g++){
            if (imgs[g].classList == "imghorarticle"){
                imgs[g].classList = "imgarticle"
            }
        }

        for (var i = 0; i < article.length; i++){
            if (article[i].classList == "main"){
                article[i].classList = "adaptionmain"
            } else if (article[i].classList == "horarticle"){
                article[i].classList = "article"
            } else if (article[i].classList == "texthorarticle"){
                article[i].classList = "textarticle"
            } else if (article[i].classList == "onearticle"){
                article[i].classList = "adaptiononearticle"
            } else if (article[i].classList == "downloader"){
                article[i].classList = "adaptiondownloader"
            }
        }
    } 
}

function mobilemenu(){
    var mainul = document.getElementById("mainul");

    mainul.innerHTML = `<li class="adaptionamenu"><a href="/soft"><h3>Софт</h3></a></li>
                        <li class="adaptionamenu"><a href="/quizs"><h3>Задачи</h3></a></li>
                        <li class="adaptionamenu"><a href="/posts"><h3>Задачи</h3></a></li>
                        <li class="adaptionamenu"><a href="https://t.me/TheProgWay"><img src="/img/adapttg.png" alt=""></a></li>
                        <li class="adaptionamenu"><a href="https://github.com/ProgWay12"><img src="/img/adaptgithub.png" alt=""></a></li>
                        <li class="adaptionamenu btnback" onclick="backtologomenu()"><img src="/img/back.png" /></li>`
}

function backtologomenu(){
    var mainul = document.getElementById("mainul");

    mainul.innerHTML = `<div class="logo">
                            <a href="/">
                                <h1><span class="adaptionprog">Prog</span><span class="adaptionway">Way</span></h1>
                            </a>   
                        </div>
                        <ul class="topmenu">
                            <li onclick="mobilemenu()"><img src="/img/shortmenu.png"/></li>
                        </ul>`
}

function codeinarticle(){
    var paragraphs = document.getElementsByClassName("text");

    for (var i = 0; i < paragraphs.length; i++){
        var paragraph = paragraphs[i].textContent.trim()

        if (paragraph[0] != "#"){
            var indiv = paragraph
            paragraphs[i].innerHTML = `<p>${indiv}</p>`
        } else if (paragraph[0] == "#"){
            var indivold = paragraph.substr(1, paragraph.length - 2)
            var arr = indivold.split("|")
            var res = ``;
            for (var g = 0; g < arr.length; g++){
                res = res + `<p>${arr[g]}</p>`
            }
            paragraphs[i].innerHTML = res;
            paragraphs[i].className = "code";
        }
    }
}
var timerover;
var timerout;
function animation(id, where) {
    var hr = document.getElementById(id)
    if (where == "over"){
        clearInterval(timerout)
        timerover = setInterval(morewidth, 20);

        function morewidth(){
            var classnow = hr.className
            if (classnow == "step0"){
                hr.className = "step1"
            } else if (classnow == "step1"){
                hr.className = "step2"
            } else if (classnow == "step2"){
                hr.className = "step3"
            } else if (classnow == "step3"){
                hr.className = "step4"
            } else if (classnow == "step4"){
                hr.className = "step5"
            } else if (classnow == "step5"){
                hr.className = "step6"
            } else if (classnow == "step6"){
                hr.className = "step7"
            } else if (classnow == "step7"){
                hr.className = "step8"
            } else if (classnow == "step8"){
                hr.className = "step9"
            } else if (classnow == "step9"){
                hr.className = "step10"
                clearInterval(timerover)
            }
        }
    } else if (where == "out") {
        clearInterval(timerover)
        timerout = setInterval(lesswidth, 20);

        function lesswidth(){
            var classnow = hr.className
            if (classnow == "step10"){
                hr.className = "step9"
            } else if (classnow == "step9"){
                hr.className = "step8"
            } else if (classnow == "step8"){
                hr.className = "step7"
            } else if (classnow == "step7"){
                hr.className = "step6"
            } else if (classnow == "step6"){
                hr.className = "step5"
            } else if (classnow == "step5"){
                hr.className = "step4"
            } else if (classnow == "step4"){
                hr.className = "step3"
            } else if (classnow == "step3"){
                hr.className = "step2"
            } else if (classnow == "step2"){
                hr.className = "step1"
            } else if (classnow == "step1"){
                hr.className = "step0"
                clearInterval(timerout)
            }
        }
    } 
}

