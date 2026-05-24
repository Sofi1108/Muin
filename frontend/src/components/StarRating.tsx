import React from 'react';
import "../styles/StarRating.css"; // Importamos los estilos (Paso 4)

interface StarRatingProps {
  score: number;
  reviewCount: number;
  size?: 'small' | 'large';
  onAddReview?: () => void; // Función para abrir el modal/formulario de reseña
}

// Helper para renderizar estrellas SVG vectoriales 100% compatibles y libres de caché
const StarIcon = ({ type, size }: { type: 'full' | 'half' | 'empty', size: 'small' | 'large' }) => {
  const pixelSize = size === 'small' ? 16 : 24;
  
  if (type === 'full') {
    return (
      <svg width={pixelSize} height={pixelSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFA41C"/>
      </svg>
    );
  }
  
  if (type === 'half') {
    return (
      <svg width={pixelSize} height={pixelSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.86 4.02 4.38.37-3.48 3.01 1 4.28L12 15.4z" fill="#FFA41C"/>
      </svg>
    );
  }
  
  return (
    <svg width={pixelSize} height={pixelSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.48-3.01 4.38-.37L12 6.1l1.86 4.02 4.38.37-3.48 3.01 1 4.28L12 15.4z" fill="#DE7921"/>
    </svg>
  );
};

export const StarRating: React.FC<StarRatingProps> = ({ 
  score, 
  reviewCount, 
  size = 'large',
  onAddReview 
}) => {
  
  // 1. Manejo del estado sin reseñas
  if (reviewCount === 0) {
    if (size === 'small') {
      return <span className="no-reviews-text-sm">There are no reviews</span>;
    }
    return (
      <div className="no-reviews-text-lg">
        <p>There are no reviews currently. Have you purchased this product? Tell us about your experience.</p>
        <button onClick={onAddReview} className="btn-add-review">Add review</button>
      </div>
    );
  }

  // 2. Cálculo de estrellas
  const safeScore = Math.max(0, Math.min(5, Number(score)));
  const roundedScore = Math.round(safeScore * 2) / 2;

  const fullStars = Math.floor(roundedScore);
  const hasHalfStar = roundedScore % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = size === 'small' ? 'estrellas-sm' : 'estrellas-lg';

  // 3. Renderizado
  return (
    <div 
      className={`contenedor-estrellas ${sizeClass}`} 
      aria-label={`Valoración: ${safeScore} de 5 estrellas`}
      title={`${safeScore} de 5`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} type="full" size={size} />
      ))}

      {hasHalfStar && (
        <StarIcon type="half" size={size} />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} type="empty" size={size} />
      ))}
    </div>
  );
};