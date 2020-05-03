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
        <input class="expence input" type="text" placeholder="Input value" onblur="dataCollector()" />
        <button type="button" class="btn btn-delete" onclick="deleteInput(${this.name})">&times;</button>
      </div>
      <div class="switch-wrap">
        <input type="checkbox" class="check" onblur="weekChange()"/>
        <div class="switch"></div>
      </div>
    </div>
  `;
  }
}

// === Render Elements ===
const expencesList = new List();

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
  delete inputData[target.id];
}

// === Data Collection ===
const inputData = {};

function dataCollector() {
  let parent = event.target.parentElement;
  let label = parent.querySelector('label');
  let checkbox = parent.parentElement.querySelector('.check');

  if (isNaN(event.target.value)) {
    event.target.classList.add('alert');
    if (label) {
      label.classList.add('alert');
    }
  } else {
    event.target.classList.remove('alert');
    if (label) {
      label.classList.remove('alert');
      inputData[parent.parentElement.id] = {
        value: +event.target.value,
        week: checkbox.checked,
      };
    } else {
      inputData[event.target.id] = +event.target.value;
    }
  }
}

function weekChange() {
  let parent = event.target.parentElement.parentElement;
  if (inputData[parent.id] !== undefined) {
    inputData[parent.id].week = !inputData[parent.id].week;
  } else {
    inputData[parent.id] = {
      value: 0,
      week: event.target.checked,
    };
  }
}

// === Count & Clear ===
function countBudget() {
  let result = document.querySelector('.result');
  let budget = inputData.income;
  result.innerHTML = '';
  
  for (let key in inputData) {
    if (key != 'income') {
      if (inputData[key].week) {
        budget -= inputData[key].value;
      } else {
        budget -= inputData[key].value * 2;
      }
    }
  }

  function getAdvice(budget, property) {
    const advice = {
      error: `<p>Please, check red fields and enter only numbers or leave a blank fields.</p>`,
      empty: `<p>Income field is empty!<br>
            Please, fill in at least this field.</p>`,
      good: `<p>Congradulations!<br>
            You can save ${budget} Rubles during next two weeks!</p>`,
      bad: `<p>You need to find ${budget} Rubles for next two weeks!<br>
            Please, cut your expences or find additional income!`,
      tight: `<p>Your budget is very tight!<br>
              You need to check your expences everyday!</p>`,
    };
    result.insertAdjacentHTML('beforeend', advice[property]);
  }

  location.href = '#result';

  if (isNaN(budget) && budget) {
    getAdvice(budget, 'error');
  } else if (!budget && budget !== 0) {
    getAdvice(budget, 'empty');
  } else if (budget > 0) {
    getAdvice(budget, 'good');
  } else if (budget < 0) {
    budget = -budget;
    getAdvice(budget, 'bad');
  } else {
    getAdvice(budget, 'tight');
  }
}

function clearAll() {
  const inputs = document.querySelectorAll('.input');
  document.querySelector('.result').innerHTML = '';

  for (let input of inputs) {
    input.classList.remove('alert');
    input.previousElementSibling.classList.remove('alert');
  }

  for (let key in inputData) {
    delete inputData[key];
  }
}
