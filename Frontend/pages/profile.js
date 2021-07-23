import React from 'react';
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import Head from 'next/head';

const Profile = () => {
    const followerList = [{nickname : 'by-juun'}, {nickname : 'Hi~'},{nickname : 'Nodebird'}];
    const followingList = [{nickname : 'by-juun'}, {nickname : 'Hi~'},{nickname : 'Nodebird'}];
    return (
        <>
            <Head>
                <title>내 프로필 | Nodebird</title>
            </Head>
            <AppLayout> {/*먼저 가상의 component*/}
                <NicknameEditForm />
                <FollowList header = "팔로잉 목록" data = {followingList}/>
                <FollowList header = "팔로워 목록" data = {followerList}/>
            </AppLayout>
        </>
    );
}

export default Profile;