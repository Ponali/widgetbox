let savemgr = this.ownSaveManager;
function getWidgetsConfig(callback){
    savemgr.exists("widgets",exists=>{
        if(exists){
            savemgr.get("widgets",(content,err)=>{
                if(err) throw err;
                callback(content);
            })
        } else {
            callback([]);
        }
    })
}
function saveDimensions(newDimensions){
    getWidgetsConfig(config=>{
        config=config.filter(a=>a.id!=newDimensions.id);
        config.push(newDimensions);
        savemgr.save("widgets",config,()=>{})
    })
}
function saveNewElement(id,dimensions){
    dimensions.id=id;
    getWidgetsConfig(config=>{
        config.push(dimensions);
        savemgr.save("widgets",config,()=>{})
    })
}
function removeWidgetFromConfig(id){
    getWidgetsConfig(config=>{
        config=config.filter(a=>a.id!=id);
        savemgr.save("widgets",config,()=>{})
    })
}
function saveSettings(id,newSettings,callback){
    getWidgetsConfig(config=>{
        let dimensions=config.find(a=>a.id===id);
        config=config.filter(a=>a.id!=id);
        dimensions.settings=newSettings;
        config.push(dimensions);
        savemgr.save("widgets",config,()=>{
            callback(config);
        })
    })
}