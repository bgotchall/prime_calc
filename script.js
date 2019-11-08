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

// var sample_answers = [
//   { sentence: "7*3-2", result: 19 },
//   { sentence: "7*3+2", result: 23 }
// ];
var sample_answers = [];

var operators = ["+", "-", "*", "/", "^"];

$("#submit_button").on("click", function() {
//go button clicked.  take all the inputs and build up the answer list.
  var val1 = $("#n1").val();
  var val2 = $("#n2").val();
  var val3 = $("#n3").val();
  var target = $("#target").val();
  // $("#answers")
  sample_answers = [];
  

  console.log(val1);
  console.log(val2);
  console.log(val3);
  $("#answers").empty();

  if (parseInt(val1) < 21 && parseInt(val2) < 21 && parseInt(val3) < 21) {
    console.log("is valid");
    build_answers(val1,val2);
    build_answers(factorial(val1),val2);
    build_answers(val1,factorial(val2));
    build_answers(factorial(val1),factorial(val2));
    //print_answers();
    build_answers(val2,val3);
    //print_answers();
    build_answers(val1,val3);
    //print_answers();
  } else {
    //if valid inputs
    var message = $("<p>Error.  numbers must be less than 20</p>");
    $("#answers").append(message);
  }

  console.log("final list");
  console.log(sample_answers);
  print_answers();
});

//first attempt to do the all 3 approach:
//function build_answers(a, b, c) {}
function build_answers(a, b) {
  //attempt a 2 argument answer since it is simpler, and I think I need it anyway
var args=[a,b];
//var my_results=[];

    for (var i=0;i<operators.length;i++){
       var this_result=calc_result(a,b,operators[i]);
       if (is_unique(this_result)===true){ 
        sample_answers.push({sentence: a+operators[i]+b, result:this_result});
        };
        
       // my_results.push({sentence: b+operators[i]+a, result:calc_result(b,a,operators[i])});
       // console.log("sentence: "+b+operators[i]+a)
      

    }

}

function print_answers(){
    var element;
    for (var i=0; i< sample_answers.length;i++){
        element=sample_answers[i];
        var thing1=$("<p> sentence: "+element.sentence+ " answer: "+ element.result +"</p>");
        $("#answers").append(thing1);

    }
    
}
function is_unique(result){
//if the actual numeric answer doesn't yet exist in the global array,add it.  no point in finding multiple
//ways to the same answer
var unique=true;

    for (i=0; i<sample_answers.length;i++){
        console.log("in unique test. "+result+ " vs "+sample_answers[i].result)
        if (parseInt(sample_answers[i].result)===parseInt(result)){
            console.log("matches");
            unique=false;
        }

    }
console.log("result was"+unique);
return unique;
}


function calc_result(a,b,operator){
//a and b are numbers, operator is a character. return the math answer
switch (operator) {
    case "+":
        //console.log("plus detected");
        return parseInt(a) + parseInt(b);
        break;
    case "-":
        return parseInt(a) - parseInt(b);
        break;
    case "*":
        return parseInt(a) * parseInt(b);
        break;
    case "/":
        return parseInt(a) / parseInt(b);
        break;
    case "^":
        return parseInt(a) ** parseInt(b);
        break;
    default:
        break;
}

}

function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
  }
//print_answers(sample_answers);
//sample_answers=build_answers(val1,val2);
//print_answers(sample_answers);