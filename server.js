const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Estoy listo!");
});

// prefijo para que el bot sepa que le hablan
const prefix = "!";

// comprueba si el contenido del mensaje que el bot está procesando comienza con el
// prefijo que configuró y, si no lo hace, deja de procesarlo.
client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length); //quita el prefijo de la cadena
    
  const args = commandBody.split(" "); //convierte la cadena en un array separado por comas
  const contador = args.length;
  let command;
  var contado=0;
  Bebidas=[]
  //saber si el mensaje es para pedir o regalar una bebida
  if (contador == 2) {
    saberBeb=args[1]
    command = args.shift().toLowerCase();;
    message.channel.send(`${command}`);

  } else if (contador == 3) {
    saberBeb=args[1]
    var recividor = args.pop();

    command = args.splice(2, 1); // borrará a la persona que an etiquetado;
    var sabor = args[1]; //obtenemos el sabor de la bebida
    command = args.shift().toLowerCase();;
    var user = message.author; //obter el autor del mensaje
    message.channel.send(`${command}`);
  }else if(contador==4){
    command = args[1];
    message.channel.send(`${command}`);
    message.channel.send(`entra aqui`);
  }

  //comando para servir las bebidas
  if (command === "drink,ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  } else if (command === "drink") {
    let idex=Bebidas.findIndex(art => art.nombre===sabor)
    
    const gif = Bebidas.length;
    if (contador == 2) {
      message.reply(`aqui esta su bebida!`);
      message.channel.send(`${gif}`);
    } else if (contador == 3) {
      message.channel.send(
        `Hey ${recividor}, ${user} te a regalado una ${sabor}`
      );
      message.channel.send(`${gif}`);
    }
  } else if (command === "add") {
      
      Bebidas.push({
        nombre:args[2],
        imagen:args[3]
      });
      message.channel.send(`bebida agregada ${Bebidas[contado].nombre}`);
      contado++;
      message.channel.send(`bebida agregada ${Bebidas.length}`);
  }
});

client.login("Nzc0MjkyMzk0MDY5NTkwMDM3.X6Vp_A.ui01MbnmrB_lgP5bBdzz1EUZ5sA");
