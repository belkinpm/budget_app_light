// === Dynamic Interface Elements ===
class List {
  constructor() {
    this.expences = [];
    this.getItems().then((data) => {
      this.expences = [...data];
      this.render();
    });
  }
  async getItems() {
    try {
      const result = await fetch(`./src/expences.json`);
      return await result.json();
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    for (let expence of this.expences) {
      const expenceBtn = new Expence(expence);
      document
        .querySelector('.buttons-group')
        .insertAdjacentHTML('beforeend', expenceBtn.renderBtn());
    }
  }
}

class Expence {
  constructor(name) {
    this.name = name;
  }
  renderBtn() {
    return `<button type="button" class="btn btn-expence fadeIn" id="${this.name}" onclick="createInput(${this.name})">+ ${this.name}</button>`;
  }
}

class Input {
  constructor(name) {
    this.name = name;
  }
  renderInput() {
    return `
    <div class="input-group fadeIn" id="${this.name}">
      <div class="input-text-group">
        <label>${this.name}:</label>
        <input class="expence input" type="text" placeholder="Input value" onblur="checkNum()" />
        <button type="button" class="btn btn-delete" onclick="deleteInput(${this.name})">&times;</button>
      </div>
      <input type="checkbox" class="check">
    </div>
  `;
  }
}

const expencesList = new List();

// === All Functions ===
function createInput(target) {
  const input = new Input(target.id);
  document
    .querySelector('.inputs-group')
    .insertAdjacentHTML('beforeend', input.renderInput());
  target.remove();
}

function deleteInput(target) {
  const expenceBtn = new Expence(target.id);
  document
    .querySelector('.buttons-group')
    .insertAdjacentHTML('beforeend', expenceBtn.renderBtn());
  target.remove();
}

function checkNum() {
  if (isNaN(event.target.value)) {
    event.target.classList.add('alert');
    event.target.previousElementSibling.classList.add('alert');
  } else {
    event.target.classList.remove('alert');
    event.target.previousElementSibling.classList.remove('alert');
  }
}

function countBudget() {
  const input = document.querySelectorAll('.input');
  const checkbox = document.querySelectorAll('.check');

  let budget = +document.querySelector('#income').value;
  let result = document.querySelector('.result');

  result.innerHTML = '';

  function getAdvice(budget, prop) {
    const advice = {
      error: `<p>Please, check red fields and enter only numbers or leave a blank fields</p>`,
      good: `<p>Congradulations!\n
            You can save ${budget} Rubles during next two weeks!</p>`,
      bad: `<p>You need to find ${budget} Rubles for next two weeks!\n
            Please, cut your expences or find additional income!`,
      tight: `<p>Your budget is very tight!\n
              You need to check your expences everyday!</p>`,
    };
    result.insertAdjacentHTML('beforeend', advice[prop]);
  }

  for (let i = 1; i < input.length; i++) {
    if (checkbox[i - 1].checked) {
      budget -= input[i].value;
    } else {
      budget -= input[i].value * 2;
    }
  }
  if (isNaN(budget)) {
    getAdvice(budget, 'error');
  } else if (budget > 0) {
    getAdvice(budget, 'good');
  } else if (budget < 0) {
    budget = budget * -1;
    getAdvice(budget, 'bad');
  } else {
    getAdvice(budget, 'tight');
  }
}

function clearAll() {
  const input = document.querySelectorAll('.input');
  const checkbox = document.querySelectorAll('.check');

  let result = document.querySelector('.result');

  for (let i = 0; i < input.length; i++) {
    input[i].value = '';
    if (checkbox[i] != undefined) checkbox[i].checked = false;
    input[i].classList.remove('alert');
    input[i].previousElementSibling.classList.remove('alert');
  }
  result.innerHTML = '';
}
