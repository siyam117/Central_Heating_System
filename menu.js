const dropZone = document.querySelector("#drop-area")

$(function(){
    
const roomCounterDiv = document.getElementById("room-counter")
const heaterCounterDiv = document.getElementById("heater-counter")
const myElement = document.getElementById('drop-area');
const startButton = document.getElementById("start-button")

startButton.addEventListener('click', function(){
    document.getElementById("starting-page").style.display = 'none'
})


//normal variables
let zIndexCount = 100 
var roomCounter = 0
var heaterCounter = 0
var smallHeaterCounter = 0
var largeHeaterCounter = 0
var floorPlanTotalArea = 0
var currentId = ""
var canvas = $("#drop-area")

//object variables
let heatOutputOBJECT = {
        "small-heater": 50000,
        "large-heater": 120000
    }
let roomSizeOBJECT = {}
let renderOnCanvasOBJECT = {}
let roomsInTotalFloorPlanOBJECT = {}
let heatersInTotalFloorPlan = []

//list variables
var elementsAlreadyDropped = []
var diagram = [];
var pipelines = [];
var mousePos = [0,0];
var roomsDroppedList = []

//boolean variables
var renderOnCanvas = true
var pipeAdding = false;
var thermostatPlaced = false;
var heaterOpen = false;
var confirmFloorPlanPressed = false
var confirmHeatPlanPressed = false


var querySelectList = [document.getElementById('small-heater')]


var confirmButton = document.getElementById("confirm-button").addEventListener('click',function(){
    if(this.innerHTML === "confirm heat plan"){
        this.style.display = 'none'
        confirmHeatPlanPressed = true
    }else{
        confirmFloorPlanPressed = true
        this.innerHTML = "confirm heat plan"

    }

})


roomCounterDiv.innerHTML = roomCounter
heaterCounterDiv.innerHTML = heaterCounter





// elements for heater output values
var sliderEl = document.getElementById("heaterOutputValue")
var sliderOutputEl = document.getElementById("heaterOutput")
var heaterOutputDiv = document.getElementById("setHeaterOutput")
sliderEl.onchange, sliderEl.oninput = () => {
    sliderOutputEl.innerHTML = sliderEl.value
}
document.getElementById("closeHeaterDiv").onclick = () => {
    heatOutputOBJECT[heaterOpen] = +sliderEl.value
    heaterOpen = false
    heaterOutputDiv.style.display = "none"
}


document.getElementById('close-final-output').onclick =() =>{
    document.getElementById('final-output').style.display = 'none'
}












// canvas for drawing pipelines
var pipeCanvas = $("#pipe-canvas")[0]
pipeCanvas.width = 1000
pipeCanvas.height = 600
var ctx = pipeCanvas.getContext('2d')


//when the sub button is clicked, it toggles a dropdown on the menu
$('.sub-btn').click(function(){
    $('.sub-menu:visible').add($(this).find('.sub-menu:first')).slideToggle();
    $(this).next('.sub-menu').slideToggle();
    $(this).find('.dropdown').toggleClass('rotate');
})
//every div in class "room" is draggable
const item = $("div","#sub-menu").draggable({
    
    zIndex: zIndexCount,
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",

});

//every img in class "heater" is draggable
$("img","#heater").draggable({
    zIndex: 1000,
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",

});

const boiler = $("div","#boiler").draggable({
    zIndex: zIndexCount,
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",

});


canvas.droppable({
    //on drop of a room, it creates a node with ID and current Position
    drop: function(event,ui){
        zIndexCount +=1
        
        var node = {
            _id: (new Date).getTime(),   //give them random ID so that when running a for loop you can pick unique elements from list
            position: ui.helper.position(),
            
        };

        //subtracts from position left, the current left value of the drop on canvas so that it drop in the same spot as the mouse
        node.position.left -= canvas.position().left;

        if(ui.helper.hasClass("main-room")){
            renderOnCanvasOBJECT[node._id] = true
            renderItemOnCanvas('room')
            node.type = "MAIN-ROOM"
            roomSizeOBJECT[node._id] = 59049
            roomsInTotalFloorPlanOBJECT[node._id] = 59049
            node.width = 250
            node.height = 250
            roomCounter +=1
            roomCounterDiv.innerHTML = roomCounter
            
            
        }else if(ui.helper.hasClass("kitchen")){
            renderOnCanvasOBJECT[node._id] = true
            renderItemOnCanvas('room')
            node.type = "KITCHEN"
            roomSizeOBJECT[node._id] = 40000
            roomsInTotalFloorPlanOBJECT[node._id] = 40000
            node.width = 200
            node.height = 200
            roomCounter +=1
            roomCounterDiv.innerHTML = roomCounter
            
         
        }else if(ui.helper.hasClass("bathroom")){
            renderOnCanvasOBJECT[node._id] = true
            renderItemOnCanvas('room')
            node.type = "BATHROOM"
            roomSizeOBJECT[node._id] = 20000
            roomsInTotalFloorPlanOBJECT[node._id] = 20000
            node.width = 100
            node.height = 200
            roomCounter +=1
            roomCounterDiv.innerHTML = roomCounter

        }else if(ui.helper.hasClass("living-room")){
            renderOnCanvasOBJECT[node._id] = true
            renderItemOnCanvas('room')
            node.type = "LIVING-ROOM"
            roomSizeOBJECT[node._id] = 120000
            roomsInTotalFloorPlanOBJECT[node._id] = 120000
            node.width = 400
            node.height = 300
            roomCounter +=1
            roomCounterDiv.innerHTML = roomCounter
            
            
        }else if(ui.helper.hasClass("small-heater")) {
            renderItemOnCanvas('heater')
            if(renderOnCanvas){
                
                renderHeaterOnCanvas(node,currentId,"small-heater")
                smallHeaterCounter +=1
            }
            
            node.width = 100
            node.height = 32
            heaterCounter +=1
            
            heaterCounterDiv.innerHTML = heaterCounter

        }else if(ui.helper.hasClass("large-heater")) {
            renderItemOnCanvas('heater')
            if(renderOnCanvas){
                renderHeaterOnCanvas(node,currentId,"large-heater")
                largeHeaterCounter+=1
            }
            node.width = 150
            node.height = 50
            heaterCounter +=1
            
            heaterCounterDiv.innerHTML = heaterCounter

        }else if(ui.helper.hasClass("chs")){
                renderItemOnCanvas('chs')
                node.type = "CHS"
                node.width = 50
                node.height = 100

        }else if(ui.helper.hasClass("thermostat")){
                renderOnCanvasOBJECT[node._id] = true
                node.type = "thermostat"
                node.width = 80
                node.height = 80
                thermostatPlaced = true //allow to edit heater outputs
        }else{
            return;
        }

        //diagram is rendered onto the canvas
        if(renderOnCanvas){
            diagram.push(node)                  //pushes the node into a list called "Diagram"
            if(node.type == "CHS") { // create pipeline and start drawing for it
                pipelines.push(new Pipe(node.position.left+node.width/2, node.position.top+node.height/2,"red",node.position.left,node.position.top,node.width,node.height))
                pipeAdding = true
            }
            renderDiagram(diagram) 
            
        }
        renderOnCanvas = true       
    }
})

//<----------------------------------------------Rendering the item onto the Canvas -------------------------------------------------------->

function renderDiagram(diagram){
    canvas.empty();                                 //empties the canvas before rendering everything in the diagram array 
    // render rooms/heaters
    for(var d in diagram){
        var node = diagram[d];
        var html = "";
        var globalRoomSize = "  "

//<---------------------------------------------------------MAIN-ROOM------------------------------------------------------------------->
        if(node.type === "MAIN-ROOM"){                    
            const element = document.createElement("div")
            element.className = "main-room"
            html = "<div>Bedroom</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                //"background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                snap: true,
                snapTolerance: 30,
                stop: function(event,ui){
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left
                            
                        }
                    }
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area",                                   //i.e. make it so that it doesnt move when another room is dropped after resized
                minWidth: 100,
                minHeight: 100,
                stop: function(event,ui){
                    
                    
                    var id = ui.helper.attr("id")
                    
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                            
                        
                        }
                        
                    }
                    node.width = ui.size.width
                    node.height = ui.size.height

                    const roomSize = calculateRoomSize(node.width,node.height)
                    roomSizeOBJECT[$(this).attr('id')] = roomSize
                    roomsInTotalFloorPlanOBJECT[$(this).attr('id')] = roomSize

                   
                    

                    
                }
            }).droppable({
                
                over: function (event, ui) { 
                    currentId = $(this).attr('id')
                },
                drop: function(event,ui){   
                    if(confirmFloorPlanPressed){
                        console.log("heater added")
                        draggedItem = ui.draggable
                        dropHeaterPossible(ui.draggable.attr('id'),$(this).attr('id'))

                    }
                   

                    // const roomSize = calculateRoomSize(parseInt(this.style.width.replace("px","")),parseInt(this.style.height.replace("px","")))
                    // if(checkCapacity(draggedItem.draggable("option","heat"), roomSize)){
 
                },    
            })
           canvas.append(dom)
            roomsDroppedList.push(dom)

            //trying to disable the draggable element of rooms 
            //so far the ui.draggable.attr('id),node._id,dom all dont work when disabling the draggable
           
