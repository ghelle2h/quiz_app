// Client facing scripts here

$(document).ready(function () {
  console.log("loaded")

  const createQuestionElement = question => {
    const newQuestion =
      `<article class="questions">
        <h3>${quiz.title}</h3>
        <h4>Quiz by ${user.name}</h4>
        <article class="question">
          <h4 class="question">${quiz.content.text}</h4>
          <h4 class="answers">${quiz.content.text}</h4>
        </article>
      </article>`

    return newQuestion;
  }

  const renderQuestions = function (questions) {
    for (const question of questions) {
      const $question = createQuestionElement(question);
      $('#questions-container').append($question);
    };
  };

  const loadQuestion = function () {
    $.ajax('/questions', { method: 'GET' })
      .then(function (response) {
        renderQuestions(response)
      })
  }

  loadQuestion();

  $(".input-form").submit(function (event) {
    event.preventDefault();

    let data = $(this.text).serialize();

      $.post('/questions', data, function () {
        $('#questions-container').empty()
        loadQuestions()
        $('.question1').val("");
        $('#input-answer1').val("");
        $('#input-answer2').val("");
        $('#input-answer3').val("");
        $('#input-answer4').val("");
      })
  })
})
