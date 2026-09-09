/**
 * ScoreInput & PenaltyInput
 * Replaces leading zero automatically when a new number is typed.
 * Auto-selects on focus for immediate replacement on both desktop and mobile.
 */

export function ScoreInput({ value, onChange, placeholder = '0', style = {}, className = 'form-input', ...props }) {
  const displayVal = (value === '' || value === null || value === undefined) ? '' : value;

  const handleChange = (e) => {
    let raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    // Automatically replace the zero if typing a new number after zero e.g. "05" -> "5"
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }
    const parsed = parseInt(raw, 10);
    onChange(isNaN(parsed) ? '' : parsed);
  };

  const handleBlur = () => {
    if (value === '' || value === null || value === undefined || isNaN(value)) {
      onChange(0);
    }
  };

  return (
    <input
      type="number"
      min="0"
      className={className}
      value={displayVal}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
      onBlur={handleBlur}
      style={style}
      {...props}
    />
  );
}

export function PenaltyInput({ value, onChange, placeholder = '0', style = {}, className = 'form-input', ...props }) {
  const displayVal = (value === '' || value === null || value === undefined) ? '' : value;

  const handleChange = (e) => {
    let raw = e.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }
    const parsed = parseInt(raw, 10);
    onChange(isNaN(parsed) ? null : parsed);
  };

  return (
    <input
      type="number"
      min="0"
      className={className}
      value={displayVal}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={(e) => e.target.select()}
      style={style}
      {...props}
    />
  );
}
