import React, { useCallback, useState } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
    margin-top : 10px;
`
const FormWrapper = styled(Form)`
    padding : 10px;
`

const LoginForm = ({setisLoggedIn}) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const onChangeId = useCallback((e) => { //Component의 props로 넘겨주는 함수를 usecallback사용!
        setId(e.target.value);
    }, []);

    const onChangePassword = useCallback((e) => { //Component의 props로 넘겨주는 함수를 usecallback사용!
        setPassword(e.target.value);
    }, []);

    const onSubmitForm = useCallback((e) => {
        console.log(id,password);
        setisLoggedIn(true);
    },[id,password]);

    return (
        <FormWrapper onFinish = {onSubmitForm}>
            <div>
                <label htmlFor='user-id'>아이디</label>
                <br />
                <Input name="user-id" onChange={onChangeId}
                    require />
            </div>
            <div>
                <label htmlFor='user-password'>비밀번호</label>
                <br />
                <Input name="user-password"
                    type="password"
                    onChange={onChangePassword}
                    require />
            </div>
            <ButtonWrapper>
                <Button type="primary"
                    htmlType="submit"
                    loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>

        </FormWrapper>
    );
};

export default LoginForm;