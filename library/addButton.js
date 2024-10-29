function makeDefaultSettings(id){
    let settingsConfig=widgets[id].settings;
    let settings={};
    for(let i in settingsConfig){
        let elem=settingsConfig[i];
        settings[i]=elem.default;
    };
    return settings;
}

function makeAvailableDimensions(id){
    let {defaultWidth, defaultHeight} = widgets[id];
    let settings=makeDefaultSettings(id);
    return {x:0,y:0,width:defaultWidth,height:defaultHeight,settings};
}

function addElement(id){
    let dimensions=makeAvailableDimensions(id);
    showWidgetToDocument(dimensions,widgets[id]);
    saveNewElement(id,dimensions);
}
function toggleAddRemove(id){
    if(widgetInDocument(id)){
        removeWidgetFromDocument(id);
    } else {
        addElement(id);
    }
}
function makeAdderElement(exit){
    let elem=document.createElement("div");
    Object.values(widgets).forEach(props=>{
        let btn=document.createElement("button");
        btn.innerText=props.name;
        btn.addEventListener("click",()=>{
            exit();
            toggleAddRemove(props.id);
        })
        elem.appendChild(btn);
    });
    return elem;
}
function getContainer(){
    return desktopElem.querySelector("div#widgetbox-container");
}
function showAddButton(){
    let button;
    function init(){
        button.innerText="+";
        button.classList.remove("unstyled");
        button.style.display="";
        button.style.position="absolute";
        button.style.right="4px";
        button.style.bottom="4px";
    }
    waitForDesktopReady().then(()=>{
        button=document.createElement("button");
        init();
        button.addEventListener("click",e=>{
            if(e.target===button){
                button.style.display="none";
                let elem=makeAdderElement(()=>{
                    init();
                    elem.remove();
                });
                elem.style.position="absolute";
                elem.style.right="4px";
                elem.style.bottom="4px";
                getContainer().appendChild(elem)
            }
        })
        getContainer().appendChild(button);
    })
}
showAddButton();