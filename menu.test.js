let zIndexCount = 100 
let heatOutputOBJECT = {
        "small-heater": 60000,
        "large-heater": 120000
    }
let roomSizeOBJECT = {}
let renderOnCanvasOBJECT = {}
var currentId = ""
var heatersAlreadyDropped = []
var renderOnCanvas = true
var canvasList = []
var diagram = [];
var pipelines = [];
var mousePos = [0,0];
var pipeAdding = false;
var querySelectList = [];
var currentItem = ""
const { test, expect } = require("@jest/globals");


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
                        let heaterX = item.position.left + 100
                        let heaterY = item.position.top + 70

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
            if(x > this.box.x && y > this.box.y && x < this.box.x+this.box.w && y < this.box.y+this.box.h && testHeaters && this.nodes.length > 2) this.end()
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
     
        pipeAdding = false
        this.completed = true
        this.makeParallel()
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
        pipelines.push(newPipe);
    }
}
function testPipeClick(){
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
    }
}
function testDrop(ui){
    zIndexCount += 1;
    var node = {
        _id: (new Date).getTime(),
        position: {top:mousePos[0],left:mousePos[1]},
    };
    if(ui.helper.class == "main-room"){
        renderOnCanvasOBJECT[node._id] = true
        node.type = "MAIN-ROOM"
        roomSizeOBJECT[node._id] = 59049
        node.width = 250
        node.height = 250

    }else if(ui.helper.class == "bathroom"){
        renderOnCanvasOBJECT[node._id] = true
        node.type = "BATHROOM"
        roomSizeOBJECT[node._id] = 20000
        node.width = 100
        node.height = 200

    }else if(ui.helper.class == "living-room"){
        renderOnCanvasOBJECT[node._id] = true
        node.type = "LIVING-ROOM"
        roomSizeOBJECT[node._id] = 120000
        node.width = 400
        node.height = 300
        
        
    }else if(ui.helper.class == "small-heater") {
        renderHeaterOnCanvas(node,currentId,"small-heater")

    }else if(ui.helper.class == "large-heater") {
        renderHeaterOnCanvas(node,currentId,"large-heater")

        

    }else if(ui.helper.class == "chs"){
            renderOnCanvasOBJECT[node._id] = true
            node.type = "CHS"
            roomSizeOBJECT[node._id] = 20000
            node.width = 100
            node.height = 100
            //console.log("style")
            //ui.draggable.css('display','none')
            //$(".menu .room .boiler").css("background-color","#1b1b1b")
    }
    else{
        return;
    }

    if(renderOnCanvas){
        diagram.push(node) 
        if(node.type == "CHS") { // create pipeline and start drawing for it
            pipelines.push(new Pipe((node.position.left+node.width/2)-20, node.position.top+node.height/2,"red",(node.position.left)-35,node.position.top,node.width,node.height))
            pipeAdding = true
        }
        //renderDiagram(diagram)
        dropHeaterPossible("small-heater",node._id)
        dropHeaterPossible("large-heater",node._id)
    }
    renderOnCanvas = true
}
const dropHeaterPossible = (dragId,dropId) =>{
    if (heatersAlreadyDropped.includes(dragId)){
        if(dragId in heatOutputOBJECT && roomSizeOBJECT[dropId] > 0){                          
            roomSizeOBJECT[dropId] -=  heatOutputOBJECT[dragId]
            if(roomSizeOBJECT[dropId] <=  0){
                renderOnCanvasOBJECT[dropId] = false
            }     
        }   
    }
}
const renderHeaterOnCanvas = (node,currentId,heaterSize)=>{
    if(renderOnCanvasOBJECT[currentId] === true){
        node.type = heaterSize.toUpperCase()
        if (heaterSize === "small-heater"){
            heatOutputOBJECT[node._id] = 60000
        }else if(heaterSize === "large-heater"){
            heatOutputOBJECT[node._id] = 120000
        }
        renderOnCanvas = true
            if(!(heatersAlreadyDropped.includes(heaterSize))){
                heatersAlreadyDropped.push(heaterSize)
                addToQuerySelectList(heaterSize)
            }else{
                heatersAlreadyDropped.push(node._id)
                addToQuerySelectList(node._id)
            }
        }else{
            renderOnCanvas = false
        }
}
const addToQuerySelectList= (id) =>{
    querySelectList.push(undefined)
}



