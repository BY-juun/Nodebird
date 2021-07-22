import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col, Calendar } from 'antd';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import styled from "styled-components";
import {useSelector} from 'react-redux';

const SearchInput = styled(Input.Search)`
    vertical-align : middle;
`;

const AppLayout = ({ children }) => {
    const isLoggedIn = useSelector((state)=>state.user.isLoggedIn);     
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput placeholder="Tag 검색" enterButton />
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}> {/* 24등분 xs 모바일 md 데스크탑*/}
                    {isLoggedIn ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="http://zerocho.com" target="_blank" rel="noreferrer noopenner">Made by Zerocho</a>
                </Col>
            </Row>

        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;