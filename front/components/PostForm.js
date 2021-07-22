import React ,{useCallback,useState,useRef} from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {addPost} from '../reducers/post'

const PostForm = () => {
    const { imagePaths, postAdded } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const imageInput = useRef();
    const onSubmit = useCallback(() => {
        setText('');
        dispatch(addPost);
      }, []);
    const [text, setText] = useState('');
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
      }, []);

      const onClickImageUpload = useCallback(()=>{
        imageInput.current.click();
      },[imageInput.current]);
    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="오늘은 무슨일이 있었나요" />
            <div style = {{marginTop : "5px"}}>
                <input type="file" multiple hidden ref = {imageInput}/>
                <Button onClick = {onClickImageUpload}>이미지업로드</Button>
                <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
            </div>
            <div>

            </div>
            <div>
                {imagePaths.map((v) => {
                    return (
                        <div key={v} style={{ display: 'inline-block' }}>
                            <img src={'http://localhost:3065/' + v} style={{ width: '200px' }} alt={v} />
                            <div>
                                <Button>제거</Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Form>
    );
};

export default PostForm;