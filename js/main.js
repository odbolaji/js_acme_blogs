/* main.js
   Implements 21 functions for the final project as specified.
   All code should go in this file (no external libs).
*/

/* 1. createElemWithText */
function createElemWithText(elem = 'p', text = '', className) {
  const el = document.createElement(elem);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}

/* 2. createSelectOptions */
function createSelectOptions(users) {
  if (!users) return undefined;
  const options = [];
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  });
  return options;
}

/* 3. toggleCommentSection */
function toggleCommentSection(postId) {
  if (!postId) return undefined;
  const selector = `section[data-post-id="${postId}"]`;
  const section = document.querySelector(selector);
  if (!section) return null;
  section.classList.toggle('hide');
  return section;
}

/* 4. toggleCommentButton */
function toggleCommentButton(postId) {
  if (!postId) return undefined;
  const selector = `button[data-post-id="${postId}"]`;
  const button = document.querySelector(selector);
  if (!button) return null;
  button.textContent =
    button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
  return button;
}

/* 5. deleteChildElements */
function deleteChildElements(parentElement) {
  // return undefined if no parameter or parameter is not an HTML element
  if (!parentElement || !(parentElement instanceof HTMLElement)) return undefined;

  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

/* 6. addButtonListeners */
function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (!buttons) return buttons;
  buttons.forEach(button => {
    const postId = button.dataset.postId;
    if (postId) {
      const handler = function (event) {
        toggleComments(event, postId);
      };
      button._listener = handler;
      button.addEventListener('click', handler);
    }
  });
  return buttons;
}

/* 7. removeButtonListeners */
function removeButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (!buttons) return buttons;
  buttons.forEach(button => {
    const postId = button.dataset.id || button.dataset.postId;
    if (postId && button._listener) {
      button.removeEventListener('click', button._listener);
      delete button._listener;
    }
  });
  return buttons;
}

/* 8. createComments */
function createComments(comments) {
  // Return undefined if no parameter or if it's not an array
  if (!comments) return undefined;
  if (!Array.isArray(comments)) return undefined;

  const fragment = document.createDocumentFragment();

  comments.forEach(comment => {
    const article = document.createElement('article');
    const h3 = createElemWithText('h3', comment.name);
    const pBody = createElemWithText('p', comment.body);
    const pEmail = createElemWithText('p', `From: ${comment.email}`);
    article.appendChild(h3);
    article.appendChild(pBody);
    article.appendChild(pEmail);
    fragment.appendChild(article);
  });

  return fragment;
}

/* 9. populateSelectMenu */
function populateSelectMenu(users) {
  if (!users) return undefined;
  const selectMenu = document.querySelector('#selectMenu');
  if (!selectMenu) return null;
  const options = createSelectOptions(users);
  if (!options) return selectMenu;
  options.forEach(option => selectMenu.appendChild(option));
  return selectMenu;
}

/* 10. getUsers */
async function getUsers() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('getUsers error:', err);
    return [];
  }
}

/* 11. getUserPosts */
async function getUserPosts(userId) {
  if (!userId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    return await res.json();
  } catch (err) {
    console.error('getUserPosts error:', err);
    return [];
  }
}

/* 12. getUser */
async function getUser(userId) {
  if (!userId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return await res.json();
  } catch (err) {
    console.error('getUser error:', err);
    return {};
  }
}

/* 13. getPostComments */
async function getPostComments(postId) {
  if (!postId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    return await res.json();
  } catch (err) {
    console.error('getPostComments error:', err);
    return [];
  }
}

/* 14. displayComments */
async function displayComments(postId) {
  if (!postId) return undefined;
  const section = document.createElement('section');
  section.dataset.postId = postId;
  section.classList.add('comments', 'hide');
  try {
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    if (fragment) section.appendChild(fragment);
    return section;
  } catch (err) {
    console.error('displayComments error:', err);
    return section;
  }
}

/* 15. createPosts */
async function createPosts(posts) {
  if (!posts) return undefined;
  const fragment = document.createDocumentFragment();
  if (!Array.isArray(posts)) return fragment;

  for (const post of posts) {
    const article = document.createElement('article');

    const h2 = createElemWithText('h2', post.title);
    const pBody = createElemWithText('p', post.body);
    const pId = createElemWithText('p', `Post ID: ${post.id}`);

    const author = await getUser(post.userId);
    const pAuthor = createElemWithText(
      'p',
      `Author: ${author.name} with ${author.company ? author.company.name : ''}`
    );
    const pCompanyCatch = createElemWithText(
      'p',
      author.company ? author.company.catchPhrase : ''
    );

    const button = createElemWithText('button', 'Show Comments');
    button.dataset.postId = post.id;

    const section = await displayComments(post.id);

    article.appendChild(h2);
    article.appendChild(pBody);
    article.appendChild(pId);
    article.appendChild(pAuthor);
    article.appendChild(pCompanyCatch);
    article.appendChild(button);
    article.appendChild(section);

    fragment.appendChild(article);
  }

  return fragment;
}

/* 16. displayPosts */
async function displayPosts(posts) {
  const main = document.querySelector('main');
  if (!main) return null;

  let element;

  // If no posts data is provided (undefined, null, etc.), or empty array,
  // create the default paragraph with class "default-text" with words Select an Employee to display their posts.
  if (!posts || (Array.isArray(posts) && posts.length === 0)) {
    element = createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
  } else {
    element = await createPosts(posts);
  }

  main.appendChild(element);
  return element;
}

/* 17. toggleComments */
function toggleComments(event, postId) {
  if (!postId) return undefined;
  if (event && event.target) event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}

/* 18. refreshPosts */
async function refreshPosts(posts) {
  if (!posts) return undefined;
  const removeButtons = removeButtonListeners();

  const main = document.querySelector('main');
  const mainAfterDelete = deleteChildElements(main);

  const fragment = await displayPosts(posts);

  const addButtons = addButtonListeners();

  return [removeButtons, mainAfterDelete, fragment, addButtons];
}

/* 19. selectMenuChangeEventHandler */
async function selectMenuChangeEventHandler(event) {
  if (!event) return undefined;

  const select = event.target;
  if (select) select.disabled = true;

  // Convert the selected value to a number for userId
  const userId = Number(select.value);

  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);

  if (select) select.disabled = false;

  // The array must contain: userId, posts array, refreshPostsArray
  return [userId, posts, refreshPostsArray];
}

/* 20. initPage */
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

/* 21. initApp */
function initApp() {
  initPage();
  const selectMenu = document.querySelector('#selectMenu');
  if (selectMenu) {
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
  }
}

/* DOMContentLoaded */
document.addEventListener('DOMContentLoaded', initApp);
