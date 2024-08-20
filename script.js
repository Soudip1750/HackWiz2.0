const chatContent = document.getElementById('chat-content');
const userInput = document.getElementById('user-input');

// Function to append messages to the chatbox
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to send user's message and process bot's response
function sendMessage(userMessage = '') {
    const message = userMessage || userInput.value.trim();
    if (message) {
        appendMessage(message, 'user');
        processBotResponse(message);
        userInput.value = '';
    }
}

// Function to process bot's responses
function processBotResponse(userMessage) {
    let botResponse = '';

    if (userMessage.toLowerCase().includes('book ticket')) {
        botResponse = "Great! When would you like to visit the museum?";
        setTimeout(() => {
            appendMessage(botResponse, 'bot');
            setTimeout(() => showCalendar(), 500); // Show calendar after response
        }, 500);
    } else if (userMessage.toLowerCase().includes('know more')) {
        botResponse = "The museum is home to a vast collection of art and historical artifacts. Would you like to know about our current exhibits or our history?";
        setTimeout(() => appendMessage(botResponse, 'bot'), 500);
    } else if (userMessage.toLowerCase().includes('date selected')) {
        botResponse = "Please choose a time slot for your visit:";
        setTimeout(() => {
            appendMessage(botResponse, 'bot');
            setTimeout(() => showTimeSlots(), 500); // Show time slots after response
        }, 500);
    } else if (userMessage.toLowerCase().includes('time selected')) {
        botResponse = "How many tickets would you like to book? Please select the number of adults and children:";
        setTimeout(() => {
            appendMessage(botResponse, 'bot');
            setTimeout(() => showTicketOptions(), 500); // Show ticket options after response
        }, 500);
    } else {
        setTimeout(() => appendMessage("I didn't quite catch that. Can you please rephrase?", 'bot'), 500);
    }
}

// Function to generate and display the calendar
function showCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const calendarElement = document.getElementById('calendar');
    
    // Clear previous content
    calendarElement.innerHTML = '';
    
    const today = new Date();
    const days = [];
    
    // Generate dates for the next 15 days excluding weekends
    for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude Sundays and Saturdays
            days.push(date);
        }
    }

    // Create calendar elements
    const calendarTable = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Date'];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    calendarTable.appendChild(headerRow);

    days.forEach(day => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = day.toDateString();
        cell.style.cursor = 'pointer';
        cell.onclick = () => selectDate(day);
        row.appendChild(cell);
        calendarTable.appendChild(row);
    });

    calendarElement.appendChild(calendarTable);
    calendarContainer.style.display = 'block';
}

// Function to handle date selection
function selectDate(date) {
    const formattedDate = date.toDateString();
    appendMessage(`Selected date: ${formattedDate}`, 'user');
    document.getElementById('calendar-container').style.display = 'none';
    sendMessage('date selected'); // Notify bot that date is selected
}

