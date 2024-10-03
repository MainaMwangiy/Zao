import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../utils';
import { useSnackbar } from 'notistack';
import Loader from '../common/Loader';
import { FaDownload } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';

type BlobItem = {
    url: string;
    downloadUrl: string;
    pathname: string;
    size: number;
    uploadedAt: string;
};

type BlobsData = {
    hasMore: boolean;
    blobs: BlobItem[];
};

type ListResponse = {
    success: boolean;
    blobs: BlobsData;
};

type ImageUploadResponse = {
    url: {
        url: string;
    };
};


const Gallery: React.FC = () => {
    const [blobs, setBlobs] = useState<BlobItem[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchImages = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<ListResponse>(`${utils.baseUrl}/api/upload/list`);
            setBlobs(response.data.blobs.blobs);
        } catch (error) {
            console.error('Error fetching images:', error);
            enqueueSnackbar("Image loading failed. Please try again.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            enqueueSnackbar("No Images, Please upload one", { variant: "error" });
            return;
        }
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920
            };
            const compressedImage = await imageCompression(imageFile, options);
            const formData = new FormData();
            formData.append('file', compressedImage);
            const response = await axios.post<ImageUploadResponse>(`${utils.baseUrl}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setBlobs((prevBlobs) => [{
                url: response.data.url.url,
                downloadUrl: response.data.url.url + '?download=1',
                pathname: compressedImage.name,
                size: compressedImage.size,
                uploadedAt: new Date().toISOString()
            }, ...prevBlobs]);
            enqueueSnackbar("Upload successful!", { variant: "success" });
        } catch (error) {
            console.error('Error uploading the image', error);
            enqueueSnackbar("Image Upload failed. Please try again.", { variant: "error" });
        }
    };

    return (<div className="container mx-auto px-2 py-6">
        {isLoading ? (
            <Loader />
        ) : (
            <>
                <div className="p-4 max-w-5xl mx-auto mt-10 space-y-8">
                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blobs.length > 0 && blobs.map((blob, index) => (
                            <div key={index} className="rounded-lg overflow-hidden shadow-md dark:shadow-lg relative group">
                                {/* Image Display */}
                                <img src={blob.url} alt={`Gallery Image ${index}`} className="w-full object-cover h-48 transition-transform duration-300 transform group-hover:scale-105" />

                                {/* Overlay with Details */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                    <p className="font-bold text-lg mb-1">{blob.pathname}</p>
                                    <p className="text-sm mb-1">Size: {(blob.size / 1024).toFixed(2)} KB</p>
                                    <p className="text-sm mb-4">Uploaded At: {new Date(blob.uploadedAt).toLocaleString()}</p>

                                    {/* Download Button */}
                                    <button
                                        onClick={() => window.open(blob.downloadUrl, '_blank')}
                                        className="self-start bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 inline-flex items-center space-x-2"
                                    >
                                        <FaDownload className="mr-2" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Card */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                            {/* File Input */}
                            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700">
                                Add Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {/* File Name Display */}
                            <div className="text-gray-700 dark:text-gray-300 flex-1 text-center md:text-left">
                                {imageFile ? imageFile.name : 'No file selected'}
                            </div>
                            {/* Upload Button */}
                            <button
                                onClick={handleImageUpload}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-700 disabled:opacity-50"
                                disabled={!imageFile}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
    );
};

export default Gallery;
