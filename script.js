// Get references to DOM elements
const promptInput = document.getElementById("promptInput");
const submitButton = document.getElementById("submitButton");
const responseDiv = document.getElementById("responseDiv");
const voiceButton = document.getElementById("recordButton");
const statusText = document.getElementById("status");
const transcriptTextarea = document.getElementById("transcript");

console.log("Prompt input : ", promptInput.value);

// Event listener for button click
submitButton.addEventListener("click", function (e) {
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
          responseDiv.innerHTML = `<p>${data.response}</p>`; // Display the response in a div
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
    transcriptTextarea.value = voiceInput; // Set the speech input to the textarea
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