//<---------------------------------------------------------Kitchen------------------------------------------------------------------->            
        
        }else if(node.type === "KITCHEN"){                    
            const element = document.createElement("div")
            element.className = "kitchen"
            html = "<div>Kitchen</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                //"background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                snap: true,
                snapTolerance: 30,
                stop: function(event,ui){
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left
                            
                        }
                    }
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area",                                   //i.e. make it so that it doesnt move when another room is dropped after resized
                minWidth: 100,
                minHeight: 100,
                stop: function(event,ui){
                    
                    
                    var id = ui.helper.attr("id")
                    
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                            
                        
                        }
                        
                    }
                    node.width = ui.size.width
                    node.height = ui.size.height

                    const roomSize = calculateRoomSize(node.width,node.height)
                    roomSizeOBJECT[$(this).attr('id')] = roomSize
                    roomsInTotalFloorPlanOBJECT[$(this).attr('id')] = roomSize
                    
                    
                }
            }).droppable({
                
                over: function (event, ui) { 
                    currentId = $(this).attr('id')
                },
                drop: function(event,ui){   
                    if(confirmFloorPlanPressed){
                        draggedItem = ui.draggable
                        dropHeaterPossible(ui.draggable.attr('id'),$(this).attr('id'))

                    }
                   

                    // const roomSize = calculateRoomSize(parseInt(this.style.width.replace("px","")),parseInt(this.style.height.replace("px","")))
                    // if(checkCapacity(draggedItem.draggable("option","heat"), roomSize)){
 
                },    
            })
           canvas.append(dom)

        }else if(node.type === "CHS"){                    
            const element = document.createElement("div")
            element.className = "main-room"
            html = "<div>Boiler</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                "background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left,
                "border" : "5px double red"
            }).attr("id",node._id)

            
            canvas.append(dom)

