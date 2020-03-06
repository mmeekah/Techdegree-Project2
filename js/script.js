/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/
   
// Study guide for this project - https://drive.google.com/file/d/1OD1diUsTMdpfMDv677TfL1xO2CEkykSz/view?usp=sharing


/*** 
  global variables that store the DOM elements needed to manipulate
   
***/

// List of students per page
const entriesPerPage = 10;


//variable created to store students list
const studentsList = document.querySelectorAll('li.student-item');


//the `showPage` function to hide all of the items in the list except for the ten you want to show.

function showPage(list, page)
{
   const startIndex = entriesPerPage * (page - 1);  // index of first element.
   const endIndex = entriesPerPage * page - 1;      // index of last element.

    for(let i=0; i<list.length; i++)
    {
      if (i >= startIndex  &&  i <= endIndex)      // show it if item included to the page 
            list[i].style.display = '';    
      else                                     // hide it if item doesn't included to the page
            list[i].style.display = 'none';     
    }              
}




 // `appendPageLinks function` to generate, append, and add functionality to the pagination buttons.

 function appendPageLinks(list){

   
    // get the required number of pages for the list items
    const requiredPages = getRequiredPages(list);

   //creating new  DIV element container with class "pagination" and appending it to parent element  with class "page"
  const containerDiv = document.createElement('div');
  containerDiv.className="pagination";

  const pageDiv = document.querySelector('div.page');
  pageDiv.appendChild(containerDiv);

   // creating UL item and append it to the container div element
   const ul = document.createElement('ul');
   containerDiv.appendChild(ul);

    // adding LI element and tags for every page
    for(let i = 1;  i<=requiredPages;  i++)
    {
       // creating LI element (one for each page)
       const li = document.createElement('li');
       ul.appendChild(li);
       
       // creating A link 
       const link = document.createElement('a');
       li.appendChild(link);
       link.href = '#';
       link.text = i;
    }

       // making the first link active
   const firstLink = document.querySelector('div.pagination > ul > li > a');
   firstLink.className = "active";
   
   // adding event listeners to all links 
   const links = document.querySelectorAll('div.pagination > ul > li > a');
   for(let i = 0;  i<links.length;  i++)
   {
         links[i].addEventListener('click', (event) => {
            showPage(list , i+1);       // show the items that belong to the page.
            const targetLink = event.target; 
            activateLink(links, targetLink);    // activate target link and deactivate the rest of them.
         });
   }

 }

// function  that searches for string in a list of items and returns the number of matches found on the list. The function recieves an input text field with a string to search for and the list of items to search in. 

function searchForItem(searchInput, items)
{
   // container for items that matches the input 
   const matchItems = [];  

   for(let i=0; i<items.length; i++)
   {
      // turning text from the input text field to lowercase. 
      const inputString = searchInput.value.toLowerCase();

      // find the the name of the item 
      const h3 = items[i].querySelector('div > h3');
      const itemNameString = h3.innerText.toLowerCase(); 
      const emptyString = (searchInput.value.length === 0);
      
      // a boolean variable that equals true if at least one match has been found. 
      const containsInput = (itemNameString.search(inputString) !== -1);    

      // if matches were found, insert matched item to container.
      if (!emptyString && containsInput)
         matchItems.push(items[i]);                
   }

   // paginating results for matched items results. 
   refreshPage();   
   if (matchItems.length !== 0)
   {
      showPage(matchItems,1);
      appendPageLinks(matchItems);
   }
   
   // returnresult
   return matchItems.length;
}


 
  // This function recieves a list and returns  the number of the pages that are going to be required in order to display all of the elements in that list.

function getRequiredPages(list)
{
   let result = list.length / entriesPerPage;

   if (list.length % entriesPerPage !== 0)
      //  updating results
      result = parseInt(Math.ceil(result));     
   return result;   
}

//This helper function recieves an array of links and a target link. the function activates the target link and deactivates the rest of the links in the array.  

function activateLink(links, targetLink)
{
  // deactivation of all the links. 
  for(let i=0; i<links.length; i++)
      links[i].classList.remove('active');

  // activation of target link.    
  targetLink.classList.add('active');
}

//function dynamically adds a search button and a text field to the screen.  

function appendSearchElements()
{
   // creating search div element and give it a class name.
   const searchDiv = document.createElement('div');
   searchDiv.className = "student-search";

   const pageHeaderDiv = document.querySelector('div.page-header');
   const h2 = document.querySelector('div.page-header > h2');
   pageHeaderDiv.insertBefore(searchDiv,h2);

   // creating text field and add it to the search div
   const input = document.createElement('input');
   input.placeholder = "Search for students...";
   searchDiv.appendChild(input);

   // creating search button and add it to the search div
   const searchButton = document.createElement('button');
   searchButton.textContent = "Search";
   searchDiv.appendChild(searchButton);

   // creating a header to contain the message for the user
   const messageHeader = document.createElement('h3');
   searchDiv.appendChild(messageHeader);  
   messageHeader.innerText = "";

   // adding event listeners
   searchButton.addEventListener('click', (event) => {
      handleEvent(input,messageHeader);      
   });
   input.addEventListener('keyup', (event) => { 
      handleEvent(input,messageHeader);
   });
}

 //function handles user experience.  

function handleEvent(input, messageHeader)
{
   event.preventDefault();
   let results = 0;  

   if (input.value.length !== 0)  
      results = searchForItem(input, studentsList);  
   if (results === 0)
      messageHeader.innerText =  "No results were found.";
   else if (results === 1)
      messageHeader.innerText = "" + results + " result was found.";
   else
      messageHeader.innerText = "" + results + " results were found.";

   if (input.value === "")
   {
      messageHeader.innerText = "";  // clear text field
      refreshPage();
      showPage(studentsList,1);
      appendPageLinks(studentsList);
   }       
}

//this function hides all of the students on the list.  

function hideStudents()
{
   for(let i=0; i<studentsList.length; i++)
      studentsList[i].style.display = 'none';
}


  // This function deletes the links which are currently displayed.  

function hideLinks()
{
   const containerDiv = document.querySelector('div.pagination');
   containerDiv.remove();
}


  // This function refreshes the page.  

function refreshPage()
{
   hideStudents();
   try
   {
      hideLinks();  
   }
   catch(error) 
   {
       console.log("no links to hide"); 
   }
}

// showing original list by default.
showPage(studentsList,1);
appendPageLinks(studentsList);

// calling the appendSearchElements function.
appendSearchElements();