test("room added",()=>{
    expect(diagram.length).toBe(0);
    testDrop({helper:{class:"main-room"}});
    expect(diagram.length).toBe(1);
    testDrop({helper:{class:"living-room"}});
    expect(diagram.length).toBe(2);
});
test("do rooms overlap",()=>{
    function checkOverlap(){
        if(diagram.length < 2) return false;
        else{
            for(let i = 0; i < diagram.length-1; i++){
                for(let j = 1; j < diagram.length; j++){
                    if(i != j){
                        if(diagram[i].position.left < diagram[j].position.left + diagram[j].width && diagram[i].position.left + diagram[i].width > diagram[j].position.left){
                            if(diagram[i].position.top < diagram[j].position.top + diagram[j].height && diagram[i].position.top + diagram[i].height > diagram[j].position.top){
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
    }
    expect(checkOverlap()).toBe(true);
    diagram[1].position = {left:1000,top:1000};
    expect(checkOverlap()).toBe(false);
    mousePos = [1000,0];
    testDrop({helper:{class:"bathroom"}});
    expect(checkOverlap()).toBe(false);
    mousePos = [100,100];
    testDrop({helper:{class:"bathroom"}});
    expect(checkOverlap()).toBe(true);
});
test("heater added",()=>{
    mousePos = [50,10];
    currentId = diagram[0]._id;
    dropHeaterPossible("small-heater",diagram[0]._id);
    testDrop({helper:{class:"small-heater"}});
    expect(diagram.length === 5 && diagram[diagram.length-1].type === "SMALL-HEATER").toBe(true);
});
test("is there a heater in a room",()=>{
    function checkForHeaters(index){
        for(let i = 0; i < diagram.length; i++){
            if(diagram[i].type === "SMALL-HEATER"){
                let heaterWidth = 100;
                let heaterHeight = 31;
                if(diagram[index].position.left < diagram[i].position.left + heaterWidth && diagram[index].position.left + diagram[index].width > diagram[i].position.left){
                    if(diagram[index].position.top < diagram[i].position.top + heaterHeight && diagram[index].position.top + diagram[index].height > diagram[i].position.top){
                        return true;
                    }
                }
            }
            else if(diagram[i].type === "LARGE-HEATER"){
                let heaterWidth = 150;
                let heaterHeight = 50;
                if(diagram[index].position.left < diagram[i].position.left + heaterWidth && diagram[index].position.left + diagram[index].width > diagram[i].position.left){
                    if(diagram[index].position.top < diagram[i].position.top + heaterHeight && diagram[index].position.top + diagram[index].height > diagram[i].position.top){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    expect(checkForHeaters(0)).toBe(true);
});
test("is room heat capacity full",()=>{
    mousePos = [20,20];
    currentId = diagram[0]._id;
    dropHeaterPossible("small-heater",diagram[0]._id);
    expect(renderOnCanvasOBJECT[currentId]).toBe(true);
 
    mousePos = [1020,1020];
    dropHeaterPossible("small-heater",diagram[1]._id);
    expect(renderOnCanvasOBJECT[currentId]).toBe(false);
});
test("have pipes been set",()=>{
    mousePos = [10,10];
    testDrop({helper:{class:"chs"}});
    mousePos = [200,10];
    testPipeClick();
    mousePos = [200,200];
    testPipeClick();

    expect(pipeAdding).toBe(true);
    expect(pipelines[0].completed).toBe(false);

    mousePos = [10,200];
    testPipeClick();
    mousePos = [20,20];
    testPipeClick();

    expect(pipeAdding).toBe(false);
    expect(pipelines[0].completed).toBe(true);
    expect(pipelines[1].completed).toBe(true);
});
test("is heater connected to a pipe",()=>{
    expect(diagram[diagram.length-2].connected).toBe(true);
});