// Client facing scripts here
$(() => {
  $('#new_question').on('submit', (evt) => {
    evt.preventDefault();
    // $.post("/new_question/1");
    const question = $("#question").val()

    const answer1 = $("#input_answer1").val()
    console.log(answer1);
    const answer2 = $("#input_answer2").val()
    console.log(answer2);
    const answer3 = $("#input_answer3").val()
    console.log(answer3);
    const answer4 = $("#input_answer4").val()
    console.log(answer4);
    const quiz_id = $("#quiz_id").html();

    const questionList = {
      question: question,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      answer4: answer4,
      quiz_id: quiz_id
    };
console.log("quiz_id:", quiz_id);
    $.ajax({
      url: `/new_question/${questionList.quiz_id}`,
      method: 'POST',
      data: questionList
    })
    .then((response) =>{
    $("#question").val("");
    $("#input_answer1").val("");
    $("#input_answer2").val("");
    $("#input_answer3").val("");
    $("#input_answer4").val("");
    console.log("running");
    })
    .catch((err) => console.log(err.message));





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
});
})
