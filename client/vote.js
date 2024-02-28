class Poll {
    constructor(root, title) {
        this.root = root;
        this.selected = sessionStorage.getItem("poll-selected");
        this.endpoint = "http://localhost:3000/poll";

        this.root.insertAdjacentHTML("beforeend", `
            <div class="poll__title">${ title }</div>
        `);

        this._refresh();
    }

    async _refresh() {
        const response = await fetch(this.endpoint);
        const data = await response.json();

        this.root.querySelectorAll(".poll__option").forEach(option => {
            option.remove();
        });

        for (const option of data) {
            const template = document.createElement("template");
            const fragment = template.content;

            template.innerHTML = `
                <div class="poll__option ${ this.selected == option.label ? "poll__option--selected" : "" }">
                    <div class="poll__option-info">
                        <span class="poll__label">${ option.label }</span>
                    </div>
                </div>
            `;

            const pollOption = fragment.querySelector(".poll__option");
            pollOption.addEventListener("click", () => {
                this.selected = option.label;
                this._refresh();
            });
        

            this.root.appendChild(fragment);

        }

        const existingSubmitButton = this.root.querySelector("button");
        if (existingSubmitButton) {
            existingSubmitButton.remove();
        }

         const submitButton = document.createElement("button");
         submitButton.textContent = "Submit";
         submitButton.addEventListener("click", this._submit.bind(this));
         this.root.appendChild(submitButton);
    }
    _submit() {
        if (!this.selected) {
            console.error("Please select an option before submitting.");
            return;
        }

        fetch(this.endpoint,{
            method: "post",
            body: `add=${ this.selected }`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(() => {
            console.log(this.selected);
            window.location.href = "index.html";
            
        })

        // Implement the submit logic here
        console.log("Submit button clicked!");
    }
}

const poll = new Poll(
    document.querySelector(".poll"),
    "Who will win the Premier League?"
);

console.log(poll)