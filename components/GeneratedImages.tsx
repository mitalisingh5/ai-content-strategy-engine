import React from 'react';
import Card from './Card';
import { ImageFileIcon } from './Icons';

interface GeneratedImagesProps {
    images?: string[];
    isLoading: boolean;
}

const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images, isLoading }) => {
    return (
        <Card title="Suggested Visuals" icon={<ImageFileIcon className="w-6 h-6 text-primary" />}>
            {isLoading && (
                 <div className="text-center p-8">
                    <p className="text-text-muted-light dark:text-text-muted-dark">Generating creative visuals...</p>
                    <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
            )}
            {!isLoading && images && images.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((imgData, index) => (
                        <div key={index} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img 
                                src={`data:image/jpeg;base64,${imgData}`} 
                                alt={`AI-generated visual ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
             {!isLoading && (!images || images.length === 0) && (
                <div className="text-center p-8">
                    <p className="text-text-muted-light dark:text-text-muted-dark">No images were generated for this strategy.</p>
                </div>
             )}
        </Card>
    );
};

export default GeneratedImages;
