import React ,{useMemo}from 'react';
import {Form,Input} from 'antd'; 

const NicknameEditForm = () => {
    const style = useMemo(()=>({marginBottom:'20px', border : '1px solid #d9d9d9',padding : "20px", marginTop:'20px'}),[])
    return(
        <Form style = {style}> {/*style적용하는 다른 방법*/}
            <Input.Search addonBefore="닉네임" enterButton = "수정"/>
        </Form>
    );
}

export default NicknameEditForm;