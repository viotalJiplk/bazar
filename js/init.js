testapi = localStorage.getItem("api");
if(testapi == "" | testapi == null){
    ajax("endpoints/","GET",callbackfunc);
}else{
    window.api = JSON.parse(testapi);
}

function callbackfunc(resText){
    localStorage.setItem("api", resText);
    window.api = JSON.parse(resText);
}