const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  //Validation
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  //check for edit mode
  if (isEditMode) {
    //remove old item
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();

    isEditMode = false;
    //insert new item
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists');
      return;
    }
  }
  //create item dom element
  addItemToDom(newItem);

  //add item to local storage
  addItemToStorage(newItem);

  resetUI();
  itemInput.value = '';
}

function addItemToDom(item) {
  //create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  // convert to json string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  //filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => {
    if (i !== item) {
      return i;
    }
  });
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItem(item) {
  if (confirm('Are you sure you want to delete this item?')) {
    //remove item from dom
    item.remove();

    //remove item from storage.
    removeItemFromStorage(item.firstChild.textContent);
    resetUI();
  }
}

function setItemToEditMode(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEditMode(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //Clear from localStorage
  localStorage.removeItem('items');
  resetUI();
}

function filterItems(e) {
  e.preventDefault();
  // get all list items
  // filter that array based on the search string
  // replace list items with new filter?
  const text = e.target.value.toLowerCase();
  const items = document.getElementById('item-list').querySelectorAll('li');

  const newList = items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function resetUI() {
  itemInput.value = '';
  const itemList = document.getElementById('item-list').querySelectorAll('li');
  if (itemList.length === 0) {
    clearBtn.classList.add('disabled');
    itemFilter.classList.add('disabled');
  } else {
    clearBtn.classList.remove('disabled');
    itemFilter.classList.remove('disabled');
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDom(item);
  });
  resetUI();
}

// initialize app

function init() {
  //Event Listners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  itemFilter.addEventListener('input', filterItems);
  clearBtn.addEventListener('click', clearItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  resetUI();
}

init();
