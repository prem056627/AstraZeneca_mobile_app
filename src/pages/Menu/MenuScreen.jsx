import React from 'react';
import { ChevronRight, User, Heart, FileCheck, ShieldCheck, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { 
  setIsCompletedKycHistoryModalOpen, 
  setIsKycHistoryModalOpen, 
  setIsMoreProgramPageOpen, 
  setIsProfilePageOpen 
} from '../../slice/patient-detail-form';
import { useTranslation } from 'react-i18next';


import { ReactComponent as Logout } from "../../assets/images/menus1/logout.svg";
import { ReactComponent as Profile } from "../../assets/images/menus1/profile.svg";
import { ReactComponent as Customer } from "../../assets/images/menus1/customer.svg";
import { ReactComponent as Verification } from "../../assets/images/menus1/verification.svg";
import { ReactComponent as Ekyc } from "../../assets/images/menus1/ekyc.svg";
import { ReactComponent as Chevron } from "../../assets/images/menus1/chevron.svg";

const MenuScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Handle menu item clicks
  const handleMenuClick = (menuId, menuTitle) => {
    function handleProfilePage(){
      dispatch(setIsProfilePageOpen(true))
    }

    function handleMoreProgram(){
      dispatch(setIsMoreProgramPageOpen(true))
    }

    function handleKycHistory(){
      dispatch(setIsKycHistoryModalOpen(true))
    }

    function handleCompletedKycHistory(){
      dispatch(setIsCompletedKycHistoryModalOpen(true))
    }
    
    function handleSessionLogout() {
      localStorage.clear();
      let message = {
          label: 'LOGOUT',
      };
      let stringifiedMessage = JSON.stringify(message);

      if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(stringifiedMessage);
      } else {
          window.location.href = '/logout';
      }
    }
  
    switch(menuId) {
      case 1: // Profile
        handleProfilePage()
        break;
      case 2: // Customer Care
        window.location.href = "mailto:support@1mg.com";
        break;
      case 3: // Completed Verification
        handleCompletedKycHistory()
        break;
      case 4: // KYC History
        handleKycHistory()
        break;
      case 5: // View More Programs
        handleMoreProgram()
        break;
      case 6: // Logout
        handleSessionLogout()
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Profile',
      subtitle: 'view more',
      icon: <Profile />
    },
    {
      id: 2,
      title: 'Customer Care',
      subtitle: 'support@1mg.com',
      icon: <Customer />
    },
    {
      id: 3,
      title: 'Completed Verification',
      subtitle: 'view more',
      icon: <Verification />
    },
    {
      id: 4,
      title: 'KYC History',
      subtitle: 'view more',
      icon: <Ekyc />
    },
    {
      id: 6,
      title: 'Logout',
      subtitle: '',
      icon: <Logout />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
   <h1 className="text-2xl font-bold mb-2 font-sans text-black text-[20px] py-6 pl-8">Menu</h1>
      <div className=" mx-6 ">
        {menuItems.map((item, index) => (
          <div 
            key={item.id}
            className="mb-2 bg-[#FFF8FF] border border-[#FFF0F9]  hover:border-primary transition-colors cursor-pointer rounded-lg group"
            onClick={() => handleMenuClick(item.id, item.title)}
            role="button"
            aria-label={`Menu item: ${item.title}`}
          >
            <div className="flex items-center justify-between py-2 px-2">
              <div className="flex items-center gap-4">
                <div>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-gray-900 font-sans font-semibold text-[14px]  transition-colors">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[#565656] font-sans font-regular  text-[12px] mt-0.5 transition-colors">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <Chevron />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuScreen;