import React from 'react';
import AppLayout from "../components/AppLayout";
import {useSelector} from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';


const Home = () => {
    const {isLoggedIn} = useSelector((state)=>state.user);
    const {mainPosts} = useSelector((state)=>state.post);
    return(
        <AppLayout>
            {isLoggedIn && <PostForm />} {/*로그인 한 사람만 글을 쓸 수 있도록*/}
            {mainPosts.map((post)=> <PostCard  key = {post.id} post = {post} style/>)}
        </AppLayout>
    );
}

export default Home;