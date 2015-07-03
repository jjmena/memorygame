var path = require("path");

var url  = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user = (url[2] || null);
var pwd  = (url[3] || null);
var protocol  = (url[1] || null);
var dialect  = (url[1] || null);
var host  = (url[5] || null);
var port  = (url[4] || null);
var storage = process.env.DATASE_STORAGE;

console.log(url);

// Cargar el modelo del ORM
var Sequelize  = require("sequelize");

// Usar BBDD SQLite
var sequelize = new Sequelize (DB_name, user, pwd,
                    {dialect: dialect, protocol: protocol, storage: storage,
                        omitNull: true, port: port, host:host,
                        dialectOptions: { ssl: true }
                    });

// Importar la definición de la tabla QUIZ en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exportar la definición de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then( function(){
    // success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count){
        if (count === 0){ // La tabla se inicializa si está vacia
            Quiz.create({pregunta: 'Capital de Italia',
                         respuesta: 'Roma'
                
            }).then(function(){console.log('Base de datos inicializada')});    
        }
    });
});