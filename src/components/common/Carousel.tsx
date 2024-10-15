import React, { useState } from "react";

interface BlobItem {
    url: string;
    downloadUrl: string;
    pathname: string;
    size: number;
    uploadedAt: string;
}

interface CarouselProps {
    images: BlobItem[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full">
            {/* Carousel Image */}
            <div className="overflow-hidden rounded-lg h-64">
                <img
                    src={images[currentIndex]?.url}
                    alt={`Slide ${currentIndex}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Next and Previous buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10"
                aria-label="Previous Slide"
            >
                &#10094;
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10"
                aria-label="Next Slide"
            >
                &#10095;
            </button>

            {/* Dots for navigation */}
            <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex === index
                            ? "bg-gray-800"
                            : "bg-gray-400 hover:bg-gray-600"
                            }`}
                        aria-label={`Go to slide ${index}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
