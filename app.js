const koa = require("koa");
const json = require("koa-json");
const koaRouter = require("koa-router");
const path = require("path");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser");
const fs = require("fs-extra");
const sqlite = require("sqlite");
const socket = require("socket.io");
const serve = require("koa-static");

const app = new koa();
const router = new koaRouter();
const dbPromise = sqlite.open("./db/chinook.db", { Promise });

app.use(json());
app.use(bodyParser());
app.use(serve(__dirname, "/public"));
app.use(router.routes()).use(router.allowedMethods());


//simple middleware
render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
    viewExt: "html",
    cache: false,
    debug: false
});

//ROUTES
router.get("/", index);
router.get("/add", showAdd);
router.get("/profile/:person", showPerson);
router.post("/add", add);8990

async function index(ctx) {
        let rawdata = await fs.readFile("text.json");
        let people = JSON.parse(rawdata);
        await ctx.render("index", { things: people 
    });
}

async function showAdd(ctx) {
    await ctx.render("add");
}

async function add(ctx) {
    const body = ctx.request.body;
    var beastValue;

    if (ctx.request.body["beast"] === "beast") {
        beastValue = true;
    } else {
        beastValue = false;
    }

    const data = await fs.readFile("text.json");
    let json = JSON.parse(data);
    json.push({
        name: ctx.request.body["name"],
        gender: ctx.request.body["gender"],
        beast: beastValue
    });

    await fs.writeFile("text.json", JSON.stringify(json));

    ctx.redirect("/");
}

async function showPerson(ctx) {
    try {
        const data = await fs.readFile("text.json");
        let personObject = JSON.parse(data).find(
            o => o.name === ctx.params.person
        );

        const db = await dbPromise;
        const playlists = await db.all("SELECT * from playlists");
        //console.log(playlists);
        //******/have to make separate map function look at graph example*****
        // playlists.map(playlist => {
        //     playlist = personObject.name + " " + playlist;
        // });
           // console.log(playlists);
        await ctx.render("profile", {
            person: personObject,
            musicList: playlists
        });
    } catch (err) {
        console.log(err);
    }
}

const server = app.listen(3000, () => console.log("server started"));
var io = socket(server);

io.on("connection", socket => {
    console.log("Connected to socket!", socket.id);

    socket.on("btnClick", data => {
        io.sockets.emit("btnClick", data);
    });

    socket.on("playlistSelection", data => {
        QueryTracks(data).then(tracks => {
           //console.log(tracks);
            io.sockets.emit("TracksFound",tracks);
        });

    });
});


async function QueryTracks(data) {
    const db = await dbPromise;
    const query = "SELECT * from tracks WHERE Playlist = ?";
    const tracks = await db.all(query, data.PlaylistId); 
    return tracks
}
