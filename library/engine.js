let initialised=[];
let widgets={};

function addWidgetToSession(properties){
    console.log("adding widget with properties",properties)
    if(initialised.includes(properties.id)){
        console.warn("Initiating an already initiated widget ("+properties.id+").");
    } else {
        initialised.push(properties.id);
    };
    widgets[properties.id]=properties;
    getWidgetsConfig(content=>{
        console.log("widget config:",content)
        if(dimensions=content.find(a=>a.id==properties.id)){
            console.log("showing widget "+properties.id+" to desktop.")
            showWidgetToDocument(dimensions,properties);
        }
    })
}

return { addWidgetToSession }