var express = require('express');
var router = express.Router();

var quizController = require("../controllers/quiz_controller.js");
var commentController = require("../controllers/comment_controller.js");
var sessionController = require("../controllers/session_controller.js");
var statisticController = require("../controllers/statistic_controller.js");


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: [] });
});

// Autoload
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); // autoliad :commentId

// Definición de rutas de sesion
router.get('/login', sessionController.new); // formulario de login
router.post('/login', sessionController.create); // crear sesion
router.get('/logout', sessionController.destroy); // destruir sesion

// Peticiones para QUIZ
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create',  sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);
router.get('/author', quizController.author);

// Peticiones para COMMENT
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Estadisticas
router.get('/quizes/statistics', statisticController.show);



module.exports = router;