// Function to show time slots
function showTimeSlots() {
    const timeContainer = document.createElement('div');
    timeContainer.classList.add('time-container');
    
    const timeSlots = [
        '10:00 AM - 11:00 AM', 
        '11:00 AM - 12:00 PM', 
        '12:00 PM - 01:00 PM', 
        '01:00 PM - 02:00 PM', 
        '02:00 PM - 03:00 PM', 
        '03:00 PM - 04:00 PM', 
        '04:00 PM - 05:00 PM', 
        '05:00 PM - 06:00 PM'
    ];
    
    timeSlots.forEach(slot => {
        const button = document.createElement('button');
        button.textContent = slot;
        button.onclick = () => selectTime(slot);
        timeContainer.appendChild(button);
    });

    chatContent.appendChild(timeContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to handle time slot selection
function selectTime(time) {
    appendMessage(`Selected time: ${time}`, 'user');
    document.querySelector('.time-container').remove(); // Remove time slots after selection
    sendMessage('time selected'); // Notify bot that time is selected
}

// Function to show ticket options
function showTicketOptions() {
    const ticketContainer = document.createElement('div');
    ticketContainer.classList.add('ticket-container');

    // Create and style dropdown for Adults
    const adultsLabel = document.createElement('label');
    adultsLabel.textContent = 'Number of Adults:';
    adultsLabel.classList.add('dropdown-label');
    const adultsSelect = document.createElement('select');
    adultsSelect.classList.add('dropdown');
    for (let i = 0; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        adultsSelect.appendChild(option);
    }
    adultsLabel.appendChild(adultsSelect);
    ticketContainer.appendChild(adultsLabel);

    // Create and style dropdown for Children
    const childrenLabel = document.createElement('label');
    childrenLabel.textContent = 'Number of Children:';
    childrenLabel.classList.add('dropdown-label');
    const childrenSelect = document.createElement('select');
    childrenSelect.classList.add('dropdown');
    for (let i = 0; i <= 3; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        childrenSelect.appendChild(option);
    }
    childrenLabel.appendChild(childrenSelect);
    ticketContainer.appendChild(childrenLabel);

    // Create and style the Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submit-button');
    submitButton.onclick = () => {
        const adultsCount = parseInt(adultsSelect.value, 10);
        const childrenCount = parseInt(childrenSelect.value, 10);
        appendMessage(`Number of Adults: ${adultsCount}, Number of Children: ${childrenCount}`, 'user');
        const adultPrice = 20;
        const childPrice = 10;
        const totalAmount = (adultsCount * adultPrice) + (childrenCount * childPrice);
        
        appendMessage(`Ticket Prices: Adult - 20 Rs, Child - 10 Rs`, 'bot');
        setTimeout(() => {
            appendMessage(`Total Amount to be paid: ${totalAmount} Rs`, 'bot');
            ticketContainer.remove(); // Remove ticket options after showing total amount
            showPaymentOptions();
        }, 500);
    };
    ticketContainer.appendChild(submitButton);

    chatContent.appendChild(ticketContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
    };

// Function to show payment method options
function showPaymentOptions() {
    const paymentContainer = document.createElement('div');
    paymentContainer.classList.add('payment-container');

    // Create and style UPI option
    const upiButton = document.createElement('button');
    upiButton.textContent = 'UPI';
    upiButton.classList.add('payment-button');
    upiButton.onclick = () => handlePaymentOption('UPI');

    // Create and style Card option
    const cardButton = document.createElement('button');
    cardButton.textContent = 'Card';
    cardButton.classList.add('payment-button');
    cardButton.onclick = () => handlePaymentOption('Card');

    // Create and style Net Banking option
    const netBankingButton = document.createElement('button');
    netBankingButton.textContent = 'Net Banking';
    netBankingButton.classList.add('payment-button');
    netBankingButton.onclick = () => handlePaymentOption('Net Banking');

    paymentContainer.appendChild(upiButton);
    paymentContainer.appendChild(cardButton);
    paymentContainer.appendChild(netBankingButton);

    chatContent.appendChild(paymentContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to handle payment option selection
function handlePaymentOption(method) {
    appendMessage(`Selected payment method: ${method}`, 'user');
    document.querySelector('.payment-container').remove(); // Remove payment options after selection
    // Add logic to process the selected payment method or continue the conversation
}

// Function to greet the user when the page loads and show options
function greetUser() {
    const welcomeMessage = "Welcome to the Museum Chatbot Ticketing System! How can I assist you today?";
    appendMessage(welcomeMessage, 'bot');

    setTimeout(() => showOptions(), 1000);
}

// Function to show clickable options
function showOptions() {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const option1 = document.createElement('button');
    option1.textContent = "Book Ticket";
    option1.onclick = () => sendMessage('Book Ticket');

    const option2 = document.createElement('button');
    option2.textContent = "Know More About Museum";
    option2.onclick = () => sendMessage('Know More About Museum');

    optionsContainer.appendChild(option1);
    optionsContainer.appendChild(option2);

    chatContent.appendChild(optionsContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Automatically greet the user when the page loads
window.onload = greetUser;

// Send message when the "Enter" key is pressed
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
