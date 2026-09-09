/**
 * StackedCards.jsx
 * Renderiza tarjetas amarillas y rojas superpuestas una sobre otra con estilo realista.
 */

export default function StackedCards({ yellowCards = 0, redCards = 0, priorYellowCount = 0, size = 'sm' }) {
  const hasCards = yellowCards > 0 || redCards > 0 || priorYellowCount >= 4;
  if (!hasCards) return null;

  const isSmall = size === 'sm';
  const cardW = isSmall ? '10px' : '14px';
  const cardH = isSmall ? '14px' : '19px';
  const cardRadius = isSmall ? '2px' : '3px';

  // 1. Tarjeta Roja directa (o combinada con amarilla)
  if (redCards > 0 && yellowCards > 0) {
    // Amarilla y Roja superpuestas
    return (
      <div 
        className="stacked-cards-wrap"
        title="Amonestado y expulsado (Tarjeta Amarilla + Tarjeta Roja)"
        style={{ position: 'relative', width: isSmall ? '18px' : '24px', height: cardH, display: 'inline-block' }}
      >
        <span 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
            border: '1px solid #ca8a04',
            borderRadius: cardRadius,
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            transform: 'rotate(-12deg)',
            zIndex: 1,
            display: 'block'
          }} 
        />
        <span 
          style={{
            position: 'absolute',
            left: isSmall ? '6px' : '8px',
            top: 0,
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
            border: '1px solid #991b1b',
            borderRadius: cardRadius,
            boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
            transform: 'rotate(8deg)',
            zIndex: 2,
            display: 'block'
          }} 
        />
      </div>
    );
  }

  // 2. Dos amarillas superpuestas (doble amonestación)
  if (yellowCards >= 2) {
    return (
      <div 
        className="stacked-cards-wrap"
        title="Doble amonestación (2 Tarjetas Amarillas)"
        style={{ position: 'relative', width: isSmall ? '18px' : '24px', height: cardH, display: 'inline-block' }}
      >
        <span 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
            border: '1px solid #ca8a04',
            borderRadius: cardRadius,
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            transform: 'rotate(-14deg)',
            zIndex: 1,
            display: 'block'
          }} 
        />
        <span 
          style={{
            position: 'absolute',
            left: isSmall ? '6px' : '8px',
            top: 0,
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
            border: '1px solid #ca8a04',
            borderRadius: cardRadius,
            boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
            transform: 'rotate(10deg)',
            zIndex: 2,
            display: 'block'
          }} 
        />
      </div>
    );
  }

  // 3. Roja directa
  if (redCards > 0) {
    return (
      <div 
        className="stacked-cards-wrap"
        title="Expulsado (Tarjeta Roja directa)"
        style={{ display: 'inline-block', width: cardW, height: cardH }}
      >
        <span 
          style={{
            display: 'block',
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
            border: '1px solid #991b1b',
            borderRadius: cardRadius,
            boxShadow: '0 2px 5px rgba(220, 38, 38, 0.4)',
            transform: 'rotate(4deg)'
          }} 
        />
      </div>
    );
  }

  // 4. Una amarilla
  if (yellowCards === 1) {
    return (
      <div 
        className="stacked-cards-wrap"
        title="Amonestado (Tarjeta Amarilla)"
        style={{ display: 'inline-block', width: cardW, height: cardH }}
      >
        <span 
          style={{
            display: 'block',
            width: cardW,
            height: cardH,
            background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
            border: '1px solid #ca8a04',
            borderRadius: cardRadius,
            boxShadow: '0 2px 5px rgba(234, 179, 8, 0.4)',
            transform: 'rotate(4deg)'
          }} 
        />
      </div>
    );
  }

  // 5. Advertencia por acumulación previa
  if (priorYellowCount >= 4) {
    return (
      <span 
        className="stacked-cards-wrap warning-badge"
        title={`Llega con ${priorYellowCount} amarillas (al límite de suspensión)`}
        style={{
          fontSize: '0.62rem',
          fontWeight: 800,
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '3px',
          padding: '0.1rem 0.3rem',
          lineHeight: 1
        }}
      >
        {priorYellowCount}⚠️
      </span>
    );
  }

  return null;
}
