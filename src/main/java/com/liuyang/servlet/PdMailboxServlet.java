package com.liuyang.servlet;

import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.User;
import com.liuyang.util.GetJsonObject;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/pdMailboxServlet")
public class PdMailboxServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
        //1.接收邮箱
        String mailbox = jsonRequest.getString("mailbox");

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
