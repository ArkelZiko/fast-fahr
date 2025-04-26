/**
 * File:         EditListingForm.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 23rd, 2025
 * Description:  Component providing a form for users to edit an existing vehicle listing.
 *               Pre-populates fields based on existing data, requires re-uploading photos.
 *               Submits data to the update endpoint and calls onSubmitSuccess callback.
 */

import React, { useState, useEffect, useRef } from 'react';
import { getModelsForMake, getYearOptions } from '../data/selling.js';
import '../css/sellingCSS/createlistingform.css';

/**
 * Renders a form for editing existing car listings.
 * @param {object} props - Component properties.
 * @param {object} props.listingToEdit - The listing object containing initial data.
 * @param {function} props.onSubmitSuccess - Callback on successful update (receives updated listing data).
 * @param {function} props.onClose - Callback to close the modal.
 * @returns {JSX.Element} The EditListingForm component.
 */
function EditListingForm({ listingToEdit, onSubmitSuccess, onClose }) {

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transmission, setTransmission] = useState('');
  const [price, setPrice] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [exteriorColor, setExteriorColor] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [driveType, setDriveType] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [modelOptions, setModelOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (listingToEdit) {
      setTitle(listingToEdit.title || '');
      setMake(listingToEdit.make || '');
      setYear(listingToEdit.year || '');
      setPrice(listingToEdit.price || '');
      setKilometers(listingToEdit.mileage || '');
      setDescription(listingToEdit.description || '');
      setTransmission(listingToEdit.transmission || '');
      setFuelType(listingToEdit.fuelType || '');
      setDriveType(listingToEdit.driveType || '');
      setBodyType(listingToEdit.bodyType || '');
      setExteriorColor(listingToEdit.exteriorColor || '');
      setProvince(listingToEdit.province || '');
      setCity(listingToEdit.city || '');
      setSelectedFiles([]);
      setPreviewUrls(pUrls => {
          pUrls.forEach(url => URL.revokeObjectURL(url));
          return [];
      });
      setMainPhotoIndex(0);
    }
    return () => {
        isMounted.current = false;
        previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [listingToEdit]);


  useEffect(() => {
    if (make) {
      const options = getModelsForMake(make);
      setModelOptions(options);
      if (listingToEdit && listingToEdit.make === make) {
        setModel(listingToEdit.model || '');
      } else {
         if (!listingToEdit || listingToEdit.make !== make) {
             setModel('');
         }
      }
    } else {
      setModelOptions([]);
      setModel('');
    }
  }, [make, listingToEdit]);

   useEffect(() => {
    const currentPreviewUrls = previewUrls;
    return () => {
      currentPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const makes = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen'];
  const transmissionsOptions = ['Automatic', 'Manual'];
  const yearsOptions = getYearOptions();
  const exteriorColors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Yellow', 'Orange', 'Gold', 'Purple', 'Other'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
  const driveTypes = ['RWD', 'FWD', 'AWD', '4WD'];
  const bodyTypes = ['Sedan', 'Coupe', 'Convertible', 'Wagon', 'Hatchback', 'SUV', 'Truck', 'Minivan'];
  const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  const handleMakeChange = (event) => setMake(event.target.value);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const combinedFiles = [...selectedFiles, ...newFiles];
    const limitedFiles = combinedFiles.slice(0, 7);

    if (combinedFiles.length > 7) {
      const addedCount = limitedFiles.length - selectedFiles.length;
      alert(`Max 7 photos. ${addedCount > 0 ? `${addedCount} added.` : 'None added.'} Total: ${limitedFiles.length}.`);
    }

    const oldUrls = [...previewUrls];
    const urls = limitedFiles.map(file => URL.createObjectURL(file));

    if (isMounted.current) {
        setSelectedFiles(limitedFiles);
        setPreviewUrls(urls);
        oldUrls.forEach(url => URL.revokeObjectURL(url));

        if (limitedFiles.length > 0 && mainPhotoIndex >= limitedFiles.length) {
            setMainPhotoIndex(0);
        } else if (limitedFiles.length === 0) {
            setMainPhotoIndex(0);
        }
    } else {
        urls.forEach(url => URL.revokeObjectURL(url));
    }

    event.target.value = null;
  };

  const handleRemovePhoto = (indexToRemove) => {
    const urlToRemove = previewUrls[indexToRemove];
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    const updatedUrls = previewUrls.filter((_, index) => index !== indexToRemove);

    if (isMounted.current) {
        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedUrls);
        URL.revokeObjectURL(urlToRemove);

        if (mainPhotoIndex === indexToRemove) {
        setMainPhotoIndex(0);
        } else if (mainPhotoIndex > indexToRemove) {
        setMainPhotoIndex(mainPhotoIndex - 1);
        }
    } else {
        URL.revokeObjectURL(urlToRemove);
    }
  };

  const handleClearAllPhotos = () => {
    const urlsToRevoke = [...previewUrls];
    if (isMounted.current) {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setMainPhotoIndex(0);
    }
    urlsToRevoke.forEach(url => URL.revokeObjectURL(url));

    const fileInput = document.getElementById('photos-edit');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleSetMainPhoto = (index) => setMainPhotoIndex(index);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError('');

    console.log("Submitting Edit Form - selectedFiles:", selectedFiles);

    if (!listingToEdit || !listingToEdit.id) {
        setSubmitError("Cannot submit edit: Listing data is missing.");
        return;
    }
    if (!make || !model || !year || !title || !description || !transmission || !price || !kilometers || !exteriorColor || !fuelType || !driveType || !bodyType || !province || !city ) {
        setSubmitError("Please fill in all required fields.");
        return;
    }
     if (selectedFiles.length === 0) {
        setSubmitError("Please upload at least one new photo (this replaces old photos).");
        const fileInput = document.getElementById('photos-edit');
        if (fileInput) {
            fileInput.focus();
        }
        return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('listing_id', listingToEdit.id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('year', year);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('transmission', transmission);
    formData.append('price', parseFloat(price).toFixed(2));
    formData.append('mileage', parseInt(String(kilometers).replace(/,/g, ''), 10));
    formData.append('exteriorColor', exteriorColor);
    formData.append('fuelType', fuelType);
    formData.append('driveType', driveType);
    formData.append('bodyType', bodyType);
    formData.append('province', province);
    formData.append('city', city);
    formData.append('mainPhotoIndex', mainPhotoIndex);
    selectedFiles.forEach(file => formData.append('photos[]', file, file.name));

    fetch(`${process.env.REACT_APP_API_BASE}/listings/update_listings.php`, {
      method: 'POST',
      body: formData,
      credentials: "include",
    })
    .then(async response => {
      const text = await response.text();
      if (!response.ok) {
           let errorMsg = `HTTP error ${response.status}`;
           try { const errorData = JSON.parse(text); errorMsg = errorData.error || errorMsg; } catch (e) {}
           throw new Error(errorMsg);
      }
      return text;
    })
    .then(text => {
        const data = JSON.parse(text);
        if (data.success && data.updatedListing) {
          if (onSubmitSuccess) { onSubmitSuccess(data.updatedListing); }
          else { alert('Listing updated!'); if (onClose) onClose(); }
        } else {
           const message = data.error || "Failed to update listing.";
           if (isMounted.current) setSubmitError(message);
        }
    })
    .catch(error => {
       if (isMounted.current) setSubmitError(`Update failed: ${error.message}.`);
    })
    .finally(() => {
       if (isMounted.current) setIsSubmitting(false);
    });
  };

  if (!listingToEdit) {
      return <div className="modal-content"><p>Loading listing data...</p></div>;
  }

  return (
    <form className={`create-listing-form ${isSubmitting ? 'submitting' : ''}`} onSubmit={handleSubmit}>
      <div className="modal-header">
        <h2>Edit Listing</h2>
        <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close" disabled={isSubmitting}>×</button>
      </div>

      {submitError && <div className="submission-error">{submitError}</div>}

        <div className="form-group">
            <label htmlFor="listingTitle-edit">Listing Title <span className="star">*</span></label>
            <input type="text" id="listingTitle-edit" name="listingTitle" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting} maxLength="75"/>
        </div>
        <div className="form-row">
            <div className="form-group">
            <label htmlFor="year-edit">Year <span className="star">*</span></label>
            <select id="year-edit" name="year" value={year} onChange={e => setYear(e.target.value)} required disabled={isSubmitting}>
                <option value="">Select</option>
                {yearsOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            </div>
             <div className="form-group">
                <label htmlFor="make-edit">Make <span className="star">*</span></label>
                <select id="make-edit" name="make" value={make} onChange={handleMakeChange} required disabled={isSubmitting}>
                <option value="">Select</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="model-edit">Model <span className="star">*</span></label>
                <select id="model-edit" name="model" value={model} onChange={e => setModel(e.target.value)} required disabled={!make || modelOptions.length === 0 || isSubmitting}>
                <option value="">{make ? 'Select' : '--'}</option>
                {modelOptions.map(mod => <option key={mod} value={mod}>{mod}</option>)}
                </select>
            </div>
        </div>
         <div className="form-row">
             <div className="form-group">
                 <label htmlFor="kilometers-edit">Kilometers <span className="star">*</span></label>
                 <input type="number" id="kilometers-edit" name="kilometers" value={kilometers} onChange={e => setKilometers(e.target.value)} min="0" required disabled={isSubmitting}/>
             </div>
             <div className="form-group">
                <label htmlFor="transmission-edit">Transmission <span className="star">*</span></label>
                <select id="transmission-edit" name="transmission" value={transmission} onChange={e => setTransmission(e.target.value)} required disabled={isSubmitting}>
                    <option value="">Select</option>
                    {transmissionsOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="driveType-edit">Drive Type <span className="star">*</span></label>
                <select id="driveType-edit" name="driveType" value={driveType} onChange={e => setDriveType(e.target.value)} required disabled={isSubmitting}>
                    <option value="">Select</option>
                    {driveTypes.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                </select>
            </div>
         </div>
          <div className="form-row">
             <div className="form-group">
                 <label htmlFor="bodyType-edit">Body Type <span className="star">*</span></label>
                 <select id="bodyType-edit" name="bodyType" value={bodyType} onChange={e => setBodyType(e.target.value)} required disabled={isSubmitting}>
                     <option value="">Select</option>
                     {bodyTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                 </select>
             </div>
             <div className="form-group">
                 <label htmlFor="exteriorColor-edit">Exterior Colour <span className="star">*</span></label>
                 <select id="exteriorColor-edit" name="exteriorColor" value={exteriorColor} onChange={e => setExteriorColor(e.target.value)} required disabled={isSubmitting}>
                     <option value="">Select</option>
                     {exteriorColors.map(color => <option key={color} value={color}>{color}</option>)}
                 </select>
             </div>
             <div className="form-group">
                 <label htmlFor="fuelType-edit">Fuel Type <span className="star">*</span></label>
                 <select id="fuelType-edit" name="fuelType" value={fuelType} onChange={e => setFuelType(e.target.value)} required disabled={isSubmitting}>
                     <option value="">Select</option>
                     {fuelTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                 </select>
             </div>
         </div>
          <div className="form-row">
             <div className="form-group">
                 <label htmlFor="province-edit">Province <span className="star">*</span></label>
                 <select id="province-edit" name="province" value={province} onChange={e => setProvince(e.target.value)} required disabled={isSubmitting}>
                 <option value="">Select Province</option>
                 {provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                 </select>
             </div>
             <div className="form-group">
                 <label htmlFor="city-edit">City <span className="star">*</span></label>
                 <input type="text" id="city-edit" name="city" value={city} onChange={e => setCity(e.target.value)} required disabled={isSubmitting}/>
             </div>
             <div className="form-group">
                 <label htmlFor="price-edit">Price ($ CAD) <span className="star">*</span></label>
                 <input type="number" id="price-edit" name="price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" required disabled={isSubmitting}/>
             </div>
         </div>
         <div className="form-group">
            <label htmlFor="description-edit">Description <span className="star">*</span></label>
            <textarea id="description-edit" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" maxLength="1500" required disabled={isSubmitting}></textarea>
            <small>{description ? 1500 - description.length : 1500} characters remaining</small>
        </div>

      <div className="form-group">
        <label htmlFor="photos-edit">Upload NEW Photos <span className="star">*</span> (Replaces ALL old photos, Max 7)</label>
        <input type="file" id="photos-edit" name="photos" multiple accept="image/png, image/jpeg" onChange={handleFileChange} disabled={isSubmitting} />
        <small>You must select new photos. Choosing files here will remove all previous images associated with this listing.</small>
        {selectedFiles.length > 0 && ( <button type="button" onClick={handleClearAllPhotos} className="cancel-btn" disabled={isSubmitting}>Clear Selected Photos</button> )}
      </div>

      {previewUrls.length > 0 && (
        <div className="photo-preview-area">
          <p>New Photo Previews: ({selectedFiles.length} / 7)</p>
          <div className="previews-container">
            {previewUrls.map((url, index) => (
              <div key={url} className={`preview-item ${index === mainPhotoIndex ? 'main-photo' : ''}`}>
                <img src={url} alt={`New Preview ${index + 1}`} />
                 <div className="preview-item-actions">
                    <button type="button" className="set-main-photo-btn" onClick={() => handleSetMainPhoto(index)} disabled={isSubmitting || index === mainPhotoIndex} title="Set as main photo">{index === mainPhotoIndex ? '★ Main' : 'Set Main'}</button>
                    <button type="button" className="remove-photo-btn" onClick={() => handleRemovePhoto(index)} title="Remove this photo" disabled={isSubmitting}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
        <button type="submit" className="publish-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</button>
      </div>
    </form>
  );
}

export default EditListingForm;