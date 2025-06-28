import React, { useEffect, useState } from 'react';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApis';
import { toast } from 'react-toastify';

const Address = () => {
    const user = useSelector((state) => state.user);
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [currentAddress, setCurrentAddress] = useState({
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        mobile: '',
        _id: '',
    });

    useEffect(() => {
        if (user?._id) {
            setCurrentAddress((prev) => ({ ...prev, _id: user._id }));
            const fetchAddresses = async () => {
                try {
                    const response = await axios({
                        ...SummaryApi.getaddress,
                        data: { userId: user._id }
                    });

                    // const response = await axios.get(SummaryApi.getaddress.url,user._id );

                    if (response.data.success) {
                        setAddresses(response.data.data);
                    } else {
                        console.error("Failed to fetch addresses:", response.data.message);
                    }
                } catch (err) {
                    console.error("Error fetching addresses:", err.message);
                }
            };


            fetchAddresses();
        }
    }, [user?._id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (address) => {
        setIsEditing(true);
        setSelectedAddressId(address._id);
        setCurrentAddress({ ...address, _id: user._id });
    };

    const resetForm = () => {
        setIsEditing(false);
        setSelectedAddressId(null);
        setCurrentAddress({
            address_line: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            mobile: '',
            _id: user._id || '',
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!user?._id) return alert("User not found!");

        try {
            const response = await axios({
                ...SummaryApi.addaddress,
                data: currentAddress,
            });

            if (response.data.success) {
                setAddresses((prev) => [...prev, response.data.data]);
                resetForm();
            }
        } catch (err) {
            console.error("Failed to add address:", err.message);
        }
    };


    const handleUpdateAddress = async () => {
        try {
            const response = await axios({
                ...SummaryApi.updateaddress,
                data: { ...currentAddress, _id: selectedAddressId },
            });

            if (response.data.success) {
                setAddresses((prev) =>
                    prev.map((addr) =>
                        addr._id === selectedAddressId ? response.data.data : addr
                    )
                );
                resetForm();
                toast.success(response.data.message || "Address updated successfully!");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update address");
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Addresses</h1>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Addresses</h2>
                        <div className="space-y-4">
                            {addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <div key={address._id} className="bg-white p-5 rounded-lg shadow-md transition-all hover:shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-800">{address.address_line}</p>
                                                <p className="text-gray-600">{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                                                <p className="text-gray-600">{address.country}</p>
                                                <p className="text-gray-600 mt-2">
                                                    <span className="font-semibold">Mobile:</span> {address.mobile}
                                                </p>
                                            </div>
                                            <button onClick={() => handleEditClick(address)} className="text-blue-600 hover:text-blue-800 text-lg">
                                                <FaPencilAlt />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-5 rounded-lg shadow-md text-center">
                                    <p className="text-gray-500">No addresses found. Add one using the form.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                                {isEditing
                                    ? <FaPencilAlt className="mr-3 text-blue-500" />
                                    : <FaPlus className="mr-3 text-green-500" />}
                                {isEditing ? 'Edit Address' : 'Add a New Address'}
                            </h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="address_line" className="block text-sm font-medium text-gray-700">Address Line</label>
                                    <input type="text" name="address_line" id="address_line" value={currentAddress.address_line} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <input type="text" name="city" id="city" value={currentAddress.city} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                                        <input type="text" name="state" id="state" value={currentAddress.state} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                        <input type="text" name="pincode" id="pincode" value={currentAddress.pincode} onChange={handleInputChange} required pattern="\d*" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                        <input type="text" name="country" id="country" value={currentAddress.country} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input type="tel" name="mobile" id="mobile" value={currentAddress.mobile} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="flex justify-end pt-4 space-x-3">
                                    {isEditing ? (
                                        <div className=' flex gap-2'>
                                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold text-sm">
                                                Cancel
                                            </button>

                                            <button type="button" onClick={handleUpdateAddress} className={`px-4 py-2 rounded-md font-semibold text-sm text-white ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                                Update Address
                                            </button>

                                        </div>
                                    ) :
                                        (
                                            <button type="submit" className={`px-4 py-2 rounded-md font-semibold text-sm text-white ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                                Save Address
                                            </button>
                                        )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;
