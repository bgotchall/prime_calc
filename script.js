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

  var val1 = $("#n1").val();
  var val2 = $("#n2").val();
  var val3 = $("#n3").val();
  var target = $("#target").val();

var operators = ["+", "-", "*", "/", "^"];

$("#submit_button").on("click", function() {
  //go button clicked.  take all the inputs and build up the answer list.
  val1 = $("#n1").val();
  val2 = $("#n2").val();
  val3 = $("#n3").val();
  target = $("#target").val();
  // $("#answers")
  sample_answers = [];

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
    }

    
  } else {
    //if valid inputs
    var message = $("<p>Error.  numbers must be less than 20</p>");
    $("#answers").append(message);
  }

 // sentence: (3/4)+5 answer: 5
  console.log("==========final arrays=======================");
  console.log("answer objects list");
  console.log(sample_answers);
  console.log("first pass objects");
  console.log(first_array);
  print_answers();
});

/////////////////////////////////////////////////////////////
function build_answers(a, a_sentance, b, a_f, b_f) {
  //attempt a 2 argument answer since it is simpler, and I think I need it anyway
  //a_f and b_f are booleans for whether to apply the unary factorial

  var this_result;

  for (var i = 0; i < operators.length; i++) {
    if (a_f && b_f) {
      this_result = calc_result(factorial(a), factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        sample_answers.push({
          sentence: "(" + a_sentance + ")" + "!" + operators[i] + b + "!",
          result: this_result
        });
      }
    } else if (a_f) {
      this_result = calc_result(factorial(a), b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        sample_answers.push({
          sentence: "(" + a_sentance + ")" + "!" + operators[i] + b,
          result: this_result
        });
      }
    } else if (b_f) {
      this_result = calc_result(a, factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        sample_answers.push({
          sentence: "(" + a_sentance + ")" + operators[i] + b + "!",
          result: this_result
        });
      }
    } else {
      this_result = calc_result(a, b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        sample_answers.push({
          sentence: "(" + a_sentance + ")" + operators[i] + b,
          result: this_result
        });
      }
    }
  }
}
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
  console.log("pass1 results:");
  console.log(first_array);
  console.log(just_first_results);
}

//////////////////////////////////////////////////////
function build_answers_pass2(x, c, c_f, letter1) {
  //a_f and b_f are booleans for whether to apply the unary factorial
  //letter1 and letter2 are "a","b"or "c"

  var this_result;
  console.log(
    "x used are " +
      x.used1 +
      " " +
      x.used2 +
      "  thing I am checking against: " +
      letter1
  );
  if (x.used1 == letter1 || x.used2 == letter1) {
    console.log("this letter is reused, exit");
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
    console.log("pass2 results:");
    console.log(first_array);
    console.log(just_first_results);
  }
}

//////////////////////////////////////////////////////
function build_answers3(a, b, c, a_f, b_f, c_f) {
  //a_f and b_f are booleans for whether to apply the unary factorial

  var this_result = 0;

  for (var i = 0; i < operators.length; i++) {
    if (a_f && b_f) {
      this_result = calc_result(factorial(a), factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + "!" + operators[i] + b + "!",
          result: this_result
        });
      }
    } else if (a_f) {
      this_result = calc_result(factorial(a), b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + "!" + operators[i] + b,
          result: this_result
        });
      }
    } else if (b_f) {
      this_result = calc_result(a, factorial(b), operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + operators[i] + b + "!",
          result: this_result
        });
      }
    } else {
      this_result = calc_result(a, b, operators[i]);
      if (is_unique(this_result) === true) {
        just_first_results.push(this_result);
        first_array.push({
          sentence: a + operators[i] + b,
          result: this_result
        });
      }
    }
  }

  sample_answers = first_array;
  console.log("first answers array is: ");
  console.log(first_array);
  console.log("first answers array item 0 is: ");
  console.log(first_array[0]);
  console.log("sample answers array is: ");
  console.log(sample_answers);
  console.log("just first results  is: ");
  console.log(just_first_results);
  for (i = 0; i < first_array.length; i++) {
    //     //now march through the a%b answers, treating them as a parenthetical, and combine with c
    build_answers(
      first_array[i].result,
      first_array[i].sentence,
      c,
      false,
      false
    );
    // build_answers(first_array[i].result,first_array[i].sentence,c,false,true);
    // build_answers(first_array[i].result,first_array[i].sentence,c,true,true);
  }
}
/////////////////////////////////////////////

function print_answers() {
  var element;
  for (var i = 0; i < sample_answers.length; i++) {
    element = sample_answers[i];
    var thing1 = $(
      "<p> sentence: " +
        element.sentence +
        " answer: " +
        element.result +
        "</p>"
    );
    $("#answers").append(thing1);
  }
}
function is_unique_old(result) {
  //if the actual numeric answer doesn't yet exist in the global array,add it.  no point in finding multiple
  //ways to the same answer
  var unique = true;
  console.log(
    "--------- starting unique test------------------looking at: " + result
  );

  //ok, now check for hugeness.  if this anwser, or sub answer is gigantic, pretend its useless even though there would be
  // corner cases where it would be ok.
  if (result > 499 || result < -499) {
    return false;
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
  if ((n%1==0)&&(n>0)&&(n<122)){
    //if (Number.isInteger(n) &&(n>0)&&(n<122)){
    return true;
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
