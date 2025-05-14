import React, { useState, useEffect } from 'react';
import { ReactComponent as HomeLogo_normal } from '../assets/images/menu/Home_normal.svg';
import { ReactComponent as Notify_normal } from '../assets/images/menu/Notify_normal.svg';
import { ReactComponent as Menu_normal } from '../assets/images/menu/menu_normal.svg';

import { ReactComponent as HomeLogo_active } from '../assets/images/menu/Home_active.svg';
import { ReactComponent as Notify_active } from '../assets/images/menu/Notify_active.svg';
import { ReactComponent as Menu_active} from '../assets/images/menu/menu_active.svg';

import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentView, setCurrentView, setIsInitalDataLoad, setViewingOrderHistory } from '../slice/patient-detail-form';

function MenuItem({ label, normalIcon: NormalIcon, activeIcon: ActiveIcon, isActive, onClick }) {
    // Use the appropriate icon component based on active state
    const IconComponent = isActive ? ActiveIcon : NormalIcon;
    
    return (
        <div
            onClick={onClick}
            className={`flex cursor-pointer flex-col items-center justify-between gap-1 ${isActive ? 'text-primary' : 'text-[#595454]'}`}
        >
            <IconComponent 
                className={`${label === 'Menu' ? 'h-7 w-7' : 'h-6 w-6'}`}
            />
            <span className="text-xs">{label}</span>
        </div>
    );
}

function MenuFooter() {
    const dispatch = useDispatch();
    const currentView = useSelector(selectCurrentView);
    const [activeMenu, setActiveMenu] = useState('Home');

    const viewToMenuMap = {
        'home': 'Home',
        'menu': 'Menu',
        'order_history': 'Order History'
    };

    useEffect(() => {
        if (currentView && viewToMenuMap[currentView]) {
            setActiveMenu(viewToMenuMap[currentView]);
        }
    }, [currentView]);

    const menuItems = [
        { 
            label: 'Home', 
            normalIcon: HomeLogo_normal,
            activeIcon: HomeLogo_active
        },
        { 
            label: 'Order History', 
            normalIcon: Notify_normal,
            activeIcon: Notify_active
        },
        { 
            label: 'Menu', 
            normalIcon: Menu_normal,
            activeIcon: Menu_active
        },
    ];

    const handleMenuClick = (key) => {
        setActiveMenu(key);

        if (key === 'Home') {
            dispatch(setCurrentView("home"));
        } else if (key === 'Menu') {
            dispatch(setCurrentView("menu"));
            dispatch(setIsInitalDataLoad(false));
            dispatch(setViewingOrderHistory(false));
        } else if (key === 'Order History') {
            dispatch(setCurrentView("order_history"));
            dispatch(setIsInitalDataLoad(false));
            dispatch(setViewingOrderHistory(false));
        }
    };

    function PoweredByFooter() {
        const phoneNumber = "18002587008";

        return (
            <div className="flex flex-row justify-between items-center mt-2 px-5">
                <div className="flex flex-row items-center">
                    <p className="text-xs text-gray-500 italic">
                        Powered by <span className="font-bold text-black">TATA 1mg</span>
                    </p>
                </div>

                <div className="flex items-center">
                    <span className="text-xs text-gray-500">Contact: </span>
                    <a
                        href={`tel:${phoneNumber}`}
                        className="text-primary font-bold text-xs no-underline"
                    >
                        {phoneNumber}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 w-full">
            <nav className="flex w-full justify-between gap-4 bg-white px-10 py-4 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        label={item.label}
                        normalIcon={item.normalIcon}
                        activeIcon={item.activeIcon}
                        isActive={activeMenu === item.label}
                        onClick={() => handleMenuClick(item.label)}
                    />
                ))}
            </nav>
        </div>
    );
}

export default MenuFooter;