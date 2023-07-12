package com.liuyang.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.liuyang.pojo.vo.MessageModel;
import com.liuyang.service.UserService;


import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

import java.io.PrintWriter;

@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet {
    private UserService service = new UserService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.接收用户数据
        String mailbox = request.getParameter("mailbox");
        String password = request.getParameter("password");
        MessageModel messageModel = service.login(mailbox, password);

        response.setContentType("text/html;charset=utf-8");
        if(messageModel.getCode()==1){
            request.getSession().setAttribute("user",messageModel.getObject());
            response.getWriter().write("登录成功");
            System.out.println("登录成功");
        }else{
            request.getSession().setAttribute("user",messageModel.getObject());
            response.getWriter().write(messageModel.getMsg());
            System.out.println("登录失败");
            //要求数据重县
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
























