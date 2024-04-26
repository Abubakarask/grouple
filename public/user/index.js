const checkUserLoggedIn = () => {
  const userToken = window.localStorage.getItem("userToken");
  return !!userToken;
};

const redirectIfLoggedIn = () => {
  if (checkUserLoggedIn()) {
    window.location.href = "./booking/booking.html";
  }
};

// declare the Hostname
const url = "http://localhost:3600/";

// Assign variables using DOM
const loginSignUpContainer = document.getElementById("login-signup-container");
const loginFormTemplate = document.getElementById("login-form-template");
const anyQueryBtn = document.getElementById("query-button");
const title = document.querySelector(".title");
const divider = document.querySelector(".divider");

// Function to animate elements one by one
const animateElements = () => {
  title.classList.add("animate-in");
  setTimeout(() => {
    divider.classList.add("animate-in");
  }, 500);
};

anyQueryBtn.addEventListener("click", () => {
  window.location.href = "./communication/communication.html";
});

// Remove the form of the the login signup container
const removeForm = () => {
  if (loginSignUpContainer.childElementCount === 3)
    loginSignUpContainer.removeChild(loginSignUpContainer.lastElementChild);
};

// Render login/sign up form
const renderLoginForm = () => {
  removeForm();

  const loginForm = loginFormTemplate.content.cloneNode(true).firstElementChild;

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
          data.content.data
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
          window.location.href = "./booking/booking.html";
        } else {
          alert("Something went wrong. Please try again later.");
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

  loginSignUpContainer.appendChild(loginForm);
};

redirectIfLoggedIn();
animateElements();
renderLoginForm();
