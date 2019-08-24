var socket = io();

//Query DOM
let input = document.getElementById("playlistInput");
let btn = document.getElementById("sendBtn");
let output = document.getElementById("outputDiv");
let playlistsBtnList = document.getElementById("playlistBtnList");

playlistsBtnList.addEventListener("click", (ev) => {
    let x = getTarget();
    socket.emit("playlistSelection", {PlaylistId: x.id, Name: x.innerHTML});
});

//Emit Events
btn.addEventListener("click", () => {
    socket.emit("btnClick", { playlist: input.value });
});

//Listen for events
socket.on("btnClick", data => {
    output.innerHTML += data.playlist;
});

socket.on("TracksFound",data => {
    let trackList = document.getElementById("trackList");
    let trackListHeader = document.getElementById("trackListHeader");

    trackList.innerHTML="";

    if (Object.keys(data).length > 0){
        trackListHeader.innerHTML="Track List:";
        trackListHeader.style.visibility = "visible";

        for (let i = 0; i < Object.keys(data).length; i++){
            let track = data[i];
            let listItem = document.createElement("li");
            listItem.setAttribute("class","list-group-item");
            trackList.appendChild(listItem);
            listItem.textContent = track.Name + ' by ' + track.Composer;
        }
    }
    else{
        trackListHeader.innerHTML="This Playlist Has No Tracks";
    }
    
});

function getTarget(x) {
    x = x || window.event;
    return x.target || x.srcElement;
}
