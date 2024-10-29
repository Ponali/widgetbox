library.widgetbox.addWidgetToSession({
    id:"wb_clock",
    name:"Clock (included)",
    defaultWidth:140,
    defaultHeight:43,
    fixedSize:true,
    handleElement:(element,settings)=>{
        let {rightTopElement, rightBottomElement, fontLeft, fontRight, dateFormat} = settings;
        function addFontStyles(){
            let style=document.createElement("style");
            /* 7-segment font */ style.innerHTML+="@font-face {\n\tfont-family: SegmentedFont;\n\tsrc: url(https://torinak.com/font/7segment.ttf) format(\'truetype\'),\n\t\turl(https://torinak.com/font/7segment.woff) format(\'woff\');\n}"
            element.appendChild(style);
        };
        addFontStyles();
        console.log("booting clock with settings:",settings);
        let mainElem=document.createElement("h1");
        mainElem.style.padding="0";
        mainElem.style.margin="0";
        mainElem.style.textAlign="center";
        mainElem.style.color="black";
        mainElem.style.fontWeight="normal";
        mainElem.style.textShadow="2px 2px 2px #888";
        let textElem=document.createElement("span");
        textElem.style.fontSize="24px";
        let subElem=document.createElement("span");
        subElem.style.fontSize="8px";
        subElem.style.display="inline-block";
        subElem.style.textAlign="left";
        element.appendChild(mainElem);
        mainElem.appendChild(textElem);
        mainElem.appendChild(subElem);
        function handleElementFont(elem,idx){
            switch(idx){
                case 0:break;
                case 1:elem.style.fontFamily="SegmentedFont, sans-serif";elem.style.zoom="1.5";elem.style.position="relative";elem.style.top="0.1em";break;
            }
        }
        handleElementFont(textElem,fontLeft);
        handleElementFont(subElem,fontRight);
        function numPad(num){
            return (""+num).padStart(2,"0");
        }
        function makeDate(date){
            function day(){return date.getDate()};
            function month(){return date.getMonth()+1};
            function year(){return date.getFullYear()};
            function makeArray(){
                // ["dd/mm","mm/dd","dd/mm/yy","yy/mm/dd","dd/mm/yyyy","yyyy/mm/dd"]
                switch(dateFormat){
                    case 0:return [day(),month()];
                    case 1:return [month(),day()];
                    case 2:return [day(),month(),year()%100];
                    case 3:return [year()%100,month(),day()];
                    case 4:return [day(),month(),year()];
                    case 5:return [year(),month(),day()];
                }
            };
            return makeArray().map(numPad).join("/");
        }
        function subElemPartTxt(idx,date){
            let twelveHourMark=["AM","PM"];
            let dayOfWeek=["SUN","MON","TUE","WED","THU","FRI","SAT"]
            // wow javascript thank you so much for FUCKING UP WITH THE DAY OF WEEK SYSTEM
            // NO SERIOUSLY WHO THE FUCK THINKS 0 BEING SUNDAY IS A GOOD IDEA
            switch(idx){
                case 0:return "";
                case 1:return numPad(date.getSeconds());
                case 2:return dayOfWeek[date.getDay()];
                case 3:return twelveHourMark[Math.floor(date.getHours()/12)];
                case 4:return makeDate(date);
                case 5:return date.getFullYear();
            }
        }
        function subElemTxt(date){
            /*switch(rightElement){
                case 0:case 1:return "";
                case 2:return numPad(date.getSeconds())+"\n"+twelveHourMark[Math.floor(date.getHours()/12)];
                case 3:return numPad(date.getSeconds())+"\n"+dayOfWeek[date.getDay()]
                case 4:return dayOfWeek[date.getDay()];
                case 5:return dayOfWeek[date.getDay()]+"\n"+twelveHourMark[Math.floor(date.getHours()/12)];
                case 6:return twelveHourMark[Math.floor(date.getHours()/12)];
            }*/
            return subElemPartTxt(rightTopElement,date)+"\n"+subElemPartTxt(rightBottomElement,date);
        }
        function updateClock(){
            let hourLimit=24;
            if([rightTopElement,rightBottomElement].includes(3)) hourLimit=12;
            let date=new Date();
            let showSeconds=false;
            if(rightTopElement==0&&rightBottomElement==1) showSeconds=true;
            if(rightTopElement==1&&rightBottomElement==0) showSeconds=true;
            let clockMain=[date.getHours()%hourLimit,date.getMinutes(),date.getSeconds()].slice(0,2+showSeconds).map(numPad).join(":")
            textElem.innerText=clockMain;
            if(showSeconds){
                subElem.innerText="";
            } else {
                subElem.innerText=subElemTxt(date);
            }
        }
        updateClock();
        let clockUpdateInterval = setInterval(updateClock,1000);

        var x = new MutationObserver(function (e) {
            if (e[0].removedNodes) clearInterval(clockUpdateInterval);
        });
          
        x.observe(element, { childList: true });
    },
    settings:{
        "rightTopElement":{
            "title":"Right-side top element",
            "type":"choose",
            "options":["None","Seconds","Day of week","12-hour mark","Date","Year"],
            "default":1
        },
        "rightBottomElement":{
            "title":"Right-side bottom element",
            "type":"choose",
            "options":["None","Seconds","Day of week","12-hour mark","Date","Year"],
            "default":2
        },
        "dateFormat":{
            "title":"Date format",
            "type":"choose",
            "options":["dd/mm","mm/dd","dd/mm/yy","yy/mm/dd","dd/mm/yyyy","yyyy/mm/dd"],
            "default":0
        },
        "fontLeft":{
            "title":"Left-side font",
            "type":"choose",
            "options":["System Default","7-Segment (torinak.com)"],
            "default":1
        },
        "fontRight":{
            "title":"Right-side font",
            "type":"choose",
            "options":["System Default","7-Segment (torinak.com)"],
            "default":0
        }
    }
})