//asynchronous function to handle form submission for user login
const loginFormHandler = async (event) => {
    //prevent default behavior of form submission, which is a page reload
    event.preventDefault();

    //retrieve the value of username and password input fields and trim whitespace
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    
    //check if both username and password are provided
    if (username && password) {
        
        //send an asynchronous POST request to the login endpoint: see footnote #1
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json'}
        });

    if (response.ok) {
        document.location.replace('/');
        alert('Logged in!')

    } else {
        alert('Failed to log in!');
    }   
    };
};

//console.log(loginFormHandler, 'works');

const signupFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json'}
    });

if (response.ok) {
    document.location.replace('/');
    alert('Account created!')

} else {
    alert('Failed to create an account!');
}   
};



document.querySelector('#login-button').addEventListener('click', loginFormHandler);
document.querySelector('#createacct').addEventListener('click', signupFormHandler);

//footnotes
//1. An asynchronous POST request, as used in the provided code snippet, is a type of HTTP request that is sent to a server to create or update a resource. Here's a breakdown of the components involved in making an asynchronous POST request:
    //1. Fetch API: In modern JavaScript, the Fetch API is commonly used to make HTTP requests. It provides a way to fetch resources asynchronously across the network.
    //2. Request Method and URL: The method specified in the request determines the type of action the request intends to perform. In this case, the method is set to 'POST', indicating that the request is intended to create or submit data to the server. The URL specifies the endpoint where the request is sent. In the code snippet, the URL is set to '/api/users/login', indicating that the request is sent to the '/api/users/login' endpoint on the same domain.
    //3. Request Body: The data to be sent to the server is included in the request body. In this code snippet, the JSON.stringify({ username, password }) function call serializes the username and password variables into a JSON string, which is then sent as the request body. The request body typically contains data required for the server to process the request, such as form data or JSON payloads.
    //4. Request Headers: Headers provide additional information about the request, such as the content type, authorization credentials, or cookies. In the code snippet, the 'Content-Type' header is set to 'application/json' to indicate that the request body is formatted as JSON.
    //5. Response Handling: Once the server responds to the request, the response object contains information about the response, such as the status code and response body. In the code snippet, the response.ok property is checked to determine if the response status is in the range 200-299, indicating a successful response. If the response is successful, the user is redirected to the homepage (document.location.replace('/')) and an alert is displayed indicating successful login. Otherwise, an alert is displayed indicating a failed login attempt.