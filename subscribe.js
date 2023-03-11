var feed = document.currentScript.getAttribute('id');
//feed = "1673028820612x967958810908426200" //Unique ID of Feed 

//This creates the button and the input box
async function createSubscriptionForm() {

async function getFeedButtonColor() {
        const response = await fetch(`https://flow-post.bubbleapps.io/version-test/api/1.1/wf/return-feed-color?feed=${feed}`);
        const data = await response.json();
        console.log(data)
        return data;
    }

const feedResponse = await getFeedButtonColor();
const buttonColor = feedResponse.button_color;
//console.log(buttonColor)
  
var container = document.createElement("div"); 
const style = document.createElement('style');

container.style.display = "flex";
container.style.flexDirection = "column";
container.style.width = "auto";
container.style.height = "auto";
container.style.marginLeft = "auto";
container.style.marginRight = "auto";

style.innerHTML = `

html, body {
    height: 100%;
    margin: 0;
}

.button {
    font-family: 'Inter', sans-serif;
    font-size:16px;
    margin-left: 8px !important;
    margin-bottom: 0px !important;
    background-color: ${buttonColor}; 
    color: white; 
    padding: 12px 20px; border: 
    none; cursor: pointer;
    border-radius: 5px;
    height:50px;
    width:150px;

}

.button:hover { 
    font-family: 'Inter', sans-serif;
    font-size:16px;
    margin: 0px 0px 0px 8px !important;
    background-color: ${buttonColor}; 
    color: white; 
    padding: 12px 20px; border: 
    none; cursor: pointer;
    border-radius: 5px;
    height:50px;
    width:150px;
}

.container {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    padding: 0px !important;
    flex-direction: row;
}


input[type=text] {
    font-family: 'Inter', sans-serif;
    font-size:16px;
    width:300px;
    height: 50px;
    padding: 0 12px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
}

input[type=text]:focus {
    border-color: ${buttonColor};
    outline: none;
}

input[type=text]:hover {
    border-color: ${buttonColor};
    transition: border-color 0.2s ease-in-out;
}

input[type=email]:focus {
    border-color: ${buttonColor};
    outline: none;
}

input[type=email]:hover {
    border-color: ${buttonColor};
    transition: border-color 0.2s ease-in-out;
}

input::placeholder {
  color: #ababab;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

#modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  
}

/* Modal Content */
#modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  max-width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the modal */
  border-radius:5px;
}

#modal-content #image {
  max-width: 100px; /* or specify a specific width */
  height: auto; /* or specify a specific height */
}

.modal-form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.modal-label {
    font-size:12px;
    color:#797979;
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    text-align:left;
    width: 100%;
}

.modal-input[type=text] {
    text-align:left;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0px 10px 0px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.modal-input[type=email] {
    text-align:left;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0 ;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

#submit-btn {
    width: 100%;
    height: 50px;
    font-family: 'Inter', sans-serif;
    font-size:16px;
    padding: 0 12px;
    margin: 8px 0;
    box-sizing: border-box;
    background-color: ${buttonColor};
    color:#ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}

#modal::before {
    content: "";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5); /* Black w/ opacity */
}

p {
  font-family: 'Inter', sans-serif;
  font-size:16px;
  color: #111111;
  margin-bottom:20px !important;
}

h2 {
  font-family: 'Inter', sans-serif;
  color: #111111;
text-align:center;
}

`;

document.head.appendChild(style);

const htmlString = 
    `
<div class="container">
    <input type="text" id="input-box" placeholder="Enter your email"/>
    <button class="button" id="open-modal-btn" onclick="createSubscriber()">Subscribe</button>
</div>
<div id="modal">
  <div id="modal-content">
    <div style="display: flex; justify-content: space-between;">
      <image id="image" src="https://s3.amazonaws.com/appforest_uf/f1667091152813x346384772643866500/AdobeStock_240043850.jpeg" style="margin: auto;"> 
        <!-- <span id="close-modal" onclick="closeModal()" style="cursor: pointer; font-size: 30px;">&times;</span> -->
    </div>
    <h2>Thanks for Subscribing!</h2>
    <p>Complete the details below and you'll be notified when anything new is added to the feed.<p>
    <form id="modal-form">
      <label class="modal-label">First Name</label>
      <input class="modal-input" type="text" id="firstName" placeholder="Enter your first name">
      <label class="modal-label">Last Name</label>
      <input class="modal-input" type="text" id="lastName" placeholder="Enter your last name">
      <label class="modal-label" >Email</label>
      <input class="modal-input" type="email" id="modal-email" placeholder="Enter your email">
      <input type="submit" id="submit-btn" value="Submit">
    </form>
  </div>
</div>`;


container.innerHTML = htmlString;
document.body.appendChild(container);
document.getElementById("modal-form").addEventListener("submit", updateSubscriber);

}

function openModal() {

  // Get the modal by its ID
  var modal = document.getElementById("modal");
  var email = document.getElementById("input-box").value;
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-email").value = email;

  // Change the display property to "block" to make the modal visible
  modal.style.display = "block";

}

//this opens the popup when the input emai is clicked
function closeModal() {
  // Get the modal by its ID
  var modal = document.getElementById("modal");

  // Change the display property to "none" to make the modal hidden
  modal.style.display = "none";
}


function createSubscriber() {
    // Get the input field value
    var email = document.getElementById("input-box").value;
 
    // Validation rules
    if (!email) {
        alert("Email cannot be empty");
        return;
    }
    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }

    var form = document.getElementById("modal-form");
    if (form) {
        form.addEventListener("submit", updateSubscriber);
    } else {
        console.log('The form element is not present in the modal');
    }
    
    fetch('https://flow-post.bubbleapps.io/version-test/api/1.1/wf/create-subscriber-embed', {
        method: 'POST',
        body: JSON.stringify({email: email,feed: feed}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            openModal();
        } else {
            alert("An error occurred: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function updateSubscriber(event) {
    event.preventDefault();
    //console.log('The update subscriber function was called!')
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var emailModal = document.getElementById("modal-email").value;
    const response = await fetch('https://flow-post.bubbleapps.io/version-test/api/1.1/wf/update-embed-subscriber', {
        method: 'POST',
        body: JSON.stringify({email:emailModal,feed:feed,first_name:firstName,last_name:lastName}),
        headers: {'Content-Type':'application/json'}
    })
    const data = await response.json();
    console.log(data);
    if (data.success) {
      document.getElementById("modal").style.display = "none";
      function updateAlert() {
    alert("Your subscription has been updated!");
    } setTimeout(updateAlert,1000);
    } else {
        alert("An error occurred: " + data.message);
    }
}

createSubscriptionForm();
