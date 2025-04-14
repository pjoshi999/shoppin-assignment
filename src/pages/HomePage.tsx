import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../config/theme";
import SearchBar from "../components/ui/SearchBar";
import GoogleApps from "../components/GoogleApps";
import DiscoverFeed from "../components/discover/DiscoverFeed";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100dvh;
  overflow: hidden;
  background-color: ${theme.colors.background};
  color: ${theme.colors.textPrimary};

  @media (min-width: 768px) {
    background-color: #101218;
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.lg};
  top: 0;
  z-index: 10;
  height: 8.5vh;
`;

// Container for the Google Logo
const LogoContainer = styled.div`
  margin: ${theme.spacing.xxl} 0 ${theme.spacing.xl};
  img {
    display: block;
    height: 61px; // Example height, adjust
    width: auto;
  }
  font-size: 3.5rem;
  font-weight: 500;
  color: #4385f5;

  @media (min-width: 768px) {
    img {
      height: 92px;
    }
  }
`;

// Container to constrain SearchBar width
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #202124;
  padding: 0px 16px;
  @media (min-width: 768px) {
    height: auto;
    background-color: #101218;
  }
`;

const QuickAccessContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

interface IconButtonProps {
  bgColor: string;
}

const IconButton = styled.div<IconButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  height: 48px;
  border-radius: 9999px;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) => props.bgColor};
`;

interface IconWrapperProps {
  iconColor: string;
}

const IconWrapper = styled.div<IconWrapperProps>`
  color: ${(props) => props.iconColor};
`;

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

interface PopupContainerProps {
  isFullscreen: boolean;
}

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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: auto;

  @media (min-width: 768px) {
    height: 91dvh;
    padding-bottom: 36dvh;
  }
`;

const DotSeparator = styled.span`
  &::before {
    content: "•";
  }
`;

interface GoogleAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleAccountPopup: React.FC<GoogleAccountPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  // Lower this threshold for easier testing
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
      console.log(
        "Scrolling, position:",
        scrollTop,
        "threshold:",
        scrollThreshold
      );

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

        {/* Rest of the component remains the same */}
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