//<------------------------------------------------------THERMOSTAT----------------------------------------------------------------------->
        }else if(node.type === "thermostat"){                    
            const element = document.createElement("div")
            element.className = "thermostat"
            html = "<div>Thermostat</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                //"background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left,
                "border" : "5px double darkcyan"
            }).draggable({
                snap: true,
                snapTolerance: 30,
                stop: function(event,ui){
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left
                            
                        }
                    }
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id)

            canvas.append(dom)
//<------------------------------------------------------BATHROOM----------------------------------------------------------------------->
        }else if(node.type === "BATHROOM"){
            html = "<div>Bath</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                //"background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                
                snap: true,
                snapTolerance: 30,
                stop: function(event,ui){
                    
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left
                        }
                    }
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id).resizable({                              
                containment: "#drop-area",
                minWidth: 50,
                minHeight: 70, 
                maxWidth: 200,
                maxHeight:300,                                  
                stop: function(event,ui){
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                        
                        }
                        
                    }

                    node.width = ui.size.width
                    node.height = ui.size.height                   
                    const roomSize = calculateRoomSize(node.width,node.height)
                    roomSizeOBJECT[$(this).attr('id')] = roomSize
                    roomsInTotalFloorPlanOBJECT[$(this).attr('id')] = roomSize
                    
                }
            }).droppable({
                over: function (event, ui) { 
                    currentId = $(this).attr('id')
                },
                drop: function(event,ui){
                   
                    if(confirmFloorPlanPressed){
                        draggedItem = ui.draggable
                        dropHeaterPossible(ui.draggable.attr('id'),$(this).attr('id'))

                    }


                    // const roomSize = calculateRoomSize(parseInt(this.style.width.replace("px","")),parseInt(this.style.height.replace("px","")))
                    // if(checkCapacity(draggedItem.draggable("option","heat"), roomSize)){
                    

 
                },    
            })
           
            canvas.append(dom)
