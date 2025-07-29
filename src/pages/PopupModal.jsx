import React from 'react';
import './ContestGameListPage.css';

function PopupModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="creator-modal-overlay" onClick={onClose}>
      <div className="creator-modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default PopupModal; 