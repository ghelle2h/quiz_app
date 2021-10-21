// Client facing scripts here
$(() => {
  $('#new_question').on('submit', (evt) => {
    evt.preventDefault();
    evt.stopImmediatePropagation();
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
})
