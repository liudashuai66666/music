package com.liuyang.web;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.PrintWriter;

@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.接收用户数据
        String mailbox = request.getParameter("mailbox");
        String password = request.getParameter("password");
        System.out.println(mailbox);
        System.out.println(password);

        //2调用mybatis完成查询
        //2.1 获取SqlSessionFactory对象
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        //2.2 获取SqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //2.3 获取mapper对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //2.4 调用方法
        User user = mapper.select(mailbox, password);
        //2.5 释放资源
        sqlSession.close();

        response.setContentType("text/html;charset=utf-8");
        PrintWriter writer = response.getWriter();
        //3. 判断user是否位null
        if(user!=null){
            //登录成功
            writer.write("登录成功");
        }else{
            //登录失败
            writer.write("登录失败");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
