package com.liuyang.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * @Author lyc
 * @Date 2021/06/09
 * @Des 公共的servlet类，通过Java的反射机制，调用请求方法
 */
public abstract class CommentServlet extends HttpServlet {

    /**
     * 需要将requestURI替换调用的字符串，替换掉后得到真正的要查询的方法
     * 每个子类需要覆盖掉该方法，改为自己UrlPattren的值
     */
    public abstract String getUriReplace();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, IOException {
        System.out.println("进来了");

        /**
         * 解决响应乱码
         */
        resp.setContentType("text/html;charset=UTF-8");

        /**
         * 根据子类实现的getUriReplace()方法，替换掉URL标识，找到真正的方法名
         */
        String requestURI = req.getRequestURI();
        String methodName=requestURI.replace(getUriReplace(),"");
        System.out.println(methodName);

        try {
            Method method = getClass().getDeclaredMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            method.invoke(this,req,resp);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
            /**
             * 反射调用方法出错
             *
             */
            resp.getWriter().write("亲，没有你要的服务/(ㄒoㄒ)/~~");
        }
    }
}
