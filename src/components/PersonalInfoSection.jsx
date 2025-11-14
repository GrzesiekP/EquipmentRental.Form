function PersonalInfoSection({ formData, onChange, disabled }) {
  return (
    <section className="personal-info">
      <h2>Dane osobowe</h2>
      <div className="form-group">
        <label htmlFor="name">Imię *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete="given-name"
          disabled={disabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="surname">Nazwisko *</label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete="family-name"
          disabled={disabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="peselOrdId">PESEL lub ID *</label>
        <input
          type="text"
          id="peselOrdId"
          name="peselOrdId"
          value={formData.peselOrdId}
          onChange={onChange}
          required
          aria-required="true"
          disabled={disabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Telefon *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete="tel"
          disabled={disabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete="email"
          disabled={disabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Adres *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete="street-address"
          disabled={disabled}
        />
      </div>
    </section>
  );
}

export default PersonalInfoSection;
