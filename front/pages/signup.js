import React from 'react';
import AppLayout from "../components/AppLayout";
import Head from 'next/head';

const Signup = () => {
    return (
        <>
            <Head>
                <title>회원가입 | Nodebird</title>
            </Head>
            <AppLayout>
                <div>회원가입페이지</div>
            </AppLayout>
        </>
    );
}

export default Signup;