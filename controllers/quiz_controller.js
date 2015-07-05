var models = require("../models/models.js");


// Autoload - factoriza el código si ruta incluye quizId
exports.load = function (req,res,next,quizId) {
    models.Quiz.findById(quizId).then(
            function(quiz) {
                if (quiz) {
                    req.quiz = quiz;
                    next();
                }else {
                    next(new Error('No existe quizId=' + quizId));
                }
                
            }
        ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function (req, res) {
    
    var busqueda = {};
    var consulta = 'Introduzca un filtro de búsqueda';
    if (req.query.search) {
        consulta = req.query.search;
        var cadena = '%' + req.query.search + '%';
        // Además reemplazamos los espacios
        cadena = cadena.replace(" ",'%');
        // Se termina el objeto de búsqueda
        busqueda = {where:["pregunta like ?", cadena],
                    order: 'pregunta ASC'
                    }
    }
    models.Quiz.findAll(busqueda).then(function(quizes){
        res.render('quizes/index', {quizes: quizes, consulta: consulta});
    }).catch(function(error) {next(error);});
    
} ;

// GET /quizes/:id
exports.show = function (req, res) {
    res.render('quizes/show', {quiz: req.quiz});
} ;

// GET /quizes/answer
exports.answer = function (req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', {quiz : req.quiz,respuesta: resultado});
};

// GET /author
exports.author = function(req, res) {
  res.render('author',{autor:'Jacinto Jesús Mena Lomeña'});
};

// GET /quizes/new
exports.new = function (req, res) {
    var quiz = models.Quiz.build(
            {pregunta: "Pregunta", respuesta: "Respuesta"}
        );  
    res.render("quizes/new", {quiz: quiz});
};

// POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz)  ;
  
  // Guardar en DB los campos de pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
     res.redirect("/quizes");
  }); // Redirección HTTP (URL relativo) lista de preguntas
};