import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(false);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setSearch(location.pathname === "/search");
    }, [location]);

    const redirectToSearch = () => {
        if (!search) {
            navigate('/search');
        }
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full min-w-[300px] lg:min-w-[420px] h-10 lg:h-12 rounded-lg border overflow-hidden 
        flex items-center text-neutral-500 bg-slate-50 group focus-within:border-amber-300">
            <div 
                onClick={handleSearch}
                className="flex items-center justify-center h-full p-3 group-focus-within:text-amber-300 cursor-pointer"
            >
                <FaSearch size={22} />
            </div>
            <div className="w-full">
                {search ? (
                    <div className="max-w-full">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search for something..."
                            className="bg-transparent w-full outline-none px-2"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                ) : (
                    <div className="cursor-pointer px-2" onClick={redirectToSearch}>
                        <TypeAnimation
                            sequence={[
                                'We produce food for Mice',
                                1000,
                                'We produce food for Hamsters',
                                1000,
                                'We produce food for Guinea Pigs',
                                1000,
                                'We produce food for Chinchillas',
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;