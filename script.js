// Get references to DOM elements
const promptInput = document.getElementById("promptInput");
const submitButton = document.getElementById("submitButton");
const responseDiv = document.getElementById("responseDiv");
const voiceButton = document.getElementById("recordButton");
const statusText = document.getElementById("status");
const modal = document.getElementById("questionModal");
const transcriptTextarea = document.getElementById("transcript");
// Initialize the global object
const feedback = {};


console.log("Prompt input : ", promptInput.value);
let questionObject={}
let isQuestionReady=false;

// Event listener for button click
submitButton.addEventListener("click", function (e) {
  document.getElementById('responseDiv').innerText="Loading...";
  e.preventDefault();
  const prompt = promptInput.value.trim(); // Get the value of the prompt input

  if (prompt) {
    console.log("inside if ", prompt);
    
    // Send the prompt to the backend API
    fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }), // Send the prompt as JSON
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        // If response contains the message, display it
        if (data.response) {
          questionObject=data.response;
          isQuestionReady=true;
          // document.getElementById("questionText").innerHTML=data.response["question1"];
          // responseDiv.innerHTML = `<p>${data.response}</p>`; // Display the response in a div
         if(isQuestionReady){
          responseDiv.innerHTML=`<div>
          <p>Question is ready Please click on start button to ask questions</p>
          <button id="startButton" onclick="askQuestion()">Start</button>
          </div>`
         }else{
          responseDiv.innerHTML=`<div>
         <p>Please enter a prompt</p>
          </div>`
         }
        } else {
          responseDiv.innerHTML = "<p>No response from API.</p>"; // In case response is empty
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        responseDiv.innerHTML =
          "<p>Something went wrong. Please try again.</p>"; // Error handling
      });
  } else {
    alert("Please enter a prompt."); // If no prompt is entered
  }
});

// Speech-to-Text (STT) functionality
voiceButton.addEventListener("click", function () {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onstart = function () {
    statusText.textContent = "Listening..."; // Update status while listening
  };

  recognition.onresult = function (event) {
    const voiceInput = event.results[0][0].transcript;
    promptInput.value = voiceInput; // Set the speech input to the textarea
    console.log("Voice Input: " + voiceInput);
    statusText.textContent = "Speech recognized."; // Update status after recognition
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
    statusText.textContent = "Error occurred. Please try again.";
  };

  recognition.onend = function () {
    statusText.textContent = "Click to start speaking..."; // Reset status when recognition ends
  };
});

async function askQuestion() {
  const questions = Object.values(questionObject);
  answerInput.value = ""; // Clear previous answer
  modal.style.display = "block";
  for (let i = 0; i < questions.length; i++) {
    console.log(questions[i]);
    document.getElementById("questionText").innerHTML = questions[i];

    // Wait for user response or a button click
    await waitForUserResponse(questions[i]);
  }
  console.log("All questions asked!");
  document.getElementById('responseDiv').innerText=formatFeedback(feedback);
  console.log(feedback);
  modal.style.display = "none";
}
// Helper function to wait for user input (e.g., button click)
function waitForUserResponse(question) {
  return new Promise((resolve) => {
    document.getElementById("submitAnswer").onclick = () => {
      console.log("User answered:", document.getElementById("answerInput").value);
      addFeedback(question, document.getElementById("answerInput").value);
      document.getElementById("answerInput").value="";
      resolve();
    };
    document.getElementById("dontKnow").onclick = () => {
      console.log("User clicked Don't Know");
      addFeedback(question, "Don't Know");
      document.getElementById("answerInput").value="";
      resolve();
    };
  });
}
// Function to add feedback
function addFeedback(question, answer) {
  const index = Math.floor(Object.keys(feedback).length / 2) + 1;
  feedback[`question${index}`] = question;
  feedback[`answer${index}`] = answer;
}
function formatFeedback(feedbackObject) {
  let formattedText = ""; // Initialize an empty string

  // Loop through the object and format each pair
  Object.keys(feedbackObject).forEach((key, index) => {
    if (key.startsWith("question")) {
      const questionNumber = key.replace(/[^\d]/g, ""); // Extract the number
      const answerKey = `answer${questionNumber}`;

      // Append to the formatted string
      formattedText += `Question ${questionNumber}: ${feedbackObject[key]}\n`;
      if (feedbackObject[answerKey]) {
        formattedText += `Answer ${questionNumber}: ${feedbackObject[answerKey]}\n\n`;
      }
    }
  });

  return formattedText.trim(); // Return the formatted string
}



