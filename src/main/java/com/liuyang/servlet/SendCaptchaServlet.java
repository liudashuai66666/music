package com.liuyang.servlet;

import com.liuyang.util.Email;
import com.liuyang.util.GetJsonObject;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/sendCaptchaServlet")
public class SendCaptchaServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
        //1.接收邮箱
        String mailbox = jsonRequest.getString("mailbox");
        //2.发送邮箱
        try {
            Email.email(mailbox,response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
