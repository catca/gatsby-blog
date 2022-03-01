import React, { FunctionComponent, useEffect } from 'react';
import styled from '@emotion/styled';

const FooterWrapper = styled.footer`
  display: grid;
  place-items: center;
  margin-top: auto;
  width: 100%;
  height: 120px;
  padding: 50px 0;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Footer = ({ children }: { children: any }) => {
  if (children[1].props.categories) {
    return (
      <FooterWrapper style={{ color: `${children[1].props.categories[0] === 'canvas' ? '#FFF' : '#000'}` }}>
        저의 블로그를 찾아주셔서 감사합니다. 행복한 하루되세요!💕
      </FooterWrapper>
    );
  } else {
    return (
      <FooterWrapper>
        저의 블로그를 찾아주셔서 감사합니다. 행복한 하루되세요!💕
      </FooterWrapper>
    );
  }
};

export default Footer;