/*
File: script.js
GUI Assignment 4: Using the jQuery Plugin/UI with Your Dynamic Table PART 2
Masha Tsykora, UMass Lowell Computer Science, mary_tsykora@student.uml.edu
Copyright (c) 2023 by Masha Tsykora. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Updated on 6/23/23 at 7:10am.
Instructor: Professor Wenjin Zhou
Sources of Help: W3Schools, MDN Web Docs, CodingTheSmartway, C# Corner, the textbook chapters from the assignment PDF,
classmates who discussed the Save Table button idea from our class discord server (I did NOT take code or advice from anyone to do this)
Brief Overview: I FURTHER updated my webpage that lets a user enter a column lower bound, a column upper bound,
a row lower bound, and a row upper bound. If the user doesn't enter a valid input in any of the forms, 
then an appropriate error message will be displayed underneath the "Submit" button. ADDITIONALLY, I added 
custom form-specific error messages that will display underneath the specific form where the error is.
There are now sliders below each bound form, as well as messages that appear dynamically. 
Once all the error messages have been cleared, the user can update the multiplication table dynamically with the sliders.
There is a new "Save Table" button that appears below the "SUbmit" button, and when a table is being displayed, the "Save Table"
button appears underneath it. The user can click this button to save their current table in a new tab. 
I didn't add css styling to the new tabs, the tables are displayed in plaintext in a neat grid format.
I couldn't figure out how to do that with my "lowerBoundLarger" messages, so I kept the function as it originally
was in HW 3. I also kept the original error messages from my "rangeValidation" function, so there can be two sets 
of messages that appear: ones specific to each form where the error is, and ones that appear below the "submit" button.
Unfortunately, I wasn't able to figure out how to make the table scrollable, so it will stretch across
the page for larger inputs (didn't fix this from HW 3). I also didn't fix the "range" issue (from -50 to 50) from HW 3.
This code isn't as commented as Part 1, I only commented parts that were brand-new to this code.
*/



