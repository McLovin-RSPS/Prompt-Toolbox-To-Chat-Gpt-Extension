chrome.storage.local.get(["prompts"], function (result) {
    if (result.prompts) {
      let promptsList = document.getElementById("prompts");
      result.prompts.forEach(prompt => {
        let li = document.createElement("li");
        li.innerText = prompt;
        promptsList.appendChild(li);
      });
    }
  });