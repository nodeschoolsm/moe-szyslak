//conection Discord
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { TOKEN } = process.env;
console.log({TOKEN});
if (!TOKEN) {
  return console.log("token no existe");
}

client.login(TOKEN);

//conection dblow
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

//formato del json
db.defaults({ drinks: [] }).write();

client.on("ready", () => {
  console.log("Estoy listo!");
});

// prefijo para que el bot sepa que le hablan
const prefix = "!";
var contador;
client.on("message", gotMessage);

function gotMessage(message) {
  if (message.author.bot) return; // comprueba si el contenido del mensaje que el bot está procesando comienza con el
  if (!message.content.startsWith(prefix)) return; // prefijo que configuró y, si no lo hace, deja de procesarlo.

  const commandBody = message.content.slice(prefix.length); //quita el prefijo de la cadena
  const args = commandBody.split(" "); //convierte la cadena en un array separado por comas
  contador = args.length;

  //message.channel.send(`${contador}`);

  let resut = valueMessage(args);

  switch (resut) {
    case "add":
      addDrinks(args);
      message.channel.send(`bebida agregada con exito`);

      break;
    case "edit":
      modifyDrinks(args);
      message.channel.send(`bebida modificada con exito`);
      break;
    case "delete":
      deleteDrinks(args);
      message.channel.send(`bebida eliminada con exito`);
      break;
    case "server":
      //console.log("entre en el switch")

      serveDrinks(args, message);
      break;
    case "view":
      viewDrinks(message);
      break;
    case "help":
      helpbot(message);

      break;
    default:
  }
}

//function to add drinks to json
function addDrinks(args) {
  let drink = args[2].toLowerCase();
  let url = args[3];
  db.get("drinks").push({ drink: drink, gif: url }).write();
}

//function to remove drinks
function deleteDrinks(args) {
  // Get your drink and gif
  let gif = db.get("drinks").find({ drink: args[2] }).get("gif").value();

  // Do something to your drink
  console.log("gif que vamos a eliminar " + gif);

  db.get("drinks").remove({ drink: args[2], gif: gif }).write();
}

//function to modify drinks
function modifyDrinks(args) {
  // Update the user with the modified drink
  db.get("drinks").find({ drink: args[2] }).assign({ gif: args[3] }).write();
}

//function to serve drinks
function serveDrinks(args, message) {
  let gif = db.get("drinks").find({ drink: args[1] }).get("gif").value();
  console.log(`gif ${gif}`);
  let drink = db.get("drinks").find({ drink: args[1] }).get("drink").value();

  //console.log(`drink ${drink}`);
  var user = message.author;
  var recividor = args[2];

  if (contador == 3) {
    message.channel.send(`${recividor}, ${user} te a regalado una ${gif}`);
  } else if (contador == 2) {
    message.reply(`aqui esta su bebida!`);
    message.channel.send(`${gif}`);
  }
}
//funtio to see list drinks
function viewDrinks(message) {
  drinksName = db.get("drinks").map("drink").value();

  console.log(drinksName);

  message.channel.send({
    embed: {
      color: 3447003,
      title: "Drinks",
      fields: [
        {
          name: `${drinksName}`,
          value: "gracias vuelva pronto",
        },
      ],
    },
  });
}

//funtion to help sintax bot
function helpbot(message) {
  message.channel.send({
    embed: {
      color: 3447003,
      title: "comandos para moe-bot",
      description: "lista y uso de comandos",
      fields: [
        {
          name: "ADD",
          value: "!drink [ADD] [NOMBRE DE LA BEBIDA] [URL DE LA BEBIDA] ",
        },
        {
          name: "EDIT",
          value: "!drink [EDIT] [NOMBRE DE LA BEBIDA] [URL DE LA BEBIDA] ",
        },
        {
          name: "DELETE",
          value: "!drink [DELETE] [NOMBRE DE LA BEBIDA] ",
        },
        {
          name: "SERVER",
          value:
            "!drink [NOMBRE DE LA BEBIDA ] [USER DE LA PERSONA A LA QUE LE REGALO]",
          value1: "!drink [NOMBRE DE LA BEBIDA QUE QUIERO]",
        },
        {
          name: "HELP",
          value: "!drink [HELP]",
        },
        ,
        {
          name: "VIEW",
          value: "!drink [VIEW]",
        },
      ],
    },
  });
}

//comprobar cuerpo del mensaje

function valueMessage(args) {
  let command;

  // if the array has 4 values, it means that the command is to edit or add
  console.log(contador);
  if (contador == 4) {
    console.log("entre en el if de 4");
    command = args[1].toLowerCase();
    console.log(command);
  } else if (contador == 3) {
    console.log("entre en el if de 3");
    if (args[1] === "delete") {
      command = "delete";
    } else {
      command = "server";
    }
    console.log(command);
  } else if (contador == 2) {
    // console.log("entre en el if de 2")
    if (args[1] === "help") {
      command = "help";
    } else if (args[1] === "view") {
      command = "view";
    } else {
      command = "server";
    }

    console.log(command);
  }

  return command;
}