// Modified HomePage component with popup integration
const HomePage = () => {
  // const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isListening, setIsListening] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  // const handleSearch = () => {
  //   if (!searchTerm.trim()) return;
  //   console.log("Performing text search for:", searchTerm);
  //   alert(`Searching for: ${searchTerm}`);
  // };

  // const handleMicClick = async () => {
  //   console.log("Mic icon clicked");
  //   setIsListening(!isListening);
  //   if (!isListening) {
  //     alert("Starting microphone listening (demo)...");
  //     setTimeout(() => {
  //       const spokenText = "example spoken text";
  //       setSearchTerm(spokenText);
  //       setIsListening(false);
  //       alert(`Heard: ${spokenText}`);
  //     }, 2500);
  //   } else {
  //     alert("Stopping microphone listening (demo)...");
  //   }
  // };

  // const handleCameraClick = () => {
  //   console.log("Camera icon clicked");
  //   navigate("/lens");
  // };

  const handleUserClick = () => {
    setShowAccountPopup(true);
  };

  return (
    <PageContainer>
      <Header>
        <Link to="https://labs.google/" target="_blank">
          <svg
            width="26"
            height="26"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              d="M17.1778 13.7607L12.0833 5.96232C11.7775 5.50541 11.6077 4.98344 11.6077 4.46125V1.29615H12.0153C12.355 1.29615 12.6266 1.03506 12.6266 0.708906C12.6266 0.415179 12.3548 0.154297 12.0153 0.154297H5.96984C5.63013 0.154297 5.39255 0.415388 5.39255 0.708906C5.39255 1.03527 5.63035 1.29615 5.96984 1.29615H6.37749V4.46125C6.37749 4.98323 6.20764 5.50541 5.93587 5.96232L0.807364 13.7607C-0.0756596 15.2618 1.04516 17.1543 2.87915 17.1543H15.1402C16.9402 17.1543 18.095 15.2618 17.178 13.7607H17.1778ZM6.30933 12.1946C5.29042 12.4883 3.28658 12.162 3.93181 11.1831L6.92059 6.5822C7.32824 5.92968 7.56582 5.21168 7.56582 4.46125V1.29615H10.4527V4.46125C10.4527 5.21168 10.6565 5.92968 11.0639 6.5822L12.796 9.25776C13.1018 9.71467 12.6262 9.94291 12.2527 9.97555C9.53569 10.1714 8.55053 11.5743 6.30911 12.1944L6.30933 12.1946Z"
              fill="white"
            ></path>
          </svg>
        </Link>
        <img
          src="https://lh3.googleusercontent.com/fife/ALs6j_F5MefMO-x1n7aMV1ZICIwtLY_KyyyhAE1WyKNHKSQx-Fg_6BkcfNZDNNB8BM1hA9dj0xtX4X7rs4fijaiiS-8HVbY_1F2eM8gWJp375hDctslSdTf-57Vv1Sc80__sWlVCSTu0WOJ4O1R8IDTUOcmI3rK_wDUL0fi9DxAc1hLRFrDkfa_HZG8qs7NibI18rm-AZj5jW-08v07eA6ujorBiGfhnu9sSiRdXq8MD8XQrKoh8ZqYKw34WLcyzjwImbvqxqcxs7rhqb5Wxkm5fff7BY6IiRAJgxkOCZ-IAc-SoTyzmvna64TzqW4UlWX4rTXmydOZHs-K_79J0PvFJ6Gps3-pMCZ05IU-KPHiuomAMYjPuS-dSEgkYWTONUpude0DKdFST0VdIDRbl1slQKHr-Sj7cA7MRTewod04XnioSfd-O6D1PsysphVmketjUpW34lrY9ucnwb-ylty3F14R4hngEfV_cdRb7D92b_Cbxr_NTQM7cJ4MKfQkelYKxSmzuThnUYuo-p7F9yJUVCIKuwkzd-rlqFLWlUU8Vcs9DqLF7o9Cv-EH18N6JrFo7B42IJcem8eNmiHEx-SI4hAQNW_ryQcphGQ_GLuyCJZdbyI1APrFETdGKm77HiC4v3MhJDwACfOyQmCo5g-mHlRcIZRQxQLfzdmCnxjJUvscfWzfqhcd4k-JUgV9ImCtBcXD0XoJAZnU1R8FFTdEpcWTh2XrluyPKTXJRMiMQib4Gx9-RFR5zoWBf0ziXYWRAUIuwm72T5KRmVjdfRkb09-UvLkloZIjwMGFNymuGmgyMJ2hrQCLeiTZGRDI1piAxbBpO4sSWeKJqb3UeMxYY6pXph6hKBdXGhzYlsX_Pjn1wUybYw3_5BF9IByMuOWCdKlIlPADuIA0yAOBHLWbFji8sVYAh__Pc8Ifv-xxpcTXdSM85BJlWc82kM9lNlFXnuQb9lYe_SPqO9ndeeuEpF0oDkYmvKYhXhRH6A0DN1HOCY5wbM7e_fa6Sz8lXuV7PYvVDAemnaeylpSDWzZ76Cps0q7VkD1---SgJsbhpRp4Lnq84FFi3V0OtzBv-OZD9iGRqdzBFyIUXUsD9TBoc7IXUCroHpVk56wHM4Rp4MaR9KUinP0rHYZOjSGKA0Iwpy5PIxwuNrMw32vSHMQPJtQeB4ki-9ZNtpJSz1YyZ7uKiXx4IJsqWQAi9_AKalUKo7_0OM9u0K7rPIobGjjNpGmBfn_26XeoRar98MyrRSDdrKyepuGvo_c-IYwc2L9Z9ZNOGvD13T4OGTH312KuLJKgdkCgebd-o3G4SyaF7mwrOyoLiINBizrWz_0_0mY2Fc8sHeN4IrBsc6xTtFwrldLWjBSAWwqXppsyCyQqRiRWZ_AJN1tttnzK6_o8I8A0p0xlv796FW-quYybrybZrzsUNE4je-2yJ69zDpL468HEhkALsUSpHe5Z_O8S6apnMy3nVUre0mhYQ8nS3ih6VaGaJ7F-jq9q01xLtz1vGuJhIGnvEtbfU=s64-c"
          alt=""
          onClick={handleUserClick}
          className="h-8 w-8 rounded-full cursor-pointer"
        />
      </Header>

      <Container>
        <LogoContainer>
          <img
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png"
            alt=""
            className="w-52 h-16"
          />
        </LogoContainer>

        <SearchContainer>
          <SearchBar />

          <QuickAccessContainer>
            <IconButton bgColor="#4d4430">
              <IconWrapper iconColor="#f4c956">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                    fill="currentColor"
                  />
                </svg>
              </IconWrapper>
            </IconButton>

            <IconButton bgColor="#363f4e">
              <IconWrapper iconColor="#8ab4f8">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
                    fill="currentColor"
                  />
                </svg>
              </IconWrapper>
            </IconButton>

            <IconButton bgColor="#33423a">
              <IconWrapper iconColor="#81c995">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                    fill="currentColor"
                  />
                </svg>
              </IconWrapper>
            </IconButton>

            <IconButton bgColor="#483034">
              <IconWrapper iconColor="#f28b82">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z"
                    fill="currentColor"
                  />
                </svg>
              </IconWrapper>
            </IconButton>
          </QuickAccessContainer>
        </SearchContainer>

        <GoogleApps />
        <DiscoverFeed />

        {/* Google Account Popup */}
        <GoogleAccountPopup
          isOpen={showAccountPopup}
          onClose={() => setShowAccountPopup(false)}
        />
      </Container>
    </PageContainer>
  );
};

export default HomePage;
