package com.liuyang.servlet;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import com.liuyang.util.GetJsonObject;
import com.liuyang.util.GetSqlSession;
import com.liuyang.util.SHA1;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/enrollServlet")
public class EnrollServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //防止读取中文有问题
        request.setCharacterEncoding("UTF-8");
        String mailbox;
        String password;
        String uname;
        if(request.getMethod().equals("GET")){
            mailbox = request.getParameter("mailbox");
            uname = request.getParameter("uname");
            password = request.getParameter("password");
        }else {
            JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
            mailbox= jsonRequest.getString("mailbox");
            password= jsonRequest.getString("password");
            uname = jsonRequest.getString("uname");
        }
        password= SHA1.computeSHA1(password);
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
