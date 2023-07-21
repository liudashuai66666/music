package com.liuyang.service;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import com.liuyang.pojo.vo.MessageModel;
import com.liuyang.util.GetSqlSession;
import com.liuyang.util.StringUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;


public class UserService {

    /*
    * 登录方法
    * */
    public MessageModel login(String mailbox, String password) throws IOException {
        MessageModel messageModel=new MessageModel();
        //回显数据
        User user = new User();
        user.setMailbox(mailbox);
        user.setPassword(password);
        messageModel.setObject(user);

        //1.参数判断是否为空
        if(StringUtil.isEmpty(mailbox)||StringUtil.isEmpty(password)){
            messageModel.setCode(0);
            messageModel.setMsg("邮箱和密码不能为空");
            System.out.println("邮箱和密码不能为空");
            return messageModel;
        }

        //2.调用dao层的查询方法，通过用户邮箱进行查找
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user1 = mapper.findByMailbox(mailbox);

        //3.判断用户对象是否为空
        if(user1==null){
            messageModel.setMsg("该邮箱未注册！");
            System.out.println("该邮箱未注册");
            messageModel.setCode(0);
            return messageModel;
        }

        //4.比较密码
        if(!user1.getPassword().equals(password)){
            messageModel.setCode(0);
            messageModel.setMsg("密码错误");
            System.out.println("密码错误");
            return messageModel;
        }

        //登录成功
        messageModel.setCode(1);
        messageModel.setObject(user1);
        sqlSession.close();

        return messageModel;
    }

}



















