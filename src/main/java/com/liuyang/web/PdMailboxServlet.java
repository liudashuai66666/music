package com.liuyang.web;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/pdMailboxServlet")
public class PdMailboxServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        //1.接收邮箱
        String mailbox = request.getParameter("mailbox");

        //2.调用service查询User对象
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user = mapper.findByMailbox(mailbox);
        if(user==null){
            response.getWriter().write("可用");
        }else {
            response.getWriter().write("无用");
        }

        sqlSession.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
