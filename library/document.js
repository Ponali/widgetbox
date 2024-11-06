// getting desktop element and version
let desktopElem,isV3;
if(desktopElem=document.querySelector("main#desktop.desktop")){
    isV3=true;
} else if (desktopElem=document.querySelector("section#s42_desktop")){
    isV3=false;
} else {
    throw new Error("Cannot find a desktop element. Please make sure this is ran on a valid version of Windows93 V2 or V3.")
};

function isDesktopReady(){
    return !document.querySelector("div#s42_splashscreen");
}

function getContainer(){
    return desktopElem.querySelector("div#widgetbox-container")
}

function addWidgetBoxElement(){
    if(!getContainer()){
        console.log("making element!")
        let elem=document.createElement("div");
        elem.setAttribute("id","widgetbox-container");
        desktopElem.appendChild(elem);
        elem.style.width="100%";
        elem.style.height="100%";
        setElemPosition(elem,0,0,0,0);
        elem.style.margin="0";
        elem.style.padding="0";
        elem.style.pointerEvents="none";
        elem.style.position="absolute";
        elem.innerHTML='<style>div#widgetbox-container *{pointer-events:all !important;}</style>';
        /*elem.addEventListener("click",e=>{
            e.stopPropagation();
        })*/
    } else {
        console.log("element already made");
    }
}

function waitForDesktopReady(){
    return new Promise(resolve=>{
        let checkInterval = setInterval(()=>{
            if(isDesktopReady()){
                addWidgetBoxElement();
                resolve();
                clearInterval(checkInterval)
            } else {
                console.log("still not ready");
            }
        },10);
    })
}

function getContainerDimensions(){
    let domrect=getContainer().getBoundingClientRect();
    let {width,height} = domrect;
    return [width,height];
}

function getRelativePosition(x,y){
    let [mainWidth,mainHeight] = getContainerDimensions();
    let halfWidth=mainWidth/2;
    let halfHeight=mainHeight/2;
    if(x>halfWidth)  x=(x-halfWidth )-halfWidth;
    if(y>halfHeight) y=(y-halfHeight)-halfHeight;
    if(x<-halfWidth) x=(x+halfWidth )+halfWidth;
    if(y<-halfHeight)y=(y+halfHeight)+halfHeight;
    return [x,y];
}

function setElemPosition(element,x,y,width,height){
    console.log(x,y);
    [x,y]=getRelativePosition(x,y);
    console.log(x,y);
    if(x>=0){
        element.style.left=x+"px";
        element.style.right="";
    } else {
        element.style.left="";
        element.style.right=(-x-width)+"px";
    }
    if(y>=0){
        element.style.top=y+"px";
        element.style.bottom="";
    } else {
        element.style.top="";
        element.style.bottom=(-y-height)+"px";
    }
}

