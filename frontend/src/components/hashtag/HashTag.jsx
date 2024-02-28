const StyledHashtag = styled.a`
  color: tomato;
`;
import ReactHashtag from "react-hashtag";
import styled from "styled-components";
const Hashtags = (props) => (
  <ReactHashtag
    renderHashtag={(hashtagValue) => (
      <StyledHashtag href={`/search/${hashtagValue}`}>
        {hashtagValue}
      </StyledHashtag>
    )}
  >
    {props.children}
  </ReactHashtag>
);

const Card = (props) => (
  <p>
    <Hashtags>{props.children}</Hashtags>
  </p>
);
