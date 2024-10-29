function handleElemFooter(body){
    let container=document.createElement("div")
    let elem=document.createElement("div");
    let footer=document.createElement("div");
    container.style.width=elem.style.width=footer.style.width="100%";
    body.appendChild(container);
    container.appendChild(elem);
    container.appendChild(footer);
    container.style.height=elem.style.height="100%";
    container.style.display="flex";
    container.style.flexDirection="column";
    elem.style.overflow="auto";
    return {elem,footer};
}
function getSettingsFromElem(elem,widget){
    function getValueFromNode(type,node){
        switch(type){
            case "choose": return +node.querySelector("select").value.slice(3);
            default: throw new Error("Cannot get value from type "+type);
        }
    }
    return Object.fromEntries([...elem.children].map(a=>{
        let id=a.getAttribute("data_setting_id");
        let type=widget.settings[id].type;
        return [id,getValueFromNode(type,a)]
    }))
}
function makeConfigBody(body,widget){
    getWidgetsConfig(config=>{
        let {elem,footer} = handleElemFooter(body);
        // elem
        let settings=widget.settings;
        let values=config.find(a=>a.id===widget.id).settings;
        if(!values) throw new Error("Cannot find the widget ("+widget.id+") current settings. Remove the widget, put it back in, and try again.");
        Object.entries(settings).forEach(a=>{
            try{
                let settingContainer=document.createElement("div");
                settingContainer.setAttribute("data_setting_id",a[0]);
                settingContainer.innerText=`${a[1].title}: `
                elem.appendChild(settingContainer);
                switch(a[1].type){
                    case "choose":{
                        let {options} = a[1];
                        let currentOption = values[a[0]];
                        let selectElem=document.createElement("select");
                        for(let i=0;i<options.length;i++){
                            let chooseElem=document.createElement("option");
                            chooseElem.innerText=options[i];
                            chooseElem.setAttribute("value","opt"+i);
                            if(i==currentOption) chooseElem.setAttribute("selected","");
                            selectElem.appendChild(chooseElem);
                        };
                        selectElem.setAttribute("value","opt"+currentOption);
                        settingContainer.appendChild(selectElem);
                        break;
                    }
                    default:{
                        throw new Error("Unknown element "+a[1].type);
                    }
                }
            } catch (e){
                let errorElem=document.createElement("div");
                errorElem.style.backgroundColor="red";
                errorElem.style.color="white";
                errorElem.innerText=`An error has occured while trying to handle this element.\n${e.stack?e.stack:e}`;
                elem.appendChild(errorElem);
                console.error(e);
            }
        });
        // footer
        let applyBtn=document.createElement("button");
        applyBtn.innerText="Apply";
        applyBtn.addEventListener("click",e=>{
            let newSettings=getSettingsFromElem(elem,widget);
            saveSettings(widget.id,newSettings,(newConfig)=>{
                console.log("new config:",newConfig)
                reloadWidget(widget.id,newConfig);
            });
        })
        footer.appendChild(applyBtn);
    })
}
function showConfigWindow(widget){
    let win = new library.yoinkgui.GUIWindow({
        minimizable: false,
        maximizable: false,
        closable: true,
        title: `WidgetBox - "${widget.name}" Configuration`,
        icon: icons.settings
    });
    let winBody = win.element;
    makeConfigBody(winBody,widget);
}