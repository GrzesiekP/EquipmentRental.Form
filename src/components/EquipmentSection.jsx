import { SETTINGS } from '../settings';
import { equipmentNameToId } from '../utils';

function EquipmentSection({ equipment, onChange, disabled }) {
  const handleQuantityChange = (itemId, value) => {
    const numValue = parseInt(value, 10) || 0;
    onChange(itemId, 'quantity', numValue);
  };

  const handleQuantityIncrement = (itemId) => {
    const currentQuantity = equipment[itemId]?.quantity || 0;
    onChange(itemId, 'quantity', currentQuantity + 1);
  };

  const handleQuantityDecrement = (itemId) => {
    const currentQuantity = equipment[itemId]?.quantity || 0;
    if (currentQuantity > 0) {
      onChange(itemId, 'quantity', currentQuantity - 1);
    }
  };

  const handleCommentsChange = (itemId, value) => {
    onChange(itemId, 'comments', value);
  };

  return (
    <section className="equipment-section">
      <h2>Wybór sprzętu</h2>
      <p className="equipment-instructions">
        Proszę podać ilość rezerwowanego sprzętu. W uwagach można podać numer buta w przypadku rezerwacji raków lub raczków.
      </p>
      <div className="equipment-table" id="equipmentTable" role="table" aria-label="Tabela wyboru sprzętu">
        {/* Table header */}
        <div className="equipment-row header" role="row">
          <div className="col-equipment" role="columnheader">Sprzęt</div>
          <div className="col-quantity" role="columnheader">Ilość</div>
          <div className="col-notes" role="columnheader">Uwagi</div>
        </div>
        
        {/* Equipment rows */}
        {SETTINGS.equipmentItems.map((item) => {
          const itemId = equipmentNameToId(item);
          const quantity = equipment[itemId]?.quantity || 0;
          const comments = equipment[itemId]?.comments || '';
          
          return (
            <div key={itemId} className="equipment-row" data-equipment={item} role="row">
              <div className="col-equipment" role="cell">{item}</div>
              <div className="col-quantity" role="cell">
                <label htmlFor={`quantity-${itemId}`} className="sr-only">Ilość - {item}</label>
                <div className="input-with-spinner">
                  <input
                    type="number"
                    id={`quantity-${itemId}`}
                    name={`quantity-${itemId}`}
                    min="0"
                    step="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                    aria-label={`Ilość - ${item}`}
                    disabled={disabled}
                  />
                  <div className="spinner-buttons">
                    <button 
                      type="button" 
                      className="spinner-btn spinner-up" 
                      aria-label="Zwiększ ilość" 
                      tabIndex="-1"
                      onClick={() => handleQuantityIncrement(itemId)}
                      disabled={disabled}
                    >
                      <span aria-hidden="true">▲</span>
                    </button>
                    <button 
                      type="button" 
                      className="spinner-btn spinner-down" 
                      aria-label="Zmniejsz ilość" 
                      tabIndex="-1"
                      onClick={() => handleQuantityDecrement(itemId)}
                      disabled={disabled}
                    >
                      <span aria-hidden="true">▼</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-notes" role="cell">
                <label htmlFor={`notes-${itemId}`} className="sr-only">Uwagi - {item}</label>
                <input
                  type="text"
                  id={`notes-${itemId}`}
                  name={`notes-${itemId}`}
                  value={comments}
                  onChange={(e) => handleCommentsChange(itemId, e.target.value)}
                  aria-label={`Uwagi - ${item}`}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EquipmentSection;
