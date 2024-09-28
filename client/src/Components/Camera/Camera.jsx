import React, { useState } from 'react';
import axios from 'axios';
import './Camera.css';

const Camera = ({ userId }) => {
    const [ImageUpload, setImageUpload] = useState(null);
    const [cameraModel, setCameraModel] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const changeCameraModel = () => {
        setCameraModel(true);
    };

    const toggleImageModal = () => {
        setCameraModel(false);
        setPreviewImage(null);
    };

    const handleImageUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', ImageUpload);
            formData.append('userId', userId);

            await axios.post('https://opportunest-1.onrender.com/api/auth/UploadingImage', formData);
            console.log('Image uploaded successfully');
            setCameraModel(false)
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUpload(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result); // Set the preview image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className='camera-svg-div'>
                <svg className='camera-svg' onClick={changeCameraModel} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
            </div>

            {cameraModel && (
                <div className='transparent-div'>
                    <div className='cameraModel-div'>
                        <button className="cameramodel-close-button" onClick={toggleImageModal}>✕</button>
                        <div className='image-input-div'>
                            {previewImage ? (
                                <>
                                    <div className='preview-image-container'>
                                        <img src={previewImage} alt="Preview" className="preview-image" />
                                    </div>
                                    <div className='image-upload-button-div'>
                                        <button className='image-upload-button' onClick={handleImageUpload}>Upload</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <input type='file' className='image-input' onChange={handleFileChange} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Camera;


