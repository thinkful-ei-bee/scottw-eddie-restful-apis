import React, { Component } from  'react';
import BookmarkAppContext from '../BookmarkAppContext';

export default class UpdateBookmark extends Component {
  /* state for inputs etc... */
  static contextType = BookmarkAppContext;
  
  render() {
    const {bookmarks, addBookmark, deleteBookmark, updateBookmark} = this.context;

    const bookmarkId = this.props.match.params.bookmarkId;

    const bookmark = bookmarks.find(bookmark=>bookmark.id === bookmarkId);

    return (
      <section className='UpdateBookmarkForm'>
        <h2>Edit Bookmark</h2>
        <form onSubmit={()=>updateBookmark()}>
          <input id="bookmark-name" value={bookmark.name} type="text"></input>
          <input id="bookmark-url" value={bookmark.url}type="text"></input>
          <input id="bookmark-rating" value={bookmark.name} type="text"></input>
          <input id="bookmark-description" value={bookmark.description} type="text"></input>
          <button type="submit">Update</button>
        </form>
        <button onClick={()=> this.props.history.goBack()}>Go Back</button>
      </section>
    )
  }
}