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

function getTarget(x) {
    x = x || window.event;
    return x.target || x.srcElement;
}
