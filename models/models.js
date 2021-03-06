var path = require("path");

var url  = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user = (url[2] || null);
var pwd  = (url[3] || null);
var protocol  = (url[1] || null);
var dialect  = (url[1] || null);
var host  = (url[4] || null);
var port  = (url[5] || null);
var storage = process.env.DATASE_STORAGE;

// Cargar el modelo del ORM
var Sequelize  = require("sequelize");

// Usar BBDD SQLite
var sequelize = new Sequelize (DB_name, user, pwd,
                    {dialect: dialect, protocol: protocol, storage: storage,
                        omitNull: true, port: port, host:host
                    });

// Importar la definición de la tabla QUIZ en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla COMMENT en comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Definición de las relaciones entre entidades
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar la definición de la tabla Quiz
exports.Comment = Comment; // exportar la definición de la tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then( function(){
    // success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count){
        if (count === 0){ // La tabla se inicializa si está vacia
            Quiz.create({pregunta: 'Capital de Portugal',
                         respuesta: 'Lisboa'
                
            });
            Quiz.create({pregunta: 'Capital de Italia',
                         respuesta: 'Roma'
                
            }).then(function(){console.log('Base de datos inicializada')});    
        }
    });
});