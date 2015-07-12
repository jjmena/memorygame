var models = require("../models/models.js");

// GET /quizes/statistics
exports.show = function (req, res) {
    var params = {nPreguntas: -1, nComentarios: -1, nAvgComentarios: -1, nPregunstasSinComentarios:-1, nPreguntasConComentarios:-1, errors: []};
    
    // Contar preguntas
    models.Quiz.count().then(function (quizCount){
        params['nPreguntas'] = quizCount;
        
        // Contar comentarios
        models.Comment.count().then(function (commentCount) {
            params['nComentarios'] = commentCount;
            
            // Media de comentarios / pregunta
            if (quizCount>0){
                params['nAvgComentarios'] = commentCount / quizCount;
            } else {
                params['nAvgComentarios'] = 0;
            }
        
            // Contar preguntas sin comentarios
            models.Quiz.count({include: [{model: models.Comment, required: true}], distinct: 'id'}).then (function (quizConComent){
                
                params['nPregunstasSinComentarios'] = quizCount - quizConComent;
                params['nPreguntasConComentarios'] = quizConComent;
            
                res.render('quizes/statistics', params);          
            });
            
            
        });
    });


    
} ;

