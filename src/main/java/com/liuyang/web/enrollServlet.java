package com.liuyang.web;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

@WebServlet("/enrollServlet")
public class enrollServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //防止读取中文有问题
        request.setCharacterEncoding("UTF-8");
        String uname = request.getParameter("uname");
        System.out.println(uname);
        String mailbox = request.getParameter("mailbox");
        String password = request.getParameter("password");
        String captcha = request.getParameter("captcha");
        //2调用mybatis完成查询
        //2.2 获取SqlSession对象
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        //2.3 获取mapper对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        response.setContentType("text/html;charset=utf-8");
        PrintWriter writer = response.getWriter();

        //2.4 调用方法
        User us = mapper.findByMailbox(mailbox);
        if(us!=null){
            writer.write("该邮箱已经被注册");
        }else{
            User user=new User();
            user.setUsername(uname);
            user.setMailbox(mailbox);
            user.setPassword(password);
            mapper.InsertUser(user);
            writer.write("注册成功");
        }
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();

        //防止中文乱码

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