//<------------------------------------------------------LIVING-ROOM------------------------------------------------------------------>
        }else if(node.type === "LIVING-ROOM"){
            html = "<div>living-room</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": node.width,
                "height": node.height,
                "border": "4px double black",
                //"background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                stop: function(event,ui){
                   
                    var id = ui.helper.attr("id")
                    //currentId = $(this).attr('id')
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left 
                        }
                    }

                    
                    

                
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area", 
                minWidth: 150,
                minHeight: 150,                                  //i.e. make it so that it doesnt move when another room is dropped after resized
                stop: function(event,ui){
                  
                    
                    
                    var id = ui.helper.attr("id")
                    
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                        
                        }
                        
                    }
                       
                    
                    node.width = ui.size.width
                    node.height = ui.size.height
                    
                    
                    const roomSize = calculateRoomSize(node.width,node.height)
                    roomSizeOBJECT[$(this).attr('id')] = roomSize
                    roomsInTotalFloorPlanOBJECT[$(this).attr('id')] = roomSize
                    
                    

                    
                    
                    // this.setAttribute("roomSize", roomSize);
                    
                }
            
            }).droppable({
                over: function (event, ui) { 
                    currentId = $(this).attr('id')
                },
                drop: function(event,ui){
                    if(confirmFloorPlanPressed){
                        draggedItem = ui.draggable
                        dropHeaterPossible(ui.draggable.attr('id'),$(this).attr('id'))

                    }

 
                },    
            
            })
            
            canvas.append(dom)
            

            
//<---------------------------------------------heater functionalities ---------------------------------------------------------------->
        }else if(node.type === "SMALL-HEATER"){
            const img = document.createElement("img")
            img.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                
                if(!node.rotation) node.rotation = 0
                node.rotation += 90
                if(node.rotation >= 360) node.rotation -= 360
                this.style.transform = "rotate("+node.rotation+"deg)"

                return false;
            }, false);
            img.src = "media/bg-remove1.png"
            var dom = $(img).css({
                "width": node.width,
                "height": node.height,
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left,
                "display": "block",
                "transform": "rotate("+node.rotation+"deg)",
                "cursor": "pointer"
            }).draggable({
                stop: function(event,ui){
                    
                    var id = ui.helper.attr("id")
                    
                    for(var i in diagram){
                        
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left  
                        }
                    }
                },
              
                containment: "#drop-area",
                snap: true,
                snapTolerance: 30
            }).attr("id",node._id)
            
            $(dom).on('click',function(){
                let element = document.getElementById("heat-output-value")
                currentId = $(this).attr('id')
                if(thermostatPlaced && !heaterOpen) {
                    sliderEl.value = heatOutputOBJECT[currentId]
                    sliderOutputEl.innerHTML = heatOutputOBJECT[currentId]
                    heaterOutputDiv.style.display = "block"
                    heaterOpen = currentId
                } 
            })
            canvas.append(dom)


        }else if(node.type === "LARGE-HEATER"){ 
            const img = document.createElement("img")
            img.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
               
                if(!node.rotation) node.rotation = 0
                node.rotation += 90
                if(node.rotation >= 360) node.rotation -= 360
                this.style.transform = "rotate("+node.rotation+"deg)"

                return false;
            }, false);
            img.src = "media/bg-remove1.png"

            var dom = $(img).css({
                "width": node.width,
                "height": node.height,
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left,
                "display": "block",
                "cursor": "pointer"
            }).draggable({
                stop: function(event,ui){
                    
                    var id = ui.helper.attr("id")
                   
                    for(var i in diagram){
                        
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left  
                        }
                    }
                },
              
                containment: "#drop-area",
                snap: true,
                snapTolerance: 30
            }).attr("id",node._id)
            
            $(dom).on('click',function(){
                let element = document.getElementById("heat-output-value")
                
            })

            $(dom).on('click',function(){
                let element = document.getElementById("heat-output-value")
                currentId = $(this).attr('id')
                if(thermostatPlaced && !heaterOpen) {
                    sliderEl.value = heatOutputOBJECT[currentId]
                    sliderOutputEl.innerHTML = heatOutputOBJECT[currentId]
                    heaterOutputDiv.style.display = "block"
                    heaterOpen = currentId
                } 
            })
            canvas.append(dom)
        }
        
      
       
    }
    //render pipelines
    pipeCanvas = document.createElement("canvas")
    pipeCanvas.id = "pipe-canvas"
    pipeCanvas.classList.add("pipe-canvas")

    canvas.append(pipeCanvas)
    if(!pipeAdding) pipeCanvas.style.zIndex = -1

    pipeCanvas.width = 1000
    pipeCanvas.height = 600
    ctx = pipeCanvas.getContext('2d')
    
    if(!pipeAdding) {
        for(var p in pipelines) {
            pipelines[p].draw()
        }
    }
}



