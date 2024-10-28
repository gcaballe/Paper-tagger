document.addEventListener('DOMContentLoaded', function () {
  
    var idStack = []; //per poder tornar endarrere

    window.toggleQuestions = function(question, answer) {

        //check if user is set
        var userInput = document.getElementById('user').value.trim();
        if (!userInput) {
            alert("Recorda entar l'usuari!");
            return;
        }

        // Get the second and third question elements
        var question2 = document.getElementById("question2-container");
    
        if (question === 1) {
            // For question 1: 'si' shows question 2, 'no' does nothing
            if (answer === 'si') {
                question2.style.display = "block";
            }
            else if (answer === 'no') {
                updatePaperFunction(1, 'no');
            }
            else if (answer === 'skip') {
                updatePaperFunction(1, 'skip');
            }
        } else if (question === 2) {
            // For question 2: 'no' shows question 3, 'si' does nothing
            if (answer === 'si') {
                updatePaperFunction(2, 'si');
            }
            else if (answer === 'no') {
                updatePaperFunction(2, 'no');
            }
            else if (answer === 'no-especificat') {
                updatePaperFunction(2, 'no-especificat');
            }
            else if (answer === 'skip') {
                updatePaperFunction(2, 'skip');
            }
        }
    };


  window.updatePaperFunction = function(question, answer) {

    console.info('Start of updatePaperFunction()');
    console.info(question);
    console.info(answer);
    // Get the value of the hidden input field for numero_identificador
    var identificador = document.getElementById('identificador_numeric').value;
    var user = document.getElementById('user').value;

    // Prepare data for the SQL update request
    var data = {
        'numero_identificador': identificador,
        'estat': 'tagged', // You can keep this if necessary
        'user': user,
        'pregunta1': false,
        'pregunta2': false,
        'pregunta3': false
    };

    // Determine the values of pregunta1 and pregunta2 based on input
    if (question === 1) {
        if (answer === 'si') {
            //Do nothing to the BD, just show question2
            return;
        } else if (answer === 'no') {
            data.pregunta1 = true;
        } else if (answer === 'skip') {
            data.pregunta1 = null;
            data.pregunta2 = null;
            data.pregunta3 = null;
            data.estat = 'pending';
        }
    } else if (question === 2) {
        if (answer === 'si') {
            //insitu
            data.pregunta1 = true;
            data.pregunta2 = true;
            data.pregunta3 = false;
        } else if (answer === 'no') {
            //invasiu
            data.pregunta1 = true;
            data.pregunta2 = false;
            data.pregunta3 = true;
        } else if (answer === 'no-especificat') {
            data.pregunta1 = true;
            data.pregunta2 = false;
            data.pregunta3 = false;
        }
    } else if (question === 'flag') {
        data.estat = 'flagged';
        data.pregunta1 = null;
        data.pregunta2 = null;
        data.pregunta3 = null;
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
  
    var j = JSON.stringify(data);
    console.info(j);
    xhr.send(j);

 }
   
 window.fetchText = function(id) {

    const xhr = new XMLHttpRequest();

    if(id == null) {
        xhr.open('GET', 'fetch_text.php', true); // Fetch data from fetch_text.php
    }else {
        xhr.open('GET', 'fetch_text.php?id='+id, true); // Fetch data from fetch_text.php
    }

    document.getElementById("question2-container").style.display = "none";

    xhr.onload = function () {
      
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            // Agafo el valor vell, per poder tirar endarrere
            idStack.push(response.identificador_numeric);

            // On success, fill the textarea with the response text
            document.getElementById('paper_text').value = response.text;
            document.getElementById('identificador_numeric').value = response.identificador_numeric;

        } else {
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

 window.toggleExplanations = function() {
    // Get all elements with the class 'explanation'
    var explanations = document.querySelectorAll('.explanation');
    var current = document.querySelectorAll('.explanation')[0].style.display;
    console.info(current);
    // Toggle the visibility of each explanation
    explanations.forEach(function(e) {
        if (current == "block" || current == "") {
            e.style.display = "none"; // Show the explanation
        } else {
            e.style.display = "block"; // Hide the explanation
        }
    });
  };

    //Now its the code to save the username as a cookie
    // Function to set a cookie
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Load user input from cookies on page load
    window.addEventListener('load', function() {
        var savedUser = getCookie('user');
        if (savedUser) {
            document.getElementById('user').value = savedUser;
        }
    });

    // Save user input to cookies on change
    document.getElementById('user').addEventListener('change', function() {
        setCookie('user', this.value, 7); // Store for 7 days
    });


    window.goBackButton = function() {
        
        if(idStack.length == 1) return;
        
        idStack.pop(); //llenço l'actual TOP
        lastNumeroIdentificador = idStack.pop(); // agafo el d'abans
        
        fetchText(lastNumeroIdentificador);
        
    }

});