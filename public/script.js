var socket = io.connect("http://127.0.0.1:3000");

//Query DOM
let input = document.getElementById("playlistInput");
let btn = document.getElementById("sendBtn");
let output = document.getElementById("outputDiv");

//Emit Events
btn.addEventListener("click", () => {
    socket.emit("btnClick", { playlist: input.value });
});

//Listen for events
socket.on("btnClick", data => {
    output.innerHTML = data.playlist;
});
