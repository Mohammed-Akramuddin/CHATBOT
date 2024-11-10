$(document).ready(function () {
    $("#messageArea").on("submit", function (event) {
        event.preventDefault();
        const date = new Date();
        const str_time = date.getHours() + ":" + date.getMinutes();
        var rawText = $("#text").val();

        // User message HTML
        var userHtml =
            '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' +
            rawText +
            '<span class="msg_time_send">' +
            str_time +
            '</span></div><div class="img_cont_msg"><img src="https://i.ibb.co/d5b84Xw/Untitled-design.png" class="rounded-circle user_img_msg"></div></div>';

        $("#text").val("");  // Clear the input field
        $("#messageFormeight").append(userHtml);  // Add user message to chat
        scrollToBottom();  // Scroll to the bottom of the chat

        // Show loading indicator
        $("#loadingIndicator").show();

        // AJAX request to Flask server
        $.ajax({
            type: "POST",
            url: "/get",
            contentType: "application/json",  // Set the content type to JSON
            data: JSON.stringify({ msg: rawText }),  // Send message as JSON
            success: function (data) {
                // Hide loading indicator
                $("#loadingIndicator").hide();

                // Bot response HTML
                var botHtml =
                    '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' +
                    data.response +
                    '<span class="msg_time">' +
                    str_time +
                    "</span></div></div>";

                $("#messageFormeight").append($.parseHTML(botHtml));  // Add bot response to chat
                scrollToBottom();  // Scroll to the bottom of the chat
            },
            error: function (error) {
                // Hide loading indicator if error occurs
                $("#loadingIndicator").hide();

                console.error("Error:", error);

                // Display error message in chat
                var errorHtml = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">Error getting response from bot.<span class="msg_time">' + str_time + '</span></div></div>';
                $("#messageFormeight").append($.parseHTML(errorHtml));
                scrollToBottom();  // Scroll to the bottom of the chat
            }
        });
    });
});

// Microphone Button for Speech Recognition
document.getElementById("micBtn").addEventListener("click", function () {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";  // Set language
    recognition.continuous = true; // Keep recognizing until stopped
    recognition.interimResults = false; // Don't show interim results

    // Start recognition
    recognition.start();

    recognition.onstart = function () {
        console.log("Speech recognition started.");
    };

    recognition.onspeechend = function () {
        console.log("Speech recognition ended.");
        recognition.stop();
    };

    recognition.onerror = function (event) {
        console.error("Error occurred in speech recognition: " + event.error);
        alert("An error occurred with the microphone: " + event.error);  // Alert for better error visibility
    };

    recognition.onresult = function (event) {
        var transcript = event.results[event.resultIndex][0].transcript;
        console.log("You said: " + transcript);

        // Optionally, add the transcript to the input field
        document.getElementById("text").value = transcript;
    };
});

function scrollToBottom() {
    var chatContainer = $("#messageFormeight");
    chatContainer.scrollTop(chatContainer[0].scrollHeight);
}