const addToQuerySelectList= (id) =>{
    querySelectList.push(document.getElementById(id))
}

// checks if room size requires heater
const dropHeaterPossible = (dragId,dropId) =>{    
    if (elementsAlreadyDropped.includes(dragId)){
        if(dragId in heatOutputOBJECT && roomSizeOBJECT[dropId] > 0){                          
            roomSizeOBJECT[dropId] -=  heatOutputOBJECT[dragId]
            if(roomSizeOBJECT[dropId] <=  0){
                renderOnCanvasOBJECT[dropId] = false
            }     
        }   
    }
}




const renderItemOnCanvas = (type) => {
    if(type === "chs"){
        if(confirmHeatPlanPressed){
            renderOnCanvas = true   
            return renderOnCanvas
        }else if(!confirmHeatPlanPressed){
            renderOnCanvas = false
            alert("Please confirm heat plan is ready")
            return renderOnCanvas
        }
    }else if(type === "room"){
        if(confirmFloorPlanPressed){
            renderOnCanvas = false
            alert("You have pressed confirm, unable to make changes to blueprint")
            roomCounter -= 1
            return renderOnCanvas
        }else if(!confirmFloorPlanPressed){
            renderOnCanvas = true
            return renderOnCanvas
        }

    }else if(type === "heater"){
        if(confirmFloorPlanPressed){
            renderOnCanvas = true
            return renderOnCanvas
        }else if(!confirmFloorPlanPressed){
            renderOnCanvas = false
            alert("you need to confirm floor plan")
            heaterCounter -=1
            return renderOnCanvas
        }
    }

}

// renders the the initail heater on Canvas by changing the 'renderOnCanvas' value to true or falss
const renderHeaterOnCanvas = (node,currentId,heaterSize)=>{
    if(renderOnCanvasOBJECT[currentId] === true){
        node.type = heaterSize.toUpperCase()
        if (heaterSize === "small-heater"){
            heatOutputOBJECT[node._id] = 60000
        }else if(heaterSize === "large-heater"){
            heatOutputOBJECT[node._id] = 120000
        }
        renderOnCanvas = true
            if(!(elementsAlreadyDropped.includes(heaterSize))){
                elementsAlreadyDropped.push(heaterSize)
                addToQuerySelectList(heaterSize)
            }else{
                elementsAlreadyDropped.push(node._id)
                addToQuerySelectList(node._id)
            }
        }else{
                heaterCounter -= 1
                alert("HEATING COMPLETE")
                renderOnCanvas = false
                if(heaterSize === "small-heater"){
                    smallHeaterCounter -= 1
                }else if(heaterSize === 'large-heater'){
                    largeHeaterCounter -= 1
                }
                
            }
}
const calculateRoomSize = (width,height) =>{
    return width*height
}



