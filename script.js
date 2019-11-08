////////////////////////////////////////////////////////////////////////////
// calculate the potential results of 3 numbers.  1-12, 1-20, and 1-20. Results can be 1-121.
// prime numbers are more valuable.  Any operators can be used, +,-,x,/,^,!.  Also 2 numbers
// can be grouped with parethesis.
// so the approach is to do this:
// 1) find all 3 options with any operators, discarding duplicates.  a ? b ? c.  any order can be considered.
// 2) find all options with (a?b)?c , a? (b?c), (a?c)?b
//  build up a list of unique answers with the operations that got the answer, keeping the first one in the
// case of duplicates.
// note the ! is a little different because its a unitary operator.  Basically every number needs to be checked
// along with its factorial
// answers will be like this:  [{7*3-2, 19},7*3+2,23]

var sample_answers = [
  { sentence: "7*3-2", result: 19 },
  { sentence: "7*3+2", result: 23 }
];

var operators = ["+", "-", "*", "/", "^"];

$("#submit_button").on("click", function() {
  var val1 = $("#n1").val();
  var val2 = $("#n2").val();
  var val3 = $("#n3").val();
  var target = $("#target").val();
  // $("#answers")
  

  console.log(val1);
  console.log(val2);
  console.log(val3);
  $("#answers").empty();

  if (parseInt(val1) < 21 && parseInt(val2) < 21 && parseInt(val3) < 21) {
    console.log("is valid");
  } else {
    //if valid inputs
    var message = $("<p>Error.  numbers must be less than 20</p>");
    $("#answers").append(message);
  }
});

//first attempt to do the all 3 approach:
//function build_answers(a, b, c) {}
function build_answers(a, b) {
  //attempt a 2 argument answer since it is simpler, and I think I need it anyway
var args=[a,b];
var my_results=[];

    for (var i=0;i<operators.length;i++){
        my_results.push({sentence: a+operators[i]+b, result:0});
        console.log("sentence: "+a+operators[i]+b)

    }
return my_results;
}

function print_answers(answers){
    var element;
    for (var i=0; i< answers.length;i++){
        element=answers[i];
        var thing1=$("<p> sentence: "+element.sentence+ " answer: "+ element.result +"</p>");
        $("#answers").append(thing1);

    }
    
}

print_answers(sample_answers);
sample_answers=build_answers(2,5);
print_answers(sample_answers);