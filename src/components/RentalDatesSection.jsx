import { incrementTime, decrementTime } from '../utils';

function RentalDatesSection({ formData, onChange, disabled }) {
  const handleTimeIncrement = (fieldName) => {
    const newTime = incrementTime(formData[fieldName]);
    onChange({ target: { name: fieldName, value: newTime } });
  };

  const handleTimeDecrement = (fieldName) => {
    const newTime = decrementTime(formData[fieldName]);
    onChange({ target: { name: fieldName, value: newTime } });
  };

  return (
    <section className="rental-dates">
      <h2>Termin wynajmu</h2>
      <h3>Odbiór</h3>
      <div className="date-time-row">
        <div className="form-group">
          <label htmlFor="pickupDate">Data odbioru *</label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={onChange}
            required
            aria-required="true"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickupHour">Godzina odbioru *</label>
          <div className="input-with-spinner">
            <input
              type="time"
              id="pickupHour"
              name="pickupHour"
              value={formData.pickupHour}
              onChange={onChange}
              required
              aria-required="true"
              disabled={disabled}
            />
            <div className="spinner-buttons">
              <button 
                type="button" 
                className="spinner-btn spinner-up" 
                aria-label="Zwiększ godzinę" 
                tabIndex="-1"
                onClick={() => handleTimeIncrement('pickupHour')}
                disabled={disabled}
              >
                <span aria-hidden="true">▲</span>
              </button>
              <button 
                type="button" 
                className="spinner-btn spinner-down" 
                aria-label="Zmniejsz godzinę" 
                tabIndex="-1"
                onClick={() => handleTimeDecrement('pickupHour')}
                disabled={disabled}
              >
                <span aria-hidden="true">▼</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <h3>Zwrot</h3>
      <div className="date-time-row">
        <div className="form-group">
          <label htmlFor="returnDate">Data zwrotu *</label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate}
            onChange={onChange}
            required
            aria-required="true"
            disabled={disabled}
          />
        </div>
        <div className="form-group">
          <label htmlFor="returnHour">Godzina zwrotu *</label>
          <div className="input-with-spinner">
            <input
              type="time"
              id="returnHour"
              name="returnHour"
              value={formData.returnHour}
              onChange={onChange}
              required
              aria-required="true"
              disabled={disabled}
            />
            <div className="spinner-buttons">
              <button 
                type="button" 
                className="spinner-btn spinner-up" 
                aria-label="Zwiększ godzinę" 
                tabIndex="-1"
                onClick={() => handleTimeIncrement('returnHour')}
                disabled={disabled}
              >
                <span aria-hidden="true">▲</span>
              </button>
              <button 
                type="button" 
                className="spinner-btn spinner-down" 
                aria-label="Zmniejsz godzinę" 
                tabIndex="-1"
                onClick={() => handleTimeDecrement('returnHour')}
                disabled={disabled}
              >
                <span aria-hidden="true">▼</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RentalDatesSection;
