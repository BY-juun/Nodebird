import React, { useCallback } from 'react';
import { Avatar ,Button, Card} from 'antd';
import { useDispatch } from 'react-redux';
import { logoutRequestAction } from '../reducers/user'
// eslint-disable-next-line react/prop-types
const UserProfile = () => {

    const dispatch = useDispatch();
    const onLogOut = useCallback(()=>{
        dispatch(logoutRequestAction());
    },[]);

    return(
        <Card
            actions = {[
                <div key = "twit">짹짹 <br />0</div>,
                <div key = "followings">팔로잉 <br />0</div>,
                <div key = "followings">팔로워 <br />0</div>,
            ]}
        >
            <Card.Meta 
                avatar = {<Avatar>BJ</Avatar>}
                title = "By-juun"
            />
            <Button onClick = {onLogOut}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;