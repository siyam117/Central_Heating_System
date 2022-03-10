
const draggableMainRooom = document.querySelector('#main-room')
const draggableBathroom = document.querySelector('#bathroom')
const draggableLivingRoom = document.querySelector('#living-room')
const droppableArea = document.querySelector('#drop-area')
const dropAreaText = document.querySelector('#drop-area-text')
let roomNumber = 0

// console.log(droppableArea.id)
// //console.log(dropAreaText.nodeName)
// $(".main-room").draggable({
//     containment: "document",
//     snap: true,
//     snapTolerance: 50,
//     stop: mainRoomDragStop
// });

// $(".bathroom").draggable({
//     containment: "document",
//     snap: true,
//     snapTolerance: 50,
//     stop: bathroomDragStop
// });

// $('#drop-area').droppable( {
//     snap: true,
//     snapTolerance: 20,
//     drop: handleDropEvent
//   });

// function handleDropEvent( event, ui ) {
// var draggable = ui.draggable;

// }


// function mainRoomDragStop( event, ui ) {
//     var offsetXPo = parseInt( ui.offset.left );
//     var offsetYPos = parseInt( ui.offset.top );
//     const droppedElement = document.getElementById(draggableMainRooom.id)

//     droppableArea.appendChild(droppedElement)
//     // droppableArea.appendChild(droppedElement).style.top = '0'
//      droppableArea.appendChild(droppedElement).style.margin = '0'
//   }

//   function bathroomDragStop( event, ui ) {
//     var offsetXPos = parseInt( ui.offset.left );
//     var offsetYPos = parseInt( ui.offset.top );
//     const droppedElement = document.getElementById(draggableBathroom.id)

//     droppableArea.appendChild(droppedElement)
//     // droppableArea.appendChild(droppedElement).style.top = '0'
//      droppableArea.appendChild(droppedElement).style.margin = '0'


//   }

draggableMainRooom.addEventListener('dragstart', e=>{
    e.dataTransfer.setData('text/plain',draggableMainRooom.id)
    console.log(e.dataTransfer.setData('text/plain',draggableMainRooom.id)
    )
    roomNumber = 1
})

draggableBathroom.addEventListener('dragstart', e=>{
    console.log(e.dataTransfer.setData('text/plain',draggableBathroom.id))
    roomNumber = 2
})

draggableLivingRoom.addEventListener('dragstart', e=>{
    console.log(e.dataTransfer.setData('text/plain',draggableLivingRoom.id))
    roomNumber = 3
})
const ROOM = document.querySelector('#room')
const DRAGGABLE_AREA = document.querySelector('drop-area')
var dragItem = null;




//when draggable object is over the drop area
for (const dropArea of document.querySelectorAll(".drop-area")){
    dropArea.addEventListener('dragover', e=>{
        e.preventDefault();
        dropArea.classList.add("drop-zone-over");
    })
    //when draggable element is dropped onto the drop area
    dropArea.addEventListener('drop', e=>{
        e.preventDefault();
        
        const droppedElementId = e.dataTransfer.getData("text/plain")
        const droppedElement = document.getElementById(droppedElementId)
        
        if(roomNumber ===  1){
            droppableArea.appendChild(droppedElement).style.width = '200px'
            droppableArea.appendChild(droppedElement).style.height = '250px'
            droppableArea.appendChild(droppedElement).style.display = 'flexbox'
            droppableArea.appendChild(droppedElement).style.left = '0'
            droppableArea.appendChild(droppedElement).style.top = '0'
            droppableArea.appendChild(droppedElement).style.marginTop = '0'
            droppableArea.appendChild(droppedElement).style.resize = 'verticle'
            droppableArea.appendChild(droppedElement).style.overflow = 'auto'

            dropArea.classList.remove("drop-zone-over");


            //dropAreaText.innerHTML = ''
        }else if(roomNumber === 2){
            droppableArea.appendChild(droppedElement).style.width = '100px'
            droppableArea.appendChild(droppedElement).style.height = '200px'
            droppableArea.appendChild(droppedElement).style.display = 'flexbox'
            droppableArea.appendChild(droppedElement).style.left = '0'
            droppableArea.appendChild(droppedElement).style.top = '0'
            droppableArea.appendChild(droppedElement).style.marginTop = '0'
            droppableArea.appendChild(droppedElement).style.resize = 'verticle'
            droppableArea.appendChild(droppedElement).style.overflow = 'auto'

            dropArea.classList.remove("drop-zone-over");
            //dropAreaText.innerHTML = ''
        }else if(roomNumber === 3){
            droppableArea.appendChild(droppedElement).style.width = '400px'
            droppableArea.appendChild(droppedElement).style.height = '200px'
            droppableArea.appendChild(droppedElement).style.display = 'flexbox'
            droppableArea.appendChild(droppedElement).style.left = '0'
            droppableArea.appendChild(droppedElement).style.top = '0'
            droppableArea.appendChild(droppedElement).style.marginTop = '0'
            droppableArea.appendChild(droppedElement).style.resize = 'verticle'
            droppableArea.appendChild(droppedElement).style.overflow = 'auto'
            dropArea.classList.remove("drop-zone-over");
            //dropAreaText.innerHTML = ''
        }
        
        
        
    })

}
//when draggable object is over the MENU
for(const dropArea of document.querySelectorAll(".menu")){
    dropArea.addEventListener('dragover', e=>{
        e.preventDefault();
        
    })
    //when draggable element is dropped onto the MENU
    dropArea.addEventListener('drop', e=>{
        e.preventDefault();

        const menuDroppedElementId = e.dataTransfer.getData("text/plain")
        const menuDroppedElement = document.getElementById(menuDroppedElementId)

        if(roomNumber === 1){
        document.getElementById('room').appendChild(menuDroppedElement).style.width = '100px'
        document.getElementById('room').appendChild(menuDroppedElement).style.height = '100px'
        document.getElementById('room').appendChild(menuDroppedElement).style.left = ''
        document.getElementById('room').appendChild(menuDroppedElement).style.marginTop = '10'
        document.getElementById('main-room').style.display = 'block'
        droppableArea.classList.remove('drop-zone-over')

        } else if (roomNumber === 2){
            document.getElementById('room').appendChild(menuDroppedElement).style.width = '50px'
            document.getElementById('room').appendChild(menuDroppedElement).style.height = '100px'
            document.getElementById('room').appendChild(menuDroppedElement).style.left = ''
            document.getElementById('room').appendChild(menuDroppedElement).style.marginTop = '10'
            document.getElementById('bathroom').style.display = 'block'
            droppableArea.classList.remove('drop-zone-over')
        }

        




        
    })

}










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