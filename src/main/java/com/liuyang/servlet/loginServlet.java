package com.liuyang.servlet;


import com.google.gson.Gson;
import com.liuyang.pojo.User;
import com.liuyang.pojo.vo.MessageModel;
import com.liuyang.service.UserService;
import com.liuyang.util.GetJsonObject;
import com.liuyang.util.JWTUtils;
import com.liuyang.util.SHA1;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet {
    private UserService service = new UserService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.接收用户数据
        String mailbox;
        String password;
        if(request.getMethod().equals("GET")){
            mailbox = request.getParameter("mailbox");
            password = request.getParameter("password");
        }else {
            JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
            mailbox= jsonRequest.getString("mailbox");
            password= jsonRequest.getString("password");
        }

        password= SHA1.computeSHA1(password);
        MessageModel messageModel = service.login(mailbox, password);
        response.setContentType("text/html;charset=utf-8");

        Gson gson=new Gson();
        Map<String,Object> data=new HashMap<>();
        if(messageModel.getCode()==1){
            User user= (User) messageModel.getObject();
            //保存Cookie
            Cookie cookie1=new Cookie("avatar",user.getAvatar());
            Cookie cookie2=new Cookie("uname",user.getUsername());
            Cookie cookie3=new Cookie("mailbox",user.getMailbox());
            Cookie cookie4=new Cookie("signature",user.getSignature());
            cookie1.setMaxAge(60*60*24*7);//过期时间设置为7天
            cookie2.setMaxAge(60*60*24*7);
            cookie3.setMaxAge(60*60*24*7);
            cookie4.setMaxAge(60*60*24*7);
            response.addCookie(cookie1);
            response.addCookie(cookie2);
            response.addCookie(cookie3);
            response.addCookie(cookie4);
            //返回数据
            data.put("flag",1);
            request.getSession().setAttribute("user",messageModel.getObject());
            //生成token令牌
            String token= JWTUtils.createToken(mailbox);
            String longToken = JWTUtils.createLongToken(mailbox);
            response.setHeader("token",token);
            response.setHeader("long_token",longToken);
            String json = gson.toJson(data);
            response.getWriter().write(json);
            System.out.println("登录成功");

        }else{
            data.put("flag",0);
            request.getSession().setAttribute("user",messageModel.getObject());
            data.put("msg",messageModel.getMsg());
            String json = gson.toJson(data);
            response.getWriter().write(json);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
























