document.addEventListener('DOMContentLoaded', function () {
  
  window.toggleQuestion2 = function(answer) {
    // Get the second question element
    var question2 = document.getElementById("question2-container");

    // Check if the answer is 'si'
    if (answer === 'si') {
        // If the answer is 'si', show the second question
        question2.style.display = "block";
    } else {
        // Otherwise, hide the second question
        question2.style.display = "none";
    }
  };


  window.updatePaperFunction = function(question, answer) {

    // Get the value of the hidden input field for numero_identificador
    var identificador = document.getElementById('identificador_numeric').value;

    // Prepare data for the SQL update request
    var data = {
        'numero_identificador': identificador,
        'estat': 'tagged', // You can keep this if necessary
        'pregunta1': false, // Default value
        'pregunta2': false  // Default value
    };

    // Determine the values of pregunta1 and pregunta2 based on input
    if (question === 1) {
        if (answer === 'no') {
            data.pregunta1 = false; // Update pregunta1 to false for question 1
            data.pregunta2 = false;
        } else if (answer === 'si') {
            data.pregunta1 = true; // Do nothing (just set it to true if you want)
        }
    } else if (question === 2) {
        data.pregunta1 = true; // Always true if question 2 is asked
        if (answer === 'no') {
            data.pregunta2 = false; // Update pregunta2 to false for question 2
        } else if (answer === 'si') {
            data.pregunta2 = true; // Update pregunta2 to true for question 2
        }
    }

    // Make the AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "update_paper.php", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Response handling, if needed
            console.log(xhr.responseText);

            fetchText();
        }
    };
  
    xhr.send(JSON.stringify(data));

 }
   
 window.fetchText = function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'fetch_text.php', true); // Fetch data from fetch_text.php

    var question2 = document.getElementById("question2-container");
    question2.style.display = "none";

    xhr.onload = function () {
      
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            // On success, fill the textarea with the response text
            document.getElementById('paper_text').value = response.text;
            document.getElementById('identificador_numeric').value = response.identificador_numeric;
        } else {
            console.info('fora');
            // If an error occurs, log it
            console.error('Error fetching data: ' + xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed');
    };

    xhr.send(); // Send the request
 }

    // Automatically fetch the text when the page loads
  window.onload = function () {
    fetchText();
 };

});