import React, { useState, useCallback } from 'react';
import { Button, Card, Image, Popover } from 'antd';
import PropTypes, { object } from 'prop-types';
import { Content } from 'antd/lib/layout/layout';
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined,HeartTwoTone } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { useSelector } from 'react-redux';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
    const { me } = useSelector((state) => state.user);
    const id = me?.id;
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [liked, setLiked] = useState(false);
    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);
    return (
        <div>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[ //배열안에 jsx를 넣을 때는 항상 key를 붙여줘야 한다.
                    <RetweetOutlined key="retweet" />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
                        : <HeartOutlined key="heart" onClick={onToggleLike} />,
                    <MessageOutlined key="message" onClick={onToggleComment} />,
                    <Popover key="more" content={(
                        <Button.Group>
                            {id && post.User.id === id
                                ? (
                                    <>
                                        <Button type="primary">수정</Button>
                                        <Button type="danger">삭제</Button>
                                    </>
                                )
                                : <Button>신고</Button>}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined />
                    </Popover>
                ]}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={post.content}
                />
            </Card>
            {commentFormOpened && (
                <div>
                    댓글부분
                </div>
            )}
            {/*<CommentForm />*/}
            {/*<Comments />*/}
        </div>
    );
}


PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.object,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
}
export default PostCard;