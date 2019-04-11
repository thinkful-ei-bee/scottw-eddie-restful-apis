import React from 'react';
import { Link } from 'react-router-dom';
import BookmarkAppContext from '../BookmarkAppContext';

  export default class Bookmark extends React.Component {
    static contextType = BookmarkAppContext;


    render(props){
      const {bookmarks, addBookmark, deleteBookmark, updateBookmark} = this.context;

      const bookmarkId = this.props.match.params.bookmarkId;

      const bookmark = bookmarks.find(bookmark=>bookmark.id === bookmarkId);
      return (
        <li>
          <h3>{bookmark.name}</h3>
          <p>{bookmark.description}</p>
          <p>{bookmark.rating}</p>
          <p>{bookmark.url}</p>
  +       <Link to={`/edit/${props.id}`}>Edit Article</Link>
          <Link to={`/read/${props.id}`}>Read Article</Link>
          <button onClick={()=>deleteBookmark(bookmarkId)}>Delete</button>
        </li>
      )
    }
  }