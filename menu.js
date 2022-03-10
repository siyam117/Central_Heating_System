
const draggableMainRooom = document.querySelector('#main-room')
const draggableBathroom = document.querySelector('#bathroom')
const draggableLivingRoom = document.querySelector('#living-room')
const droppableArea = document.querySelector('#drop-area')
const dropAreaText = document.querySelector('#drop-area-text')
let roomNumber = 0



$(function(){
    count = 0
    var canvas = $("#drop-area")
    var $dragRoom = $("#room")
    var diagram = [];
    const draggableMainRooom = document.querySelector('#main-room')


$('.sub-btn').click(function(){
    $(this).next('.sub-menu').slideToggle();
    $(this).find('.dropdown').toggleClass('rotate');
})

$("div","#room").draggable({
    containment: "document",
    revert: "invalid",
    helper: "clone",
    cursor: "move",
    

});



canvas.droppable({
    drop: function(event,ui){
        var node = {
            _id: (new Date).getTime(),
            position: ui.helper.position(),

          

        };
        console.log("NODE HERE")
        console.log(node)

        node.position.left -= canvas.position().left;

        if(ui.helper.hasClass("main-room")){
            node.type = "MAIN-ROOM"
         
        }else if(ui.helper.hasClass("bathroom")){
            node.type = "BATHROOM"

        }else if(ui.helper.hasClass("living-room")){
            node.type = "LIVING-ROOM"
            
        }
        else{
            return;
        }
        diagram.push(node)
        console.log(diagram)
        renderDiagram(diagram)
       
    }
})

function renderDiagram(diagram){
    canvas.empty();
    for(var d in diagram){
        var node = diagram[d];
        var html = "";
        console.log("DIAGRAM CONSOLED HERE")
        console.log(diagram)
        if(node.type === "MAIN-ROOM"){
            html = "<div>Bedroom</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": "250px",
                "height": "250px",
                "border": "8px solid black",
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
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area",                                   //i.e. make it so that it doesnt move when another room is dropped after resized
                minWidth: 100,
                minHeight: 100,
                start: function(event,ui){
                    console.log("LOGGING UI HERE")
                    console.log(ui)
                    
                    var id = ui.helper.attr("id")
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

            canvas.append(dom)
        }else if(node.type === "BATHROOM"){
            html = "<div>Bath</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": "100px",
                "height": "200px",
                "border": "8px solid black",
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
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area",                                   //i.e. make it so that it doesnt move when another room is dropped after resized
                start: function(event,ui){
                    
                    var id = ui.helper.attr("id")
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

            canvas.append(dom)
        }else if(node.type === "LIVING-ROOM"){
            html = "<div>living-room</div>";
            var dom = $(html).css({
                "font-size": "15px",
                "text-align": "center",
                "line-height": "100px",
                "cursor": "pointer",
                "width": "400px",
                "height": "300px",
                "border": "8px solid red",
                "background-color": "white",
                "position": "absolute",
                "top": node.position.top,
                "left": node.position.left
            }).draggable({
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
            }).attr("id",node._id).resizable({                               //fix the resize using the same methods as draggable
                containment: "#drop-area", 
                minWidth: 100,
                minHeight: 100,                                  //i.e. make it so that it doesnt move when another room is dropped after resized
                start: function(event,ui){
                    
                    var id = ui.helper.attr("id")
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
            canvas.append(dom)
        }
    }
}
})




//---------------------------------------------------------------------------------------------------------------------------------------







/*
Functionalities to include:

Rooms(Draggable){
    can be dragged to the drop area
    can be dragged back to the menu

    Large and small rooms

    Large requires 500j of energy
    small requires 150j of energy

    
}
Heaters(Draggable){
    can be dragged to the drop area
    can be dragged back to the menu

    Large and small Heaters

    Large = 500j output
    small = 150j output


}

pipes {
    should connect from the main to each heater
}

heating power{
    generate certain power output
} 



*/