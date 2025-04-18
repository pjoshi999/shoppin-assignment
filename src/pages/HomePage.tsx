import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../config/theme";
import SearchBar from "../components/ui/SearchBar";
import GoogleApps from "../components/ui/GoogleApps";
import DiscoverFeed from "../components/ui/DiscoverFeed";
import { GoogleAccountPopup } from "../components/modal/GoogleAccModal";
import { IconButtonProps, IconWrapperProps } from "../types";

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

const IconWrapper = styled.div<IconWrapperProps>`
  color: ${(props) => props.iconColor};
`;

const HomePage = () => {
  const [showAccountPopup, setShowAccountPopup] = useState(false);

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

        <GoogleAccountPopup
          isOpen={showAccountPopup}
          onClose={() => setShowAccountPopup(false)}
        />
      </Container>
    </PageContainer>
  );
};

export default HomePage;
