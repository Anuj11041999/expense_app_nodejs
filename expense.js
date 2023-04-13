

async function getData() {
  const response = await axios.get('http://localhost:3000/expense/');
  return response;
}

async function postData(data) {
const response = await axios.post('http://localhost:3000/expense/add',data);

return response.data;
}

async function updateData(data,id) {
  const response = await axios.post(`http://localhost:3000/edit/${id}`, data);
  return response.data;
}
async function deleteTask(id) {
const response = await axios.post(`http://localhost:3000/delete/${id}`);
console.log(response)
return response;
}


document.addEventListener("DOMContentLoaded",async ()=>{
  const form = document.getElementById('form');
  const list = document.getElementById('expenses');

  await loadContent();
  const submit = form.querySelector('#submit')
  submit.addEventListener('click',event=>handleSubmit(event,form));
  list.addEventListener('click',handleList);
  
  async function loadContent(){
      try{
          const response = await getData();
          renderHtml(response.data);
      }catch(e){
          console.log(e);
      }
  }
  async function renderHtml(res){
      for (const expense of res) {

          createList(expense);
        }
  }
  function createList(expense){
      const listItem = document.createElement('li');
          listItem.innerHTML = `
            <span>${expense.amount}</span>
            <span>${expense.description}</span>
            <span>${expense.category}</span><br>
            <button class="edit-button" data-id="${expense.id}">Edit</button>
            <button class="delete-button" data-id="${expense.id}">Delete</button>
          `;
          list.appendChild(listItem);
  }
  async function handleSubmit(event,form){
      event.preventDefault();
      const amountSpan = form.querySelector('#amount');
      const descriptionSpan = form.querySelector('#description');
      const categorySpan = form.querySelector('#category');
      const amount = amountSpan.value;
      const description = descriptionSpan.value
      const category = categorySpan.value

      if (!amount || !description || !category) {
        alert('Please enter all the details');
        return;
      }
      try{
          const obj ={amount,description,category}
          const res = await postData(obj);
          const newexpense = res;
          amountSpan.value ='';
          descriptionSpan.value ='';
          categorySpan.value ='';

          createList(newexpense);
      }catch(e){
          console.log(e);
      }
  }
  async function handleList(event) {
      // Handle clicks on the delete button
      if (event.target.classList.contains('delete-button')) {
        event.preventDefault();
        const id = event.target.dataset.id;
        try {
          await deleteTask(id);
          const listItem = event.target.parentElement;
          listItem.remove();
        } catch (error) {
          console.error(error);
        }
      }
      // Handle clicks on the edit button
      if (event.target.classList.contains('edit-button')) {
        event.preventDefault();
        const id = event.target.dataset.id;
        try{
          
          const listItem = event.target.parentElement;
          const amountSpan = listItem.querySelector('span:nth-child(1)');
          const descriptionSpan = listItem.querySelector('span:nth-child(2)');
          const categorySpan = listItem.querySelector('span:nth-child(3)');
      
          // Create a form with the expense data
          const form = document.createElement('form');
          form.id = 'form2';
          form.innerHTML = `
            <label for="amount-input">amount:</label>
            <input id="amount-i" type="text" value="${amountSpan.textContent}">
            <label for="description-input">description:</label>
            <input id="description-i" type="description" value="${descriptionSpan.textContent}">
            <label for="category-input">category:</label>
            <input id="category-i" type="tel" value="${categorySpan.textContent}">
            <button type="submit">Save</button>
            <button type="button" class="cancel-button">Cancel</button>
          `;
          // Replace the list item with the form
          listItem.appendChild(form);
      
          // Attach event listeners to the form submit button and the cancel button
          const saveButton = form.querySelector('button[type="submit"]');
          const cancelButton = form.querySelector('.cancel-button');
          saveButton.addEventListener('click', event => handleSaveClick(event, listItem));
          cancelButton.addEventListener('click', handleCancelClick);
        }catch(e){
          console.log(e);
        }
      
        async function handleSaveClick(event,listItem) {
          event.preventDefault();
          const listItem1 = event.target.parentElement;
          const amountSpan = listItem.querySelector('span:nth-child(1)');
          const descriptionSpan = listItem.querySelector('span:nth-child(2)');
          const categorySpan = listItem.querySelector('span:nth-child(3)');// Get the input values from the form
          const amount = document.getElementById('amount-i').value.trim();
          const description = document.getElementById('description-i').value.trim();
          const category = document.getElementById('category-i').value.trim();
    
          // Validate the input v alues
          if (!amount || !description || !category) {
            return;
          }
    
          // Update the expense in the API
          try{
              const res = await updateData({amount,description,category},id)
              // Update the list item with the updated expense data
              
              listItem1.remove();
              amountSpan.innerHTML = amount;
              descriptionSpan.innerHTML = description;
              categorySpan.innerHTML = category;
          
          }catch(error) {
              console.error(error);
              alert('There was an error updating the expense.');
            }
        }
    
        function handleCancelClick(event) {
          const listItem = event.target.parentElement;
          const id = event.target.dataset.id; 
          listItem.remove();
          
        }
      }
    }
    
})