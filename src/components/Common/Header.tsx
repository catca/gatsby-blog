import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

const HeaderWrapper = styled.header`
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Home = styled(Link)`

`;

const Header: FunctionComponent = function () {
    return (
        <HeaderWrapper>
            <Home to={"/"}>Home</Home>
        </HeaderWrapper>
    );
};

export default Header;
