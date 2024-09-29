import React from 'react';

const Gallery: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
                <img src="https://pbs.twimg.com/media/FxpaknVWAAISdeU.jpg" alt="Gallery Image" className="w-full" />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4iibNhzC9kEFzH2YN9DIP1yoGExddvSbKRQ&s" alt="Gallery Image" className="w-full" />
            </div>
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Image</button>
            </div>
        </div>
    );
};

export default Gallery;
