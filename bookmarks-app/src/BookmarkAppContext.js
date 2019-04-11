import React from 'react';

export default React.createContext({
  bookmarks: [],
  addBookmark: () => {},
  deleteBookmark: () => {},
  updateBookmark: () => {},
})
