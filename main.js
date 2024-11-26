
function main(){
    let ftr = makeFooter();
    let nav = makeNav();
    document.querySelector("#footer").innerHTML = ftr;
    document.querySelector("#navigationbar").innerHTML = nav;

    let s = document.querySelector(".sighting");

    s.addEventListener('click', advice);

}
function advice(e){
    let advice = {
        colorbear:"Yay! Now that you saw one you're bound to see more!",
        oo:"Yay! Next time you see one and they bounce away try asking if you can bounce with them!",
        cb:"Amazing! Next time you see one look around a corner try doing the same thing and making them laugh!",
        ccu:"Yay! Tell them you know James next time and see what happens.",
        esl:"Yay! Next time ask you might ask if they need a lift to their campground and see what happens.",
        kc:"Yay! Bring them some leaves next time and you might save our world! Caterpillars eat leaves.",
        sp:"Yay! Did you hear them or see them? Visual sightings are very rare.",
        wf:"Yay! Next time use the code, 'Sweet Ride' and the holder will try to get you some candy!",
    }
    let url = e.srcElement.baseURI;
    let file = url.split('/').pop().split('.').shift();
    if (advice[file]== undefined){
        console.log("must be colorbear page");
        file = 'colorbear';
    }
    alert(advice[file]);
    return;
}
function makeNav(){
    let nav = `<ul class = "nav">
            <li><a href="/index.html" class="nav-link">Color Bears</a></li>
            <li><a href="/entities/cb.html" class="nav-link">Caution Bears</a></li>
            <li><a href="/entities/oo.html" class="nav-link">Oscillating Ocelots</a></li>
            <li><a href="/entities/wf.html" class="nav-link">Whisky Fish</a></li>
            <li><a href="/entities/kc.html" class="nav-link">Kali the Caterpillar</a></li>
            <li><a href="/entities/sp.html" class="nav-link">Sneezy Panda</a></li>
            <li><a href="/entities/esl.html" class="nav-link">Emotional Support Lobster</a></li>
            <li><a href="/entities/ccu.html" class="nav-link">Complex The Complicated Unicorn</a></li>
        </ul>`;

    return nav;
}
function makeFooter(){
    let ftr = `<div class = "centered section"><button class = "btn btn-info sighting">I saw one!</button></div>
    <div class = "footer"><h2><u>See Also</u></h2>
                <ul>
                    <li>Confirmed Species</li>
                        <ul>
                            <li><a href="/index.html">Color Bears</a></li>
                            <li><a href="/entities/cb.html">Caution Bears</a></li>
                            <li><a href="/entities/oo.html">Oscillating Ocelots</a></li>
                            <li><a href="/entities/wf.html">Whisky Fish</a></li>
                        </ul>
                    <li>Only 1 Known Individual</li>
                        <ul>
                            <li><a href="/entities/kc.html">Kali the Caterpillar</a></li>
                            <li><a href="/entities/sp.html">Sneezy Panda</a></li>
                            <li><a href="/entities/esl.html">Emotional Support Lobster</a></li>
                            <li><a href="/entities/ccu.html">Complex The Complicated Unicorn</a></li>
                        </ul>
                </ul></div>`;

        return ftr;
}
document.addEventListener('DOMContentLoaded',main());
