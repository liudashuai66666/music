package com.liuyang.servlet;

import com.liuyang.util.JWTUtils;
import io.jsonwebtoken.io.IOException;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@WebFilter(urlPatterns = {"/song/*","/playlist/*","/user/changeImg","/user/changeMsg"})
public class Interceptor implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化方法，用于过滤器的初始化操作
        // 在此示例中未有任何具体逻辑
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException, java.io.IOException {
        // 过滤器核心方法，用于拦截和处理请求
        System.out.println("服务端拦截请求");

        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;

        String token = req.getHeader("Authorization"); // 从HTTP请求头部获取名为"Authorization"的令牌(token)
        String book = "short_token";
        String tokenFlag = req.getHeader("token_flag");
        if(tokenFlag!=null){
            book="long_token";
        }
        System.out.println(token);
        int flag = JWTUtils.pd(token, book);
        if (flag == 0) {
            // 如果order值为0，表示验证通过，但是要刷新token
            resp.setStatus(201);//401，代表长token没有过期，这时候就要刷新短token了
            System.out.println(201);

            //解析长令牌,用长令牌中的数据来刷新短令牌
            Map<String, Object> map = JWTUtils.checkToken(token);
            Object data = map.get("data");
            String shortToken = JWTUtils.createToken(data);
            String longToken = JWTUtils.createLongToken(data);
            resp.setHeader("token",shortToken);
            resp.setHeader("long_token",longToken);
            System.out.println(shortToken);
            System.out.println(longToken);
            filterChain.doFilter(req, resp);
        } else if (flag == 1) {
            // 如果order值为1，表示短token过期,长token未知；
            resp.setStatus(202); //402，这个前端接收到了表示要重发请求，但是这次要发的是long_token
            System.out.println(202);
            return; // 结束过滤器链，不再继续处理请求
        } else if (flag == 2) {
            // 如果order值为2，表示长token过期了
            resp.setStatus(203); //403，表示前端要直接跳转到登录界面，要用户重新登录
            System.out.println(203);
            return; // 结束过滤器链，不再继续处理请求
        } else {
            // 如果order值不为0、1、2，表示验证过程中发生其他错误
            System.out.println(200);
            filterChain.doFilter(req, resp); // 通过filterChain对象将请求继续传递给下一个过滤器或目标资源
        }
    }

    @Override
    public void destroy() {
        // 销毁方法，在过滤器被销毁之前执行一些清理操作
        // 在此示例中未有任何具体逻辑
    }
}
