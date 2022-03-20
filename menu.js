
const draggableMainRooom = document.querySelector('#main-room')

$(function(){


let roomSizeOBJECT = {}
let heatOutputOBJECT = {}

heatOutputOBJECT["small-heater"] = 60000
let renderOnCanvasOBJECT = {}
var currentId = ""
var elementsAlreadyDropped = []
var renderOnCanvas = true
var canvas = $("#drop-area")
var diagram = [];




//when the sub button is clicked, it toggles a dropdown on the menu
$('.sub-btn').click(function(){
    $(this).next('.sub-menu').slideToggle();
    $(this).find('.dropdown').toggleClass('rotate');
})
//every div in class "room" is draggable
const item = $("div","#sub-menu").draggable({
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",

});




$("img","#heater").draggable({
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",

});


canvas.droppable({
    //on drop of a room, it creates a node with ID and current Position
    drop: function(event,ui){
        
        var node = {
            _id: (new Date).getTime(),   //give them random ID so that when running a for loop you can pick unique elements from list
            position: ui.helper.position(),
            width: ui.helper.css('width'),
            height: ui.helper.css('height')
        };



        //subtracts from position left, the current left value of the drop on canvas so that it drop in the same spot as the mouse
        node.position.left -= canvas.position().left;

        if(ui.helper.hasClass("main-room")){
            node.type = "MAIN-ROOM"
         
        }else if(ui.helper.hasClass("bathroom")){
            node.type = "BATHROOM"

        }else if(ui.helper.hasClass("living-room")){
            renderOnCanvasOBJECT[node._id] = true

            node.type = "LIVING-ROOM"
            roomSizeOBJECT[node._id] = 120000
            
        
            
        }else if(ui.helper.hasClass("small-heater")) {
            console.log(`renderOnCanvasOBJECT: ${renderOnCanvasOBJECT}`) 
            console.log(`currentId: ${currentId}`)
            if(renderOnCanvasOBJECT[currentId] === true){
            node.type = "SMALL-HEATER"
            heatOutputOBJECT[node._id] = 60000
            renderOnCanvas = true
            if(!(elementsAlreadyDropped.includes("small-heater"))){
                elementsAlreadyDropped.push("small-heater")
            }else{
                elementsAlreadyDropped.push(node._id)
            }

            
            }else{
                alert("HEATING COMPLETE")
                renderOnCanvas = false
            }

        }
        else{
            return;
        }
        if(renderOnCanvas){
            diagram.push(node)                  //pushes the node into a list called "Diagram"
            renderDiagram(diagram) 
        }
        renderOnCanvas = true
         
        //diagram is rendered onto the canvas
       
    }
})



//<----------------------------------------------Rendering the item onto the Canvas -------------------------------------------------------->

function renderDiagram(diagram){
    canvas.empty();                                 //empties the canvas before rendering everything in the diagram array 
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
                "width": "250px",
                "height": "250px",
                "border": "4px double black",
                "background-color": "white",
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
                start: function(event,ui){
                    
                    
                    var id = ui.helper.attr("id")
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                           
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                        }
                    }
                }
            })
            console.log(dom)
            canvas.append(dom)

//<------------------------------------------------------BATHROOM----------------------------------------------------------------------->
        }else if(node.type === "BATHROOM"){
            html = "<div>Bath</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": "100px",
                "height": "200px",
                "border": "5px solid black",
                "background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                snap: true,
                snapTolerance: 30,
                stop: function(event,ui){
                    console.log(ui)
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
                start: function(event,ui){
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            console.log(diagram[i].width,ui.size.width)
                            console.log(diagram[i].height,ui.size.height)
                            diagram[i].width = ui.size.width                
                            diagram[i].height = ui.size.height
                        }
                    }
                }
            })
            console.log(dom)
            canvas.append(dom)
