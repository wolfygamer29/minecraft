import { contentFilterText, stopAtLastPeriod, removeBlankLines } from "./content-filter.js";

const submitButton = document.querySelector(".submit-btn");
const entry = document.querySelector(".image-gen-entry");
const textFrame = document.querySelector(".text-frame");
const downloadButton = document.querySelector(".download-btn");
const downloadableLink = document.querySelector(".download-link");

let hugging_face_key; 

let records = [];

fetch('/env')
    .then(response => response.json())
    .then(data => {
        hugging_face_key= data.hugging_face_key;
    })
    .catch(error => {
        console.error('Error fetching environment variables:', error);
    });

async function query(data) {
  const response = await fetch(
    "https://router.huggingface.co/featherless-ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hugging_face_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
            {
                role: "user",
                content: `${data.inputs}`,
            },
        ],
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        stream: false,
      }),
    }
  );

  const result = await response.json();
  return [{"generated_text": result.choices[0].message.content}];
}

downloadButton.addEventListener('click', () => {
    const filename = "records.txt";
    let conversation = "";
    if (records.length > 0) {
        records.forEach(record => {
            conversation += record + '\n' + '\n';
        });

        const blob = new Blob([conversation], {
            type: 'text/plain;charset=utf-8'
        });
        downloadableLink.download = filename;
        downloadableLink.href = window.URL.createObjectURL(blob);
    }
})


submitButton.addEventListener('click', () => {
    submit();
});

async function submit() {
    const input = entry.value;
    if (input != "") {
        let contentValue = await contentFilterText(input);
        if (contentValue == 1) {
            query({ "inputs": input, "parameters": { "return_full_text": false } }).then(async (response) => {
                let aiContentValue = await contentFilterText(response[0].generated_text);
                if (aiContentValue == 1) {
                    const userInput = document.createElement('p');
                    userInput.classList.add("user-bubble");
                    const aiOutput = document.createElement('p');
                    aiOutput.classList.add("ai-bubble");
                    userInput.innerHTML = input;
                    let cutOff = stopAtLastPeriod(response[0].generated_text);
                    aiOutput.textContent = cutOff
                    textFrame.appendChild(userInput);
                    textFrame.appendChild(aiOutput);
                    textFrame.scrollTop = textFrame.scrollHeight;
                    entry.value = '';
                    entry.placeholder = "Ask me a question...";
                    let noBlankLines = removeBlankLines(cutOff);
                    records.push("User: " + userInput.innerHTML);
                    records.push("Ai: " + noBlankLines);
                } else {
                    setPlaceholder(aiContentValue);
                }
            });
        } else {
            setPlaceholder(contentValue);
        }

    }

}


function setPlaceholder(cv) {
    if (cv == 0) {
        entry.value = "";
        entry.placeholder = "Please be appropriate!";
    } else {
        entry.value = "";
        entry.placeholder = "There has been an error.";
    }
}


