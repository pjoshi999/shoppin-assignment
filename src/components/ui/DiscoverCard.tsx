import React from "react";
import styled from "styled-components";
import { MdShare, MdMoreVert } from "react-icons/md";
import { theme } from "../../config/theme";
import { getTime } from "../../utils/date";

const CardLinkWrapper = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: ${theme.borderRadius.medium}
  overflow: hidden;
  transition: transform 150ms ease-in-out;
  padding: 7px 15px 0 15px;

  &:hover {
    /* transform: translateY(-2px); */
  };
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  border-radius: 10px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

const ContentWrapper = styled.div`
  padding: ${theme.spacing.sm} 0 0 0;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3; // Show max 3 lines
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SourceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: ${theme.spacing.md};
  width: 100%;
`;

const SourceName = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  font-weight: 500;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const SourceDetails = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  gap: 5px;
`;

// Reusable Icon Button Style (similar to SearchBar's)
const ActionIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  margin-left: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.round};
  width: 36px;
  height: 36px;

  &:hover {
    background-color: ${theme.colors.iconHoverBg};
  }

  svg {
    width: 20px; // Icon size
    height: 20px;
  }
`;

export interface DiscoverCardItem {
  id?: string;
  highlight?: {
    title?: string;
    link?: string;
    thumbnail?: string;
    date?: string;
    source?: {
      icon?: string;
      name?: string;
    };
  };
  title?: string;
  link?: string;
  thumbnail?: string;
  date?: string;
  source?: {
    icon?: string;
    name?: string;
  };
  sourceFaviconUrl?: string;
  timestamp?: string | undefined;
}

const DiscoverCard: React.FC<{ item: DiscoverCardItem }> = ({ item }) => {
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      navigator
        .share({
          title: item.highlight?.title || item?.title,
          url: item.highlight?.link || item?.link,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(`Share: ${item.highlight?.title || item?.title}`);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`More options for: ${item.title}`);
  };

  return (
    <CardLinkWrapper
      href={item.highlight?.link || item?.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {(item.highlight?.thumbnail || item?.thumbnail) && (
        <CardImage
          src={item.highlight?.thumbnail || item?.thumbnail}
          alt=""
          loading="lazy"
        />
      )}

      <ContentWrapper>
        <Title>{item.highlight?.title || item?.title}</Title>

        <SourceInfo>
          <SourceDetails>
            {item.sourceFaviconUrl && (
              <img
                src={item?.highlight?.source?.icon || item?.source?.icon}
                alt={``}
              />
            )}
            <SourceName>
              {item?.highlight?.source?.name || item?.source?.name}
            </SourceName>
            •
            <Timestamp>
              {item?.highlight?.date
                ? getTime(item?.highlight?.date)
                : item?.date
                ? getTime(item?.date)
                : ""}
            </Timestamp>
          </SourceDetails>

          <ActionBar>
            <ActionIconButton
              onClick={handleShareClick}
              aria-label="Share article"
            >
              <MdShare />
            </ActionIconButton>
            <ActionIconButton
              onClick={handleMoreClick}
              aria-label="More options"
            >
              <MdMoreVert />
            </ActionIconButton>
          </ActionBar>
        </SourceInfo>
      </ContentWrapper>
    </CardLinkWrapper>
  );
};

export default DiscoverCard;
