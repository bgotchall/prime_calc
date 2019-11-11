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
var first_array = []; // this is for the first 2 results, in paraenthesis.
var just_first_results = []; //an array of just the numeric results of the first operation, for fast checking
var just_results = []; //an array of just the results, for fast checking.
var sorted_answers = [];
var work_array=[];

var val1 = $("#n1").val();
var val2 = $("#n2").val();
var val3 = $("#n3").val();
var target = $("#target").val();
var primes=[1,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];

var operators = ["+", "-", "*", "/", "^"];

$("#submit_button").on("click", function() {
  //go button clicked.  take all the inputs and build up the answer list.
  val1 = $("#n1").val();
  val2 = $("#n2").val();
  val3 = $("#n3").val();
  target = $("#target").val();
  // $("#answers")

  sample_answers = [];
  first_array = []; // this is for the first 2 results, in paraenthesis.
  just_first_results = []; //an array of just the numeric results of the first operation, for fast checking
  just_results = [];
  

  console.log(val1);
  console.log(val2);
  console.log(val3);
  $("#answers").empty();

  if (parseInt(val1) < 21 && parseInt(val2) < 21 && parseInt(val3) < 21) {
    console.log("is valid");
    build_answers_pass1(val1, val2, false, false, "a", "b");
    build_answers_pass1(val1, val2, true, false, "a", "b");
    build_answers_pass1(val1, val2, false, true, "a", "b");
    build_answers_pass1(val1, val2, true, true, "a", "b");

    build_answers_pass1(val2, val1, false, false, "a", "b");
    build_answers_pass1(val2, val1, true, false, "a", "b");
    build_answers_pass1(val2, val1, false, true, "a", "b");
    build_answers_pass1(val2, val1, true, true, "a", "b");

    build_answers_pass1(val1, val3, false, false, "a", "c");
    build_answers_pass1(val1, val3, true, false, "a", "c");
    build_answers_pass1(val1, val3, false, true, "a", "c");
    build_answers_pass1(val1, val3, false, false, "a", "c");

    build_answers_pass1(val3, val1, false, false, "a", "c");
    build_answers_pass1(val3, val1, true, false, "a", "c");
    build_answers_pass1(val3, val1, false, true, "a", "c");
    build_answers_pass1(val3, val1, false, false, "a", "c");

    build_answers_pass1(val3, val2, false, false, "b", "c");
    build_answers_pass1(val3, val2, true, false, "b", "c");
    build_answers_pass1(val3, val2, false, true, "b", "c");
    build_answers_pass1(val3, val2, false, false, "b", "c");

    build_answers_pass1(val2, val3, false, false, "b", "c");
    build_answers_pass1(val2, val3, true, false, "b", "c");
    build_answers_pass1(val2, val3, false, true, "b", "c");
    build_answers_pass1(val2, val3, false, false, "b", "c");

    // the combinations of 2 are exhausted.  now combine the previous results with a, b and c
    for (var i = 0; i < first_array.length; i++) {
      //combine each partial answer with a 3rd dice.
      build_answers_pass2(first_array[i], val3, false, "c");
      build_answers_pass2(first_array[i], val3, true, "c");
      build_answers_pass2(first_array[i], val1, false, "a");
      build_answers_pass2(first_array[i], val1, true, "a");
      build_answers_pass2(first_array[i], val2, false, "b");
      build_answers_pass2(first_array[i], val2, true, "b");
    }
      //answers are totally built now in the answer array.  do cool stuff like sorting, showing
      // your target, highlighting primes and charting on the gameboard.
      // after all that identify the Goldbachs

      if (true) {
        console.log("==========final arrays=======================");
        console.log("answer objects list");
        console.log(sample_answers);
        console.log("first pass objects");
        console.log(first_array);
        console.log("Just results number array");
        console.log(just_results);
      }
     
      
      sorted_answers=[];
      sort_answers(sample_answers, sorted_answers, 600);
      print_answers(sorted_answers);
      
      sample_answers=sorted_answers;    //restore the answers array just in case
      
      if (just_results.includes(parseInt(target))) {
        console.log ("target found!");

        // function checkAdult(age) {
        //     return age >= 18;
        //   }
          
        //   function myFunction() {
        //     document.getElementById("demo").innerHTML = ages.find(checkAdult);
        //   }

        var target_object;
        //debugger;
        target_object=find_by_result(sorted_answers,target);


        var thing1 = $(
            "<p> Target Found!  sentence: " +
            target_object.sentence +
              " answer: " +
              target_object.result +
              "</p>"
          );
        $("#answers").prepend(thing1);
      }
    
  } else {
    //if valid inputs
    var message = $("<p>Error.  numbers must be less than 20</p>");
    $("#answers").append(message);
  }
});