//---Pipeline functionalities---
class Pipe {
    constructor(x,y,c="red",bx,by,bw,bh) {
        this.nodes = [{x:x,y:y,connections:[],exist:true}]
        this.selectedNode = this.nodes[0]
        this.tempNode = false
        this.color = c
        this.completed = false
        this.box = {x:bx,y:by,w:bw,h:bh}
    }
    addNode(x,y, testHeaters=true,updateSelected=true) {
        if(Math.abs(this.selectedNode.x-x) < Math.abs(this.selectedNode.y-y)) {
            x = this.selectedNode.x
        } else {
            y=this.selectedNode.y
        }
        if(this.selectedNode !== false) {
            if(testHeaters) {
                // loop through each heater
                for(let item of diagram) {
                    if((item.type == "SMALL-HEATER" || item.type == "LARGE-HEATER") && !item.connected) {
                        // find distance from pipe to heater
                        let heaterX = item.position.left + 50
                        let heaterY = item.position.top + 15

                        // vertical pipes
                        if(x == this.selectedNode.x) {
                            if((y < heaterY && this.selectedNode.y > heaterY) || (y > heaterY && this.selectedNode.y < heaterY)) {
                                let dis = Math.abs(heaterX - x)
                                if(dis < 100) {
                                    this.addNode(x,heaterY,false)
                                    this.addNode(heaterX,heaterY,false,false)
                                    item.connected = true
                                }
                            }
                        }
                        // horizontal pipes
                        if(y == this.selectedNode.y) {
                            if((x < heaterX && this.selectedNode.x > heaterX) || (x > heaterX && this.selectedNode.x < heaterX)) {
                                let dis = Math.abs(heaterY - y)
                                if(dis < 50) {
                                    this.addNode(heaterX,y,false)
                                    this.addNode(heaterX,heaterY,false,false)
                                    item.connected = true
                                }
                            }
                        } 
                        console.log(item.connected)
                    }
                }
            }
            // add node
            let newNode = {x:x,y:y,connections:[],exist:true}
            // add the node to the nodelist and to the previous node's connections
            this.nodes.push(newNode)
            this.selectedNode.connections.push(newNode)
            if(updateSelected) this.selectedNode = newNode

            // finish the pipe if the new node is in the start box
            if(x > this.box.x && y > this.box.y && x < this.box.x+this.box.w && y < this.box.y+this.box.h && testHeaters && this.nodes.length > 2) {
                let notConnected = 0
                for(let item of diagram) {
                    if(item.type == "SMALL-HEATER" || item.type == "LARGE-HEATER") {
                        if(!item.connected) notConnected++
                    }
                }
                let c = true
                if(notConnected > 0) c = window.confirm(notConnected + " heaters are not connected to the pipelines. Are you sure you want to end the pipeline?")
                if(c) this.end()
            }
        }
        
    }
    removeNode(node) {
        // cant remove first node
        if(node == this.nodes[0]) return;
        let connections = node.connections
        // remove each node that depends on this one
        for(let n in connections) {
            if(connections[n].exist)
            this.removeNode(connections[n])
        }
        // remove node from list
        node.exist = false
        this.nodes.splice(this.nodes.indexOf(node),1)
        
        // remove node from connections of other nodes
        for(let n in this.nodes) {
            this.nodes[n].connections = this.nodes[n].connections.filter(c=>c.exist)
        }

        this.selectedNode = false
    }

    end() {
       
        console.log("END PIPELINE")
        pipeAdding = false
        pipeCanvas.style.zIndex = -1
        this.completed = true
        this.makeParallel()
        ctx.clearRect(0,0,pipeCanvas.width,pipeCanvas.height)
        for(let p in pipelines) pipelines[p].draw()
        let HeatPlanTotalArea = 0 

        for(const key in roomsInTotalFloorPlanOBJECT){
            
            floorPlanTotalArea += roomsInTotalFloorPlanOBJECT[key] 
        }
        for(const key in heatOutputOBJECT){
           
            if(key !== "small-heater" && key !== "large-heater"){
                heatersInTotalFloorPlan.push(heatOutputOBJECT[key])
            }
        }
        
        HeatPlanTotalArea = heatersInTotalFloorPlan.reduce((a, b) => a + b, 0)
        document.getElementById('floor-plan-total').innerHTML = floorPlanTotalArea
        document.getElementById('heat-plan-total').innerHTML = HeatPlanTotalArea
        document.getElementById('final-output').style.display = 'block'

        if(floorPlanTotalArea > HeatPlanTotalArea){
            document.getElementById("is-area-covered-text").innerHTML = "! Total area of floor plan does not have sufficient heat. Please use thermostat to increase the heat of the heaters !"
        }else{
            var parentDiv = document.querySelector("#final-output")
            const img = document.createElement("img")
            img.src = "media/green-tick.png"
            img.style.width = "100px"
            img.style.height = "90px"
            img.style.position = "relative"
            img.style.display = "block"
            img.style.top  = "60px"
            img.style.left = "15px"

            parentDiv.appendChild(img)
        }        
    }