$(document).ready(function() {
    $('#boundsForm').validate({
        rules: {
            clbound: {
                required: true,
                number: true,
                min: 1,
                max: 50
            },
            cubound: {
                required: true,
                number: true,
                min: 1,
                max: 50
            },
            rlbound: {
                required: true,
                number: true,
                min: 1,
                max: 50
            },
            rubound: {
                required: true,
                number: true,
                min: 1,
                max: 50
            }
        },
        messages: {
            clbound: {
                required: "Column Lower Bound is required.",
                number: "Column Lower Bound should be a number.",
                min: "Column Lower Bound should be at least 1.",
                max: "Column Lower Bound should be at most 50."
            },
            cubound: {
                required: "Column Upper Bound is required.",
                number: "Column Upper Bound should be a number.",
                min: "Column Upper Bound should be at least 1.",
                max: "Column Upper Bound should be at most 50."
            },
            rlbound: {
                required: "Row Lower Bound is required.",
                number: "Row Lower Bound should be a number.",
                min: "Row Lower Bound should be at least 1.",
                max: "Row Lower Bound should be at most 50."
            },
            rubound: {
                required: "Row Upper Bound is required.",
                number: "Row Upper Bound should be a number.",
                min: "Row Upper Bound should be at least 1.",
                max: "Row Upper Bound should be at most 50."
            }
        },




      errorClass: 'error',




      /* I had to add this code in order to make the messages pop up dynamically once I filled out a form
      It was originally working fine without this and then broke??? So I added this and now it works just fine */
      onkeyup: function(element) {
        $(element).valid();
      },




      submitHandler: function(form) {
        var clbound = parseInt($('#clbound').val());
        var cubound = parseInt($('#cubound').val());
        var rlbound = parseInt($('#rlbound').val());
        var rubound = parseInt($('#rubound').val());

        var rangeValidationResult = rangeValidation(clbound, cubound, rlbound, rubound);
        if (rangeValidationResult !== true) {
          $('#errorMessage').html('<p>Error: ' + rangeValidationResult + '</p>');
          $('#multiTable').empty(); // Remove the table
          return false;
        }

        var lowerBoundLargerResult = lowerBoundLarger(clbound, cubound, rlbound, rubound);
        if (lowerBoundLargerResult !== true) {
          $('#errorMessage').html('<p>Error: ' + lowerBoundLargerResult + '</p>');
          $('#multiTable').empty(); // Remove the table
          return false;
        }

        var numRows = rubound - rlbound + 2;
        var numCols = cubound - clbound + 2;

        multiplicationTable(clbound, rlbound, numRows, numCols);
        $('#merrorMessage').empty(); // Remove the error message

        return false;
      }
    });




    /* Here, I made and initialized my sliders with the values from my 'rules' above */
    $("#clSlider").slider({
      min: 1,
      max: 50,
      slide: function(event, ui) {
        $("#clbound").val(ui.value); /* Here, I update the value of this field */
        updateTable();
      }
    });

    $("#cuSlider").slider({
      min: 1,
      max: 50,
      slide: function(event, ui) {
        $("#cubound").val(ui.value); /* Here, I update the value of this field */
        updateTable();
      }
    });

    $("#rlSlider").slider({
      min: 1,
      max: 50,
      slide: function(event, ui) {
        $("#rlbound").val(ui.value); /* Here, I update the value of this field */
        updateTable();
      }
    });

    $("#ruSlider").slider({
      min: 1,
      max: 50,
      slide: function(event, ui) {
        $("#rubound").val(ui.value); /* Here, I update the value of this field */
        updateTable();
      }
    });




    /* Here, I update my sliders dynamically as the user changes their value */
    $("#clbound").on("input", function() {
      var value = parseInt($(this).val());
      $("#clSlider").slider("value", value);
      updateTable();
    });

    $("#cubound").on("input", function() {
      var value = parseInt($(this).val());
      $("#cuSlider").slider("value", value);
      updateTable();
    });

    $("#rlbound").on("input", function() {
      var value = parseInt($(this).val());
      $("#rlSlider").slider("value", value);
      updateTable();
    });

    $("#rubound").on("input", function() {
      var value = parseInt($(this).val());
      $("#ruSlider").slider("value", value);
      updateTable();
    });




    /* I added this function to better organize the way I update my table dynamically and check for errors before I display anything */
    function updateTable() {
        var clbound = parseInt($('#clbound').val());
        var cubound = parseInt($('#cubound').val());
        var rlbound = parseInt($('#rlbound').val());
        var rubound = parseInt($('#rubound').val());

        var rangeValidationResult = rangeValidation(clbound, cubound, rlbound, rubound);
        if (rangeValidationResult !== true) {
            $('#errorMessage').html('<p>Error: ' + rangeValidationResult + '</p>');
            $('#multiTable').empty(); /* Here, I remove the table because I got an error */
            return;
        }

        var lowerBoundLargerResult = lowerBoundLarger(clbound, cubound, rlbound, rubound);
        if (lowerBoundLargerResult !== true) {
            $('#errorMessage').html('<p>Error: ' + lowerBoundLargerResult + '</p>');
            $('#multiTable').empty(); /* Here, I remove the table because I got an error */
            return;
        }

        var numRows = rubound - rlbound + 2;
        var numCols = cubound - clbound + 2;

        multiplicationTable(clbound, rlbound, numRows, numCols);
        $('#errorMessage').empty(); /* Here, I remove the error messages from the screen */
    }



    /* I slightly changed the way that my multiplication table is displayed, but it functions exactly the same as before */
    function multiplicationTable(clbound, rlbound, numRows, numCols) {
        var multiTable = $("#multiTable");
        multiTable.empty();

        var table = $('<table>');

        var i = 0;
        var j = 0;
        var row;
        var multiCell;
        var currentRowVal;
        var currentColVal;

        for (i = 0; i < numRows; i++) {
            row = $('<tr>');

            for (j = 0; j < numCols; j++) {
                multiCell = $('<td>');

                if (i === 0 && j === 0) {
                    multiCell.html("X");
                } 
                
                else if (i === 0) {
                  currentColVal = clbound + j - 1;
                  multiCell.html(currentColVal);
                } 
                
                else if (j === 0) {
                  currentRowVal = rlbound + i - 1;
                  multiCell.html(currentRowVal);
                } 
                
                else {
                  currentRowVal = rlbound + i - 1;
                  currentColVal = clbound + j - 1;
                  multiCell.html(currentRowVal * currentColVal);
                }
                row.append(multiCell);
            }
            table.append(row);
        }
        multiTable.append(table);
    }

    function rangeValidation(clbound, cubound, rlbound, rubound) {
        if (clbound < 1 || clbound > 50) {
            return "Column Lower Bound should be between 1 and 50.";
        }

        if (cubound < 1 || cubound > 50) {
            return "Column Upper Bound should be between 1 and 50.";
        }

        if (rlbound < 1 || rlbound > 50) {
            return "Row Lower Bound should be between 1 and 50.";
        }

        if (rubound < 1 || rubound > 50) {
            return "Row Upper Bound should be between 1 and 50.";
        }

        return true;
    }



    function lowerBoundLarger(clbound, cubound, rlbound, rubound) {
        if (clbound > cubound) {
            return "Column Lower Bound is larger than the Column Upper Bound.";
        }

        if (rlbound > rubound) {
            return "Row Lower Bound is larger than the Row Upper Bound.";
        }

        return true;
    }



    /* Here, I made a function called tabTable that helps me display the current multiTable in a new tab */
    function tabTable() {
        var tableHTML = $('#multiTable').html();
        
        var tab = window.open();
        tab.document.write('<html><head><title>Your Table</title></head><body>');
        tab.document.write(tableHTML);
        tab.document.write('</body></html>');
        tab.document.close();
    }

    $('#saveTableButton').click(function() {
        tabTable();
    });

});