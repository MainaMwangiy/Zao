import React, { useEffect, useState } from 'react';
import Security from './Security';
import { FaUser, FaLock, FaUserCircle } from 'react-icons/fa';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [userDetails, setUserDetails] = useState<{ name: string; email: string; phone: string }>({
        name: '',
        email: '',
        phone: '',
    });
    const imageSrc = '';

    // Get the user details from localStorage when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('clientuser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserDetails({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '', // Use phone if available
            });
        }
    }, []);

    // Handle Save Changes (update localStorage)
    const handleSaveChanges = () => {
        localStorage.setItem('clientuser', JSON.stringify(userDetails));
        alert('Changes saved!');
    };

    return (
        <div className="p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
            <div className="container mx-auto p-2">
                {/* Tabs */}
                <div className="flex justify-start space-x-4 mt-4">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex items-center space-x-2 ${activeTab === 'account'
                                ? 'text-pink-500 dark:text-pink-300 border-b-2 border-pink-500'
                                : 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent'
                            } p-2`}
                    >
                        <FaUser />
                        <span>Account</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center space-x-2 ${activeTab === 'security'
                                ? 'text-pink-500 dark:text-pink-300 border-b-2 border-pink-500'
                                : 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent'
                            } p-2`}
                    >
                        <FaLock />
                        <span>Security</span>
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'account' && (
                    <div className="mt-8 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <div className="flex items-center space-x-6">
                                {imageSrc ? (
                                    <img src={imageSrc} alt="Profile" className="w-24 h-24 rounded-full" />
                                ) : (
                                    <FaUserCircle className="text-gray-500" size={96} />
                                )}
                                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Upload New Photo</button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Allowed JPG, GIF, or PNG. Max size of 800K</p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                        value={userDetails.name}
                                        onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                        value={userDetails.email}
                                        onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                        value={userDetails.phone}
                                        onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg mt-4"
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Deactivate Account */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">Deactivate Account</h2>
                            <label className="flex items-center mb-4 space-x-2">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-pink-600" />
                                <span className="text-gray-700 dark:text-gray-300">I confirm my account deactivation</span>
                            </label>

                            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && <Security />}
            </div>
        </div>
    );
};

export default Profile;