    // create parallel pipelines
    makeParallel() {
        let newPipe = new Pipe(0,0,"#35baf6")
        // copy nodes for new pipe
        newPipe.nodes = JSON.parse(JSON.stringify(this.nodes))
        newPipe.selectedNode = false;

        // make sure copy nodes still properly reference eachother
        for(let n in newPipe.nodes) {
            let node = newPipe.nodes[n]
            for(let n2 in newPipe.nodes) {
                let node2 = newPipe.nodes[n2]
                for(let c in node2.connections) {                    
                    if(node.x == node2.connections[c].x && node.y == node2.connections[c].y) {
                        node2.connections[c] = node
                    }
                }
            }
        }

        // offset the new nodes by 10px
        for(let n in newPipe.nodes) {
            let node = newPipe.nodes[n]
            node.x -= 10
            node.y -= 10
        }

        newPipe.completed = true;
        pipelines.push(newPipe)
    }
    draw() {
        ctx.fillStyle = "#ffff00"
        ctx.lineCap = 'round';
        for(let s of this.nodes) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            for(let e of s.connections) {
                ctx.beginPath()
                ctx.moveTo(s.x,s.y)
                ctx.lineTo(e.x,e.y)
                ctx.stroke()
            }
            if(!this.completed) {
                ctx.strokeStyle = "black"
                ctx.lineWidth = 2;
                ctx.beginPath()
                ctx.arc(s.x,s.y,10,0,2*Math.PI)
                ctx.stroke()
            }
            
        }
        if(!this.completed) {
            let tempX = (Math.abs(this.tempNode.x-this.selectedNode.x) < Math.abs(this.tempNode.y-this.selectedNode.y) ? this.selectedNode.x : this.tempNode.x)
            let tempY = (Math.abs(this.tempNode.x-this.selectedNode.x) < Math.abs(this.tempNode.y-this.selectedNode.y) ? this.tempNode.y : this.selectedNode.y)
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.5
            ctx.beginPath()
            ctx.moveTo(this.selectedNode.x,this.selectedNode.y)
            ctx.lineTo(tempX,tempY)
            ctx.stroke()
            ctx.globalAlpha = 1
        }
        
    }
}
window.addEventListener('click', e => {
    let cx = mousePos[0]
    let cy = mousePos[1]
    if(pipeAdding) {
        let pipe = pipelines[pipelines.length-1]
        let clickJoint = false
        for(let n of pipe.nodes) {
            if(Math.sqrt((n.x-cx)**2+(n.y-cy)**2) < 10) {
                clickJoint = n
            }
        }
        if(clickJoint) {
            pipe.selectedNode = clickJoint
        } else {
            pipe.addNode(cx,cy)
        }
        ctx.clearRect(0,0,pipeCanvas.width,pipeCanvas.height)
        for(let p in pipelines) pipelines[p].draw()
    }
    
})

window.addEventListener('mousemove', e => {
    var rect = pipeCanvas.getBoundingClientRect()
    var x = Math.round(e.clientX - rect.left) //set the clicked x position
    var y = Math.round(e.clientY - rect.top) //set the clicked y position
    if(x >= 0 && y >= 0 && x < pipeCanvas.width && y < pipeCanvas.height) mousePos = [x,y]
    if(pipeAdding) {
        pipelines[pipelines.length-1].tempNode = {x:mousePos[0],y:mousePos[1]}
        ctx.clearRect(0,0,pipeCanvas.width,pipeCanvas.height)
        for(let p in pipelines) pipelines[p].draw()
    }
})

window.addEventListener('keydown', e => {
    if(e.key == "Delete") {
        if(pipeAdding) {
            let pipe = pipelines[pipelines.length-1]
            if(pipe.selectedNode) pipe.removeNode(pipe.selectedNode)
            ctx.clearRect(0,0,pipeCanvas.width,pipeCanvas.height)
            for(let p in pipelines) pipelines[p].draw()
        }
    }
})


})









//---------------------------------------------------------------------------------------------------------------------------------------







/*
Functionalities to include:

Rooms(Draggable){
    can be dragged to the drop area     (DONE)
    can be dragged back to the menu     (DONE)

    Large and small rooms               (DONE)

    Large requires 500j of energy       (DONE)
    small requires 150j of energy       (DONE)

    
}
Heaters(Draggable){
    can be dragged to the drop area      (DONE)
    can be dragged back to the menu       (DONE)

    Large and small Heaters

    Large = 500j output                 (DONE)
    small = 150j output                 (DONE)


}

pipes {
    should connect from the main to each heater  (DONE)
}

heating power{
    generate certain power output       (DONE)
} 



*/







//---------------------------------------------------------------------------------------------------------------------------------------
