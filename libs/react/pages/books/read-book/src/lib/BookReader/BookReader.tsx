import React, { useEffect } from 'react';

import { useBookReaderStyles } from './useBookReaderStyles';

declare var ePubReader: any;

export interface BookReaderProps {
  src: string;
  bookmark: string;
  onLocationChange: (location: string) => void;
}

export function BookReader({ src, bookmark, onLocationChange }: BookReaderProps) {
  const classes = useBookReaderStyles();

  useEffect(() => {
    if (src) {
      const reader = ePubReader(src);

      if (bookmark) {
        reader.rendition.display(bookmark);
      }

      reader.rendition.on('locationChanged', ({ start }) => {
        onLocationChange(start);
      });
    }
  }, [src]);

  return (
    <div className={classes.root}>
      <div id="sidebar">
        <div id="panels">
          <a id="show-Toc" className="show_view icon-list-1 active" data-view="Toc">
            TOC
          </a>
          <a id="show-Bookmarks" className="show_view icon-bookmark" data-view="Bookmarks">
            Bookmarks
          </a>
        </div>
        <div id="tocView" className="view" />
        <div id="searchView" className="view">
          <ul id="searchResults" />
        </div>
        <div id="bookmarksView" className="view">
          <ul id="bookmarks" />
        </div>
        <div id="notesView" className="view">
          <div id="new-note">
            <textarea id="note-text" />
            <button id="note-anchor">Anchor</button>
          </div>
          <ol id="notes" />
        </div>
      </div>
      <div id="main">
        <div id="titlebar">
          <div id="opener">
            <a id="slider" className="icon-menu">
              Menu
            </a>
          </div>
          <div id="metainfo">
            <span id="book-title" />
            <span id="title-seperator">&nbsp;&nbsp;–&nbsp;&nbsp;</span>
            <span id="chapter-title" />
          </div>
          <div id="title-controls">
            <a id="bookmark" className="icon-bookmark-empty">
              Bookmark
            </a>
          </div>
        </div>
        <div id="divider" />
        <div id="prev" className="arrow">
          ‹
        </div>
        <div id="viewer" />
        <div id="next" className="arrow">
          ›
        </div>
        <div id="loader">
          <img src="/assets/images/loader.gif" />
        </div>
      </div>
      <div className="overlay" />
    </div>
  );
}

export default BookReader;
