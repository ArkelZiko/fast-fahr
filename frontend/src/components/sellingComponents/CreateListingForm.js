import React, { useState, useEffect } from 'react';
import { getModelsForMake, getYearOptions } from '../data/selling.js';
import '../css/sellingCSS/createlistingform.css';

function CreateListingForm({ onSubmit, onClose }) {

  // --- Form Field State ---
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transmission, setTransmission] = useState('');
  const [price, setPrice] = useState('');
  const [kilometers, setKilometers] = useState('');

  // New fields state
  const [exteriorColor, setExteriorColor] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [driveType, setDriveType] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  // --- Photo State ---
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

  // --- Dependent State ---
  const [modelOptions, setModelOptions] = useState([]);

  const makes = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen'];
  const transmissionsOptions = ['Automatic', 'Manual'];
  const yearsOptions = getYearOptions();
  const exteriorColors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Yellow', 'Orange', 'Gold', 'Purple', 'Other'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
  const driveTypes = ['RWD', 'FWD', 'AWD', '4WD'];
  const bodyTypes = ['Sedan', 'Coupe', 'Convertible', 'Wagon', 'Hatchback', 'SUV', 'Truck', 'Minivan'];
  const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  // --- Effects ---

  // TODO: This part below has a lot going on and I'm not really sure if it's optimal or buggy
  //       I had Gemini generate this bottom section for me, so run it through AI for claraficaiton 
  //       of what's going on and possible improvements when it comes to backend integration

  // Update model options when make changes
  useEffect(() => {
    if (make) {
      setModelOptions(getModelsForMake(make));
      setModel(''); // Reset model when make changes
    } else {
      setModelOptions([]);
      setModel('');
    }
  }, [make]);

  // Clean up preview URLs when component unmounts or previews change
  useEffect(() => {
    // This function will be returned and run on cleanup
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]); // Dependency array includes previewUrls


  // --- Event Handlers ---

  const handleMakeChange = (event) => {
    setMake(event.target.value);
  };

  // Handle file selection and preview generation
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const limitedFiles = files.slice(0, 7); // Limit to 7 files

    if (files.length > 7) {
      alert("You can upload a maximum of 7 photos. Only the first 7 were selected.");
    }

    setSelectedFiles(limitedFiles);

    // Revoke previous URLs before creating new ones
    previewUrls.forEach(url => URL.revokeObjectURL(url));

    // Create new preview URLs
    const urls = limitedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Reset main photo index if files change
    setMainPhotoIndex(0);
  };

  // Set main photo
  const handleSetMainPhoto = (index) => {
    setMainPhotoIndex(index);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Expanded validation
    if (!make || !model || !year || !title || !description || !transmission || !price || !kilometers || !exteriorColor || !fuelType || !driveType || !bodyType || !province || !city ) {
        alert("Please fill in all required fields.");
        return;
    }
    //  if (selectedFiles.length === 0) {
    //     alert("Please upload at least one photo.");
    //     return;
    // }

    // Construct form data object
    const listingData = {
      title,
      description,
      year,
      make,
      model,
      transmission,
      price: parseFloat(price).toFixed(2),
      mileage: parseInt(kilometers, 10),
      exteriorColor,
      fuelType,
      driveType,
      bodyType,
      province,
      city,
      // photoCount: selectedFiles.length,
      // mainPhotoIndex 
      // Include which photo is primary
      // In real app, handle actual file uploads (e.g., using FormData API)
    };

    // 
    fetch(`${process.env.REACT_APP_API_BASE}/create/save_listings.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Listing created successfully!');
        if (onClose) onClose();
      } else {
        console.error(data.error || 'Unknown error');
        alert('Failed to create listing. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    });
    
  };

return (
  <form className="create-listing-form" onSubmit={handleSubmit}>
    <div className="modal-header">
      <h2>Create a New Listing</h2>
      <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>

    {/* --- Core Vehicle Info --- */}
    <div className="form-group">
        <label htmlFor="listingTitle">Listing Title <span className="required">*</span></label>
      <input type="text" id="listingTitle" name="listingTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 2021 BMW M3 Competition" maxLength="75" required />
    </div>

    <div className="form-row">
      <div className="form-group">
          <label htmlFor="year">Year <span className="required">*</span></label>
        <select id="year" name="year" value={year} onChange={e => setYear(e.target.value)} required>
          <option value="">Select</option>
          {yearsOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div className="form-group">
          <label htmlFor="make">Make <span className="required">*</span></label>
        <select id="make" name="make" value={make} onChange={handleMakeChange} required>
          <option value="">Select</option>
          {makes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="form-group">
          <label htmlFor="model">Model <span className="required">*</span></label>
        <select id="model" name="model" value={model} onChange={e => setModel(e.target.value)} required disabled={!make || modelOptions.length === 0}>
          <option value="">{make ? 'Select' : '--'}</option>
          {modelOptions.map(mod => <option key={mod} value={mod}>{mod}</option>)}
        </select>
      </div>
    </div>

    {/* --- Technical Specs --- */}
    <div className="form-row">
       <div className="form-group">
            <label htmlFor="kilometers">Kilometers <span className="required">*</span></label>
          <input type="number" id="kilometers" name="kilometers" value={kilometers} onChange={e => setKilometers(e.target.value)} min="0" placeholder="e.g., 15000" required />
        </div>
       <div className="form-group">
            <label htmlFor="transmission">Transmission <span className="required">*</span></label>
          <select id="transmission" name="transmission" value={transmission} onChange={e => setTransmission(e.target.value)} required>
            <option value="">Select</option>
            {transmissionsOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
            <label htmlFor="driveType">Drive Type <span className="required">*</span></label>
          <select id="driveType" name="driveType" value={driveType} onChange={e => setDriveType(e.target.value)} required>
            <option value="">Select</option>
            {driveTypes.map(dt => <option key={dt} value={dt}>{dt}</option>)}
          </select>
        </div>
    </div>

    {/* --- Appearance & Type --- */}
    <div className="form-row">
       <div className="form-group">
            <label htmlFor="bodyType">Body Type <span className="required">*</span></label>
          <select id="bodyType" name="bodyType" value={bodyType} onChange={e => setBodyType(e.target.value)} required>
            <option value="">Select</option>
            {bodyTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </select>
        </div>
        <div className="form-group">
            <label htmlFor="exteriorColor">Exterior Colour <span className="required">*</span></label>
          <select id="exteriorColor" name="exteriorColor" value={exteriorColor} onChange={e => setExteriorColor(e.target.value)} required>
            <option value="">Select</option>
            {exteriorColors.map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
       <div className="form-group">
            <label htmlFor="fuelType">Fuel Type <span className="required">*</span></label>
          <select id="fuelType" name="fuelType" value={fuelType} onChange={e => setFuelType(e.target.value)} required>
            <option value="">Select</option>
            {fuelTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
          </select>
        </div>
    </div>

    {/* --- Location --- */}
     <div className="form-row">
          <div className="form-group">
                <label htmlFor="province">Province <span className="required">*</span></label>
              <select id="province" name="province" value={province} onChange={e => setProvince(e.target.value)} required>
              <option value="">Select Province</option>
              {provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}
              </select>
          </div>
          <div className="form-group">
                <label htmlFor="city">City <span className="required">*</span></label>
              <input type="text" id="city" name="city" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Toronto" required />
          </div>
           <div className="form-group"> {/* Price moved here */}
                <label htmlFor="price">Price ($ CAD) <span className="required">*</span></label>
              <input type="number" id="price" name="price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" placeholder="e.g., 95000.00" required />
          </div>
     </div>

    {/* --- Description --- */}
    <div className="form-group">
        <label htmlFor="description">Description <span className="required">*</span></label>
      <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" maxLength="1500" placeholder="Describe the car's features, condition, history..." required></textarea>
      <small>{1500 - description.length} characters remaining</small>
    </div>

    {/* --- Photo Upload & Preview --- */}
    {/* <div className="form-group">
        <label htmlFor="photos">Upload Photos <span className="required">*</span> (Max 7)</label>
      <input type="file" id="photos" name="photos" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
       <small>Upload up to 7 photos (JPEG, PNG, WEBP). First photo is the main preview by default.</small>
    </div> */}


      {previewUrls.length > 0 && (
        <div className="photo-preview-area">
          <p>Photo Previews:</p>
          <div className="previews-container">
            {previewUrls.map((url, index) => (
              <div key={index} className={`preview-item ${index === mainPhotoIndex ? 'main-photo' : ''}`}>
                <img src={url} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="set-main-photo-btn"
                  onClick={() => handleSetMainPhoto(index)}
                  disabled={index === mainPhotoIndex}
                  title="Set as main photo"
                >
                  {index === mainPhotoIndex ? '★ Main' : 'Set Main'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* --- Form Actions --- */}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="publish-btn">
          <i className="fas fa-plus"></i> Publish Listing
        </button>
      </div>
    </form>
  );
}

export default CreateListingForm;