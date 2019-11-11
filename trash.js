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
  