//<------------------------------------------------------LIVING-ROOM------------------------------------------------------------------>
        }else if(node.type === "LIVING-ROOM"){
            html = "<div>living-room</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": "400px",
                "height": "300px",
                "border": "4px double black",
                "background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
                stop: function(event,ui){
                    //console.log(ui)
                    var id = ui.helper.attr("id")
                    //currentId = $(this).attr('id')
                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            diagram[i].position.top = ui.position.top
                            diagram[i].position.left = ui.position.left
                        }
                    }
                    

                    //console.log(node.width,node.height)
                },
                containment: "#drop-area",
                snap: true,
                snapTolerance: 10
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area", 
                minWidth: 150,
                minHeight: 150,                                  //i.e. make it so that it doesnt move when another room is dropped after resized
                stop: function(event,ui){
                    // console.log(node.width,node.height)
                    
                    
                    var id = ui.helper.attr("id")
                   

                    for(var i in diagram){
                        if(diagram[i]._id == id){
                            console.log("diagram size before")
                            console.log(diagram[i].width)
                            console.log(diagram[i].height)
                            console.log("ui size before assigning to diagram")
                            console.log(ui.size.width)
                            console.log(ui.size.height)
                            diagram[i].width = ui.size.width
                            diagram[i].height = ui.size.height
                        
                        }
                        
                        console.log(diagram[i].width)
                        console.log(diagram[i].height)
                    }
                       
                    
                    node.width = ui.size.width
                    node.height = ui.size.height
                    // console.log(node.width,node.height)
                    
                    const roomSize = calculateRoomSize(node.width,node.height)
                    roomSizeOBJECT[$(this).attr('id')] = roomSize
                    
                    // this.setAttribute("roomSize", roomSize);
                    
                }
            
            }).droppable({
                over: function (event, ui) { 
                    currentId = $(this).attr('id')
                },
                drop: function(event,ui){
                   
                            
                    //-----------------------------------------------------------
                    //Attribute seems to be the same as the size of the rooms in the menu
                    //try a for loop to match the ids and then retrieve the node sizes
                
           
                    if ((elementsAlreadyDropped.includes(ui.draggable.attr('id')))){
                        console.log("BRAND NEW ELEMENT")
                        if(ui.draggable.attr('id') in heatOutputOBJECT && roomSizeOBJECT[$(this).attr('id')] > 0){
                            console.log("made it inside the second if statement")
                            roomSizeOBJECT[$(this).attr('id')] -=  heatOutputOBJECT[ui.draggable.attr('id')]
                            if(roomSizeOBJECT[$(this).attr('id')] <=  0){

                                renderOnCanvasOBJECT[$(this).attr('id')] = false
                            }
                        }
                    }
                    console.log(renderOnCanvasOBJECT)
                    console.log(heatOutputOBJECT)
                    console.log(roomSizeOBJECT)

                    // const roomSize = calculateRoomSize(parseInt(this.style.width.replace("px","")),parseInt(this.style.height.replace("px","")))
                    // if(checkCapacity(draggedItem.draggable("option","heat"), roomSize)){
                    

 
                },
                containment: this    
            })
            
            canvas.append(dom)
            

            
//<---------------------------------------------heater functionalities ---------------------------------------------------------------->
        }else if(node.type === "SMALL-HEATER"){
            const img = document.createElement("img")
            img.src = "media/bg-remove1.png"

            var dom = $(img).css({
                "width": "100px",
                "height": "31px",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left,
                "display": "block"
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
                heat: 60000,
                containment: "#drop-area",
                snap: true,
                snapTolerance: 30
            }).attr("id",node._id)
            
        }
        canvas.append(dom)
       
    }
}

// function rightclick() {
//     var rightclick;
//     var e = window.event;
//     if (e.which) rightclick = (e.which == 3);
//     else if (e.button) rightclick = (e.button == 2);
//     alert(rightclick); // true or false, you can trap right click here by if comparison
// }


const checkCapacity = (heat,roomSize) => {
    return (roomSize >= 100000 && heat >= 10 ? true : alert("you need 2 heaters"))
}

const calculateRoomSize = (width,height) =>{
    return width*height
}




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
    should connect from the main to each heater
}

heating power{
    generate certain power output       (DONE)
} 



*/