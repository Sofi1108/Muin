import React, { useState } from 'react';
import '../styles/review-modal.css'; // Crearemos este CSS en el paso 3

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: { rating: number; title: string; comment: string }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>, starValue: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left; // cursor position relative to the star
    if (x < width / 2) {
      setHoverRating(starValue - 0.5);
    } else {
      setHoverRating(starValue);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>, starValue: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    if (x < width / 2) {
      setRating(starValue - 0.5);
    } else {
      setRating(starValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, title, comment });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2>Write a Review</h2>
        
        <form onSubmit={handleSubmit} className="review-form">
          {/* Estrellas Interactivas con Soporte de Medias Estrellas */}
          <div className="interactive-stars" style={{ display: 'flex', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const activeVal = hoverRating || rating;
              const size = 32;

              let type: 'full' | 'half' | 'empty' = 'empty';
              if (activeVal >= star) {
                type = 'full';
              } else if (activeVal === star - 0.5) {
                type = 'half';
              }

              let pathD = '';
              let fillColor = '';

              if (type === 'full') {
                pathD = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
                fillColor = "#FFA41C";
              } else if (type === 'half') {
                pathD = "M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.86 4.02 4.38.37-3.48 3.01 1 4.28L12 15.4z";
                fillColor = "#FFA41C";
              } else {
                pathD = "M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.48-3.01 4.38-.37L12 6.1l1.86 4.02 4.38.37-3.48 3.01 1 4.28L12 15.4z";
                fillColor = "#ccc";
              }

              return (
                <svg
                  key={star}
                  width={size}
                  height={size}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onMouseMove={(e) => handleMouseMove(e, star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={(e) => handleClick(e, star)}
                  style={{ display: 'inline-block', transition: 'transform 0.1s ease' }}
                >
                  <path d={pathD} fill={fillColor} />
                </svg>
              );
            })}
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Sum up your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea 
              placeholder="What did you like or dislike?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
            />
          </div>

          <button type="submit" className="btn-submit-review">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};