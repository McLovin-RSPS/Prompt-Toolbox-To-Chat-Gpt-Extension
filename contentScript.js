// Extract all prompts from the Promptoolbox website
function extractPrompts() {
  let prompts = [];
  let clipboardButtons = document.querySelectorAll("[id^='kt_clipboardicon_']");
  clipboardButtons.forEach(button => {
    let targetId = button.getAttribute("data-clipboard-target");
    let targetElement = document.querySelector(targetId);
    if (targetElement) {
      prompts.push(targetElement.innerText.trim());
    }
  });
  return prompts;
}

// Store the extracted prompts using message passing
function storePrompts(prompts) {
  chrome.runtime.sendMessage({ action: "storePrompts", data: prompts });
}

// Send prompts to Chat GPT one by one
function relayToChatGPT(prompts) {
  let regenerateButtonSelector = 'button.btn-neutral';
  let promptIndex = 0;

  function sendNextPrompt() {
    if (promptIndex < prompts.length) {
      let textarea = document.getElementById("prompt-textarea");
      if (textarea) {
        textarea.value = prompts[promptIndex];
        promptIndex++;
        let event = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        textarea.dispatchEvent(event);
      }
    }
  }

  // Check for the regenerate button to reappear
  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        for (let node of mutation.addedNodes) {
          if (node.matches && node.matches(regenerateButtonSelector)) {
            sendNextPrompt();
          }
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  sendNextPrompt();
}

// Main function to handle the logic based on the website
function main() {
  if (window.location.host === "prompttoolbox.com") {
    let prompts = extractPrompts();
    storePrompts(prompts);
  } else if (window.location.host === "chat.openai.com") {
    chrome.runtime.sendMessage({ action: "getPrompts" }, function(response) {
      if (response && response.prompts) {
        relayToChatGPT(response.prompts);
      }
    });
  }
}

// Execute the main function
main();