//////////////////////////////////////////////////////
function build_answers_pass1(a, b, a_f, b_f, letter1, letter2) {
  //attempt a 2 argument answer since it is simpler, and I think I need it anyway
  //pass1 for the first parenthetical group.
  //a_f and b_f are booleans for whether to apply the unary factorial
  //letter1 and letter2 are "a","b"or "c"

  var this_result;

  for (var i = 0; i < operators.length; i++) {
    if (a_f && b_f) {
      this_result = calc_result(factorial(a), factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + "!" + operators[i] + b + "!",
          result: this_result,
          used1: letter1,
          used2: letter2
        });
      }
    } else if (a_f) {
      this_result = calc_result(factorial(a), b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + "!" + operators[i] + b,
          result: this_result,
          used1: letter1,
          used2: letter2
        });
      }
    } else if (b_f) {
      this_result = calc_result(a, factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + operators[i] + b + "!",
          result: this_result,
          used1: letter1,
          used2: letter2
        });
      }
    } else {
      this_result = calc_result(a, b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + operators[i] + b,
          result: this_result,
          used1: letter1,
          used2: letter2
        });
      }
    }
  }
  if (false) {
    console.log("pass1 results:");
    console.log(first_array);
    console.log(just_first_results);
  }
}
//////////////////////////////////////////////////////
function find_by_result(array,target){
//search my array of objects, returning the object who's result matches "target"

for (var i=0; i<array.length;i++){
    if (array[i].result==target){ return array[i]}

}

}
//////////////////////////////////////////////////////
function build_answers_pass2(x, c, c_f, letter1) {
  //a_f and b_f are booleans for whether to apply the unary factorial
  //letter1 and letter2 are "a","b"or "c"

  var this_result;

  if (x.used1 == letter1 || x.used2 == letter1) {
    return; // if the third letter matches either of the first 2, done.
  } else {
    for (var i = 0; i < operators.length; i++) {
      if (c_f) {
        this_result = calc_result(x.result, factorial(c), operators[i]);
        if (good_answer(this_result)) {
          if (is_unique_pass2(this_result) === true) {
            just_results.push(this_result);
            sample_answers.push({
              sentence: "(" + x.sentence + ")" + operators[i] + c + "!",
              result: this_result,
              used1: letter1,
              used2: "Y"
            });
          }
        }
      } else {
        this_result = calc_result(x.result, c, operators[i]);
        if (good_answer(this_result)) {
          if (is_unique_pass2(this_result) === true) {
            just_results.push(this_result);
            sample_answers.push({
              sentence: "(" + x.sentence + ")" + operators[i] + c,
              result: this_result,
              used1: letter1,
              used2: "Y"
            });
          }
        }
      }
    }
    if (false) {
      console.log("pass2 results:");
      console.log(first_array);
      console.log(just_first_results);
    }
  }
}

function print_answers(array_to_print) {
  var element;
  var isPrime=false;
  var primeFlair="";
  //debugger;
  for (var i = 0; i < array_to_print.length; i++) {
    primeFlair="";
    isPrime=false;
    element = array_to_print[i];
    if (primes.includes(element.result)){
        isPrime=true;
        primeFlair="  -  -  -  -  Prime number";
    }
    var thing1 = $(
      "<p> sentence: " +
        element.sentence +
        " answer: " +
        element.result + primeFlair+
        "</p>"
    );
    if (isPrime){
        console.log("this is a prime"+ element.result);
        //font-weight: bold;
        $(thing1).css( "font-weight", "bold");
    }
    $("#answers").append(thing1);
  }
}

function is_unique(result) {
  //if the actual numeric answer doesn't yet exist in the global array,add it.  no point in finding multiple
  //ways to the same answer
  var unique = true;
  // console.log(
  //   "--------- starting unique test------------------looking at: " + result
  // );
  // console.log("results array is: ");
  // console.log(just_first_results);

  //ok, now check for hugeness.  if this anwser, or sub answer is gigantic, pretend its useless even though there would be
  // corner cases where it would be ok.
  if (result > 499 || result < -499) {
    return false;
  }

  if (just_first_results.includes(result)) {
    unique = false;
  }

  //console.log("result was: " + unique);
  return unique;
}

function is_unique_pass2(result) {
  //if the actual numeric answer doesn't yet exist in the global array,add it.  no point in finding multiple
  //ways to the same answer
  var unique = true;
  // console.log(
  //   "--------- starting unique test------------------looking at: " + result
  // );
  // console.log("results array is: ");
  // console.log(just_results);

  //ok, now check for hugeness.  if this anwser, or sub answer is gigantic, pretend its useless even though there would be
  // corner cases where it would be ok.
  if (result > 499 || result < -499) {
    return false;
  }

  if (just_results.includes(result)) {
    unique = false;
  }

  // console.log("result was: " + unique);
  return unique;
}
function calc_result(a, b, operator) {
  //a and b are numbers, operator is a character. return the math answer
  switch (operator) {
    case "+":
      return parseFloat(a) + parseFloat(b);
      break;
    case "-":
      return parseFloat(a) - parseFloat(b);
      break;
    case "*":
      return parseFloat(a) * parseFloat(b);
      break;
    case "/":
      return parseFloat(a) / parseFloat(b);
      break;
    case "^":
      return parseFloat(a) ** parseFloat(b);
      break;
    default:
      break;
  }
}

function factorial(n) {
  return n != 1 ? n * factorial(n - 1) : 1;
}

function good_answer(n) {
  //this is the final filter for a numeric result.  it has to be an integer between 1 and 121.  otherwise return false
  //console.log("n is: " +n+" modulus is "+n%1);
  if (n % 1 == 0 && n > 0 && n < 122) {
    //if (Number.isInteger(n) &&(n>0)&&(n<122)){
    return true;
  }
}

function sort_answers(in_array, out_array, index) {
  //sort the full answer array (array of results) by the result, in ascending order
  // a result looks like:  {sentence: "(3/2)*4", result: 6, used1: "c", used2: "Y"}

  var lowest_result;
  var this_result;
  var position = 0;

  index--; //just to keep it from running forever
  if (index === 0) {
    alert("infinate loop averted");
    return;
  }
  //debugger;
  
  if (in_array.length === 0) {
    //console.log("empty array detected");
    return in_array, out_array; //exit condition for recursion.
  } else {
    lowest_result = in_array[0].result;

    for (var i = 0; i < in_array.length; i++) {
      //console.log("in sort algo.  current lowest is " + lowest_result);
      this_result = in_array[i].result;

      if (this_result < lowest_result) {
       // console.log("lower result found: " + this_result);
        lowest_result = this_result;
        position = i;
      }
    }
    // console.log("here is the object I am adding to out array: ");
    // console.log( in_array[position]);
    out_array.push(in_array[position]); //add the highest to the output array
    in_array.splice(position, 1); //cut out the lowest result
   
    // console.log("Running again with this as the input: ");
    // console.log( in_array);
    // console.log("This is the output array so far: ");
    // console.log( out_array);
    return sort_answers(in_array, out_array, index); //recurse with a smaller in_array
  }
}



//pseudo code:
//
// I have a, b, c.  any can also be a factorial.  I can take any combination, like this, where
//% is any operator [+, -, /, *,^]:
// (a  % b)  % c
// (a! % b)  % c
// (a  % b!) % c
// (a  % b) % c!
// (a  % b!)  % c!
// (a!  % b!)  % c
// (a!  % b)  % c!
// (a!  % b!)  % c!
//----
// (b  % a)  % c
// (b! % a)  % c
// (b  % a!) % c
// (b  % a) % c!
// (b  % a!)  % c!
// (b!  % a!)  % c
// (b!  % a)  % c!
// (b!  % a!)  % c!
//----
// (a  % c)  % b
// (a! % c)  % b
// (a  % c!) % b
// (a  % c) % b!
// (a  % c!)  % b!
// (a!  % c!)  % b
// (a!  % c)  % b!
// (a!  % c!)  % b!
//----
// (c  % a)  % b
// (c! % a)  % b
// (c  % a!) % b
// (c  % a) % b!
// (c  % a!)  % b!
// (c!  % a!)  % b
// (c!  % a)  % b!
// (c!  % a!)  % b!
//---
// (c  % b)  % a
// (c! % b)  % a
// (c  % b!) % a
// (c  % b) % a!
// (c  % b!)  % a!
// (c!  % b!)  % a
// (c!  % b)  % a!
// (c!  % b!)  % a!
//---
// (b  % c)  % a
// (b! % c)  % a
// (b  % c!) % a
// (b  % c) % a!
// (b  % c!)  % a!
// (b!  % c!)  % a
// (b!  % c)  % a!
// (b!  % c!)  % a!
