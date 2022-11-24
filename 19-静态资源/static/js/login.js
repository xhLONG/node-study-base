const $submit1 = document.querySelector("#submit1");
const $submit2 = document.querySelector("#submit2");

$submit1.addEventListener("click", () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  fetch(`/api/login?username=${username}&password=${password}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
});
$submit2.addEventListener("click", () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  fetch(`/api/loginpost`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
});
