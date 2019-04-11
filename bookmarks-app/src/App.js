import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import BookmarkAppContext from './BookmarkAppContext';
import Bookmarks from './components/Bookmarks';
import Bookmark from './components/Bookmark';
import AddBookmark from './components/AddBookmark';
import UpdateBookmark from './components/UpdateBookmark';

class App extends Component {

  state = {
    bookmarks: []
  }

  addBookmark(){
    
  }

  deleteBookmark(id){

  }

  updateBookmark(id,values){
    
  }

  render() {
    return (
      <BookmarkAppContext.Provider value={
        {
          bookmarks: this.state.bookmarks,
          addBookmark: this.addBookmark,
          deleteBookmark: (id) => {this.deleteBookmark(id)},
          updateBookmark: (id,values) => {this.updateBookmark(id,values)}
        }
      }>
      <div>
        <Route exact path="/" component={Bookmarks}/>
        <Route exact path="/bookmarks" component={Bookmarks}/>
        <Route exact path="/bookmarks/:bookmarkId" component={Bookmark}/>
        <Route path='/add-bookmark' component={AddBookmark}/>
        <Route path='/edit/:bookmarkId' component={UpdateBookmark}/>
      </div>

      </BookmarkAppContext.Provider>
    );
  }
}

export default App;
