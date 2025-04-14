import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface PopupContainerProps {
  isFullscreen: boolean;
}

interface GoogleAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div<PopupContainerProps>`
  position: absolute;
  width: ${(props) => (props.isFullscreen ? "100%" : "90%")};
  height: ${(props) => (props.isFullscreen ? "100%" : "90%")};
  margin-top: 30px;
  background-color: #202124;
  border-radius: ${(props) => (props.isFullscreen ? "0" : "30px")};
  overflow: auto;
  box-shadow: ${(props) =>
    props.isFullscreen ? "none" : "0 4px 12px rgba(0, 0, 0, 0.3)"};
  color: #e8eaed;
  z-index: 101;
  transition: all 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  left: 20px;
  background: none;
  border: none;
  color: #e8eaed;
  cursor: pointer;
  font-size: 20px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderSection = styled.div`
  padding: 16px;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const GoogleLogo = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0px 20px 16px;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f4511e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 25px;
  position: relative;
  margin-bottom: 8px;
`;

const CameraIcon = styled.div`
  position: absolute;
  right: -4px;
  bottom: -4px;
  background-color: #3c4043;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #202124;
`;

const UserName = styled.div`
  color: #e8eaed;
  font-size: 16px;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  color: #9aa0a6;
  font-size: 14px;
`;

const AccountButton = styled.button`
  background-color: transparent;
  border: 1px solid #5f6368;
  border-radius: 100px;
  color: #e8eaed;
  padding: 8px 24px;
  margin-top: 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: rgba(232, 234, 237, 0.04);
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #5f6368;
  margin: 0;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(232, 234, 237, 0.04);
  }
`;

const MenuIcon = styled.div`
  margin-right: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.div`
  flex: 1;
`;

const MenuRightText = styled.div`
  color: #9aa0a6;
  font-size: 14px;
`;

const SubMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 16px 16px 56px;
  cursor: pointer;

  &:hover {
    background-color: rgba(232, 234, 237, 0.04);
  }
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 16px;
  color: #9aa0a6;
  font-size: 14px;
`;

const DotSeparator = styled.span`
  &::before {
    content: "•";
  }
`;

export const GoogleAccountPopup: React.FC<GoogleAccountPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const scrollThreshold = 10;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Use a more reliable approach for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (!popupRef.current) return;

      const scrollTop = popupRef.current.scrollTop;

      if (scrollTop > scrollThreshold) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    const popupElement = popupRef.current;
    if (popupElement && isOpen) {
      console.log("Adding scroll listener");
      // Use passive event listener for better performance
      popupElement.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (popupElement) {
        console.log("Removing scroll listener");
        popupElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen, scrollThreshold]); // Add dependencies to ensure it recreates when needed

  if (!isOpen) return null;

  return (
    <PopupOverlay>
      <PopupContainer ref={popupRef} isFullscreen={isFullscreen}>
        <HeaderSection>
          <CloseButton onClick={onClose}>✕</CloseButton>
          <GoogleLogo onClick={() => navigate("/")}>
            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png"
              alt=""
              className="w-24 h-8"
            />
          </GoogleLogo>
        </HeaderSection>

        <ProfileSection>
          <div className="flex items-center justify-start text-left w-full gap-5">
            <ProfileImage>
              P
              <CameraIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path
                    d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z"
                    fill="#e7eaee"
                  />
                  <path
                    d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                    fill="#e7eaee"
                  />
                </svg>
              </CameraIcon>
            </ProfileImage>
            <div>
              <UserName>Priyanshu Joshi</UserName>
              <UserEmail>joshi.priyanshu999@gmail.com</UserEmail>
            </div>
          </div>
          <AccountButton>Manage your Google Account</AccountButton>
        </ProfileSection>

        <Divider />

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </MenuIcon>
          <MenuText>Turn on Incognito</MenuText>
        </MenuItem>

        <Divider />

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </MenuIcon>
          <MenuText>Search history</MenuText>
          <MenuRightText>Saving</MenuRightText>
        </MenuItem>

        <SubMenuItem>
          <MenuText>Delete last 15 mins</MenuText>
        </SubMenuItem>

        <Divider />

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </MenuIcon>
          <MenuText>SafeSearch</MenuText>
        </MenuItem>

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
            </svg>
          </MenuIcon>
          <MenuText>Interests</MenuText>
        </MenuItem>

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M21 10h-8.35C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H13l2 2 2-2 2 2 2-2-2-2zM7 15c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
            </svg>
          </MenuIcon>
          <MenuText>Passwords</MenuText>
        </MenuItem>

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </MenuIcon>
          <MenuText>Your profile</MenuText>
        </MenuItem>

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </MenuIcon>
          <MenuText>Search personalisation</MenuText>
        </MenuItem>

        <Divider />

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </MenuIcon>
          <MenuText>Settings</MenuText>
        </MenuItem>

        <MenuItem>
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e8eaed">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </MenuIcon>
          <MenuText>Help and feedback</MenuText>
        </MenuItem>

        <Divider />

        <FooterSection>
          <span>Privacy Policy</span>
          <DotSeparator />
          <span>Terms of Service</span>
        </FooterSection>
      </PopupContainer>
    </PopupOverlay>
  );
};
