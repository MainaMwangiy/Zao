import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Security: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="mt-8">
            {/* Security Tab */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Change Password</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

                    {/* Current Password */}
                    <div className="mb-4 relative">
                        <label className="text-gray-700 dark:text-gray-300">Current Password</label>
                        <div className="flex">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-4 relative">
                        <label className="text-gray-700 dark:text-gray-300">New Password</label>
                        <div className="flex">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="mb-4 relative">
                        <label className="text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <div className="flex">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4">
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Save Changes</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default Security;