function showWidgetToDocument(dimensions,widgetData){
    waitForDesktopReady().then(()=>{
        if(widgetData.fixedSize||(!dimensions.width))  dimensions.width =widgetData.defaultWidth;
        if(widgetData.fixedSize||(!dimensions.height)) dimensions.height=widgetData.defaultHeight;

        let widgetElement=document.createElement("div");
        widgetElement.id="wb_widget_"+widgetData.id;

        widgetElement.setAttribute("tabindex","0") // allows element to have key inputs
        setElemPosition(widgetElement,dimensions.x,dimensions.y,dimensions.width,dimensions.height);
        widgetElement.style.width=dimensions.width+"px";
        widgetElement.style.height=dimensions.height+"px";
        widgetElement.style.position="absolute";
        widgetElement.style.background="silver";
        widgetElement.style.boxShadow="inset 1px 1px #dfdfdf, 1px 0 #000, 0 1px #000, 1px 1px #000";
        widgetElement.style.zIndex="1000"; // why do z-indexes always have to be so arbitrary...?
        widgetData.handleElement(widgetElement,dimensions.settings);
        getContainer().appendChild(widgetElement);

        function isDragElement(elem){
            return elem==widgetElement||(widgetElement.contains(elem)&&(!["A","BUTTON","INPUT","TEXTAREA"].includes(elem.tagName)))
        }

        function removeThisWidget(){
            widgetElement.remove();
            removeWidgetFromConfig(widgetData.id);
        }

        let dragging=false,dragPos=[];
        document.addEventListener("mousedown",e=>{
            if(isDragElement(e.target)){
                //console.log("started dragging!")
                dragging=true;
                dragPos=[e.clientX,e.clientY,dimensions.x,dimensions.y];
                // remove sidebar so that it doesnt look shit
                removeBtn.remove();
                configBtn.remove();
            } else {
                //console.log("dragging on wrong element");
            }
        })
        document.addEventListener("mouseup",e=>{
            if(dragging){
                //console.log("stopped dragging!")
                dragging=false;

                let oldDimensions=[dimensions.x,dimensions.y];

                let diffX=e.clientX-dragPos[0];
                let diffY=e.clientY-dragPos[1];
                [dimensions.x,dimensions.y]=getRelativePosition(dragPos[2]+diffX,dragPos[3]+diffY);

                if(oldDimensions[0]!=dimensions.x||oldDimensions[1]!=dimensions.y) saveDimensions(dimensions);
                // if still in widget, put back sidebar
                let elem=e.target;
                if(elem==widgetElement||widgetElement.contains(elem)){
                    addWidgetSidebar();
                }
            }
        })
        document.addEventListener("mousemove",e=>{
            if(dragging){
                let diffX=e.clientX-dragPos[0];
                let diffY=e.clientY-dragPos[1];
                setElemPosition(widgetElement,dragPos[2]+diffX,dragPos[3]+diffY,dimensions.width,dimensions.height)
                //console.log("dragging")
            } else {
                //console.log("moving but not dragging")
            }
        })

        widgetElement.addEventListener("keydown",e=>{
            let key = e.key;
            if(key=="Delete"||key=="Backspace"){
                removeThisWidget();
            }
        })

        let removeBtn,configBtn;
        function addWidgetSidebar(){
            if(dragging) return;
            function makeWidgetPopupButton(icon,yOffset){
                let elem=document.createElement("button");
                elem.innerHTML=`<img src="${icon}"></img>`;
                elem.style.position="absolute";
                setElemPosition(elem,dimensions.x-26,dimensions.y+yOffset,26,21) // if the dimensions are from the widget it will fuck up
                elem.style.width=16;
                elem.style.height=16;
                elem.style.padding="1px 4px";
                elem.style.zIndex="1001";
                elem.addEventListener("mouseleave",handleMouseLeave)
                getContainer().appendChild(elem);
                return elem;
            }
            removeBtn=makeWidgetPopupButton(icons.remove,0);
            removeBtn.addEventListener("click",e=>{
                removeBtn.remove();
                configBtn.remove();
                removeThisWidget();
            })
            configBtn=makeWidgetPopupButton(icons.settings,21);
            configBtn.addEventListener("click",e=>{
                showConfigWindow(widgetData);
            })
            // add config event listener!!
        }

        widgetElement.addEventListener("mouseenter",addWidgetSidebar);

        function handleMouseLeave(e){
            if(![removeBtn,configBtn].includes(e.toElement)){
                removeBtn.remove();
                configBtn.remove();
            }
        }
        widgetElement.addEventListener("mouseleave",handleMouseLeave)
    })
}
function reloadWidget(id,config){
    let widgetElement=document.querySelector("div#wb_widget_"+id);
    widgetElement.remove();
    let dimensions=config.find(a=>a.id===id);
    showWidgetToDocument(dimensions,widgets[id]);
}
function removeWidgetFromDocument(id){
    let widgetElement=document.querySelector("div#wb_widget_"+id);
    widgetElement.remove();
    removeWidgetFromConfig(id);
}
function widgetInDocument(id){
    return document.querySelector("div#wb_widget_"+id);
}