// Client facing scripts here
$(() => {
  $('#new_question').on('submit', (evt) => {
    evt.preventDefault();
    evt.stopImmediatePropagation()
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
    const answer_btn1 = $('input[name="answer-btn1"]:checked').val();
    console.log(answer_btn1);
    const answer_btn2 = $('input[name="answer-btn2"]:checked').val();
    console.log(answer_btn2);
    const answer_btn3 = $('input[name="answer-btn3"]:checked').val();
    console.log(answer_btn3);
    const answer_btn4 = $('input[name="answer-btn4"]:checked').val();
    console.log("input button: ", answer_btn4);
    const questionList = {
      question: question,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      answer4: answer4,
      answer_btn4,
      answer_btn3,
      answer_btn2,
      answer_btn1,
      quiz_id: quiz_id
    };
    $.ajax({
      url: `/new_question/${quiz_id}`,
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
});

$('#quiz_submit').on('submit', (evt) => {
  evt.preventDefault();
  evt.stopImmediatePropagation();
  const answer_btn1 = $('input[name="answer1"]:checked').val();
  console.log(answer_btn1);
  const answer_btn2 = $('input[name="answer2"]:checked').val();
  console.log(answer_btn2);
  const answer_btn3 = $('input[name="answer3"]:checked').val();
  console.log(answer_btn3);
  const answer_btn4 = $('input[name="answer4"]:checked').val();
  console.log("input button: ", answer_btn4);
  const quiz_id  = $("#quiz_id").html();
  console.log('quiz_id: ', quiz_id)

  const answerList = {
    answer_btn1,
    answer_btn2,
    answer_btn3,
    answer_btn4,
    quiz_id
  };
  $.ajax({
    url: `/quizzes/${quiz_id}`,
    method: 'POST',
    data: answerList
  });

})
})
