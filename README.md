# TMF FOLD Project

This project builds from [the react-hooks example](https://github.com/tastejs/todomvc/tree/master/examples/react-hooks) of the [tastejs TodoMVC project](https://todomvc.com/). 

## To Run in Browser

After forking and cloning:

### `npm install`
### `npm run dev`

## Chosen Feature

To this basic todo app, I chose to add tags for todo items and ability to view all items by tag name. 

- The user can select a tag to associate with their todo. When the enter key is pressed, the new todo object saves with label and tag. If no tag is selected, the tag property is saved as an empty string. 
- The user can filter todos by tag. When a tag is selected from the dropdown menu at the bottom of the list of todos, the list rerenders showing only todos associated with the chosen tag. 

While the tags are currently hard coded, I structured my files so that it would be easy to add CRUD operations for tags. 

### Improvements

- Ability to dynamically add, remove or update tags in the tags array
- Ability to edit the tag on a todo object
- Ability to add multiple tags to a todo object

