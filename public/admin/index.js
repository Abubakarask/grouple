const checkUserLoggedIn = () => {
  const userToken = window.localStorage.getItem("userToken");
  return !!userToken;
};

const redirectIfLoggedIn = () => {
  if (checkUserLoggedIn()) {
    window.location.href = "./communication/communication.html";
  }
};

// declare the Hostname
const url = "http://localhost:3600/";

// Assign variables using DOM
const loginSignUpContainer = document.getElementById("login-signup-container");
const loginFormTemplate = document.getElementById("login-form-template");
const signUpFormTemplate = document.getElementById("signup-form-template");
const title = document.querySelector(".title");
const divider = document.querySelector(".divider");

// Function to animate elements one by one
const animateElements = () => {
  title.classList.add("animate-in");
  setTimeout(() => {
    divider.classList.add("animate-in");
  }, 500);
};

// Remove the form of the the login signup container
const removeForm = () => {
  if (loginSignUpContainer.childElementCount === 3)
    loginSignUpContainer.removeChild(loginSignUpContainer.lastElementChild);
};

// Render login/sign up form
const renderLoginForm = () => {
  removeForm();

  const loginForm = loginFormTemplate.content.cloneNode(true).firstElementChild;
  const signUpButton = loginForm.children[1];

  // add event-listener on submit to call login API
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("login-form");
    const email = form.firstElementChild.children[0].lastElementChild.value;
    const password = form.firstElementChild.children[1].lastElementChild.value;

    try {
      const response = await fetch(`${url}api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email, password } }),
      });

      if (response.status === 200) {
        const data = await response.json();

        if (
          data &&
          data.content &&
          data.content.data &&
          data.content.data.role === "admin"
        ) {
          // store userDetails and Token for Authorization in localStorage
          window.localStorage.setItem(
            "userData",
            JSON.stringify(data.content.data)
          );
          window.localStorage.setItem(
            "userToken",
            `${data.content.meta.access_token}`
          );
          window.location.href = "./communication/communication.html";
        } else {
          alert("You are not authorized to access this page.");
        }
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to login.");
    }
  });

  signUpButton.addEventListener("click", () => renderSignUpForm());

  loginSignUpContainer.appendChild(loginForm);
};

const renderSignUpForm = () => {
  removeForm();
  const signUpForm =
    signUpFormTemplate.content.cloneNode(true).firstElementChild;
  const cancelButton = signUpForm.children[1];

  //  add event-listener on submit to call user signup API
  signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("signup-form");
    const firstName = form.firstElementChild.children[0].lastElementChild.value;
    const lastName = form.firstElementChild.children[1].lastElementChild.value;
    const username = form.firstElementChild.children[2].lastElementChild.value;
    const email = form.firstElementChild.children[3].lastElementChild.value;
    const password = form.firstElementChild.children[4].lastElementChild.value;

    try {
      const response = await fetch(`${url}auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        window.localStorage.setItem("userData", JSON.stringify(data.user));
        window.localStorage.setItem("userToken", `${data.token}`);
        window.location.href = "./communication/communication.html";
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error during signup. Please try again.");
    }
  });

  cancelButton.addEventListener("click", () => renderLoginForm());

  loginSignUpContainer.appendChild(signUpForm);
};

redirectIfLoggedIn();
animateElements();
renderLoginForm();